import { defineStore } from 'pinia'
import { eNotifications } from './notifications.endpoint'
import { useMainStore } from '@/data/main.store'
import { i18n } from '@/plugins/0/i18n.plugin'
import type { INotification } from './notifications.interface'

export const useNotificationsStore = defineStore({
  id: 'notifications',
  state: () => {
    return {
      notifications: [] as INotification[],
      newNotifications: [] as INotification[],
      oldNotifications: [] as INotification[],
      totalNotifications: 0 as number,
      totalNewNotifications: 0 as number,
      loading: false as boolean,
      pushToken: '' as string,
      isAuthenticated: false as boolean,
    }
  },
  actions: {
    async getNotifications(params = {} as any) {
      this.loading = true
      params = {
        size: 10,
        ...params,
      }
      const { data } = await useApi({ ...eNotifications.getNotifications, params })
      if (params.state === 'NEW') {
        this.newNotifications = [...this.newNotifications, ...data.content]
        this.totalNewNotifications = data.totalElements
      } else if (params.state === 'READ') {
        this.oldNotifications = [...this.oldNotifications, ...data.content]
        this.totalNotifications = data.totalElements + this.totalNewNotifications
      } else {
        this.notifications = [...this.notifications, ...data.content]
        this.totalNotifications = data.totalElements
      }
      this.loading = false
    },
    async updateNotifications(notificationIds: string[], state: string) {
      const params = { notificationIds, state }
      await useApi({ ...eNotifications.updateNotifications, params })
      if (state == 'DELETED')
        this.notifications = this.notifications.filter((notification) => notification.id != notificationIds[0])
      this.notifications.forEach((notification: INotification) => {
        if (notificationIds.includes(notification.id)) notification.state = 'READ'
      })
    },
    async allNotificationsRead(ids: string[]) {
      this.updateNotifications(ids, 'READ')
    },
    async updateToken(token: string) {
      try {
        const { data } = await useApi({
          url: eNotifications.updateToken.url,
          params: {
            pushToken: token,
            device: 'web',
          },
          method: 'put',
        })
        this.pushToken = token
        this.isAuthenticated = true
        return data
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error?.response?.data?.message })
      }
    },
    async logout() {
      if (!this.isAuthenticated) return
      await useApi({ ...eNotifications.removeToken, params: { pushToken: this.pushToken, device: 'web' } })
    },
  },
})
