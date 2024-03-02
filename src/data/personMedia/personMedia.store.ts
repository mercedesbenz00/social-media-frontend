import { defineStore } from 'pinia'
import { useMainStore } from '../main.store'
import { useAuthStore } from '@/data/auth/auth.store'
import { ePersonMedia } from './personMedia.endpoint'
import { i18n } from '@/plugins/0/i18n.plugin'

export const usePersonMediaStore = defineStore({
  id: 'personMedia',
  state: () => {
    return {
      loading: false,
    }
  },
  actions: {
    async setAvatar(payload) {
      const $user = useAuthStore()
      try {
        this.loading = true
        const { data }: { data: any } = await useApi(
          {
            ...ePersonMedia.setAvatar,
            body: payload,
          },
          { personId: $user.user?.id.toString() || '' }
        )
        return data
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
        throw error
      } finally {
        this.loading = false
      }
    },
    async setCover(payload) {
      const $user = useAuthStore()

      try {
        this.loading = true
        const { data }: { data: any } = await useApi(
          {
            ...ePersonMedia.setCover,
            body: payload,
          },
          {
            personId: $user.user?.id.toString() || '',
          }
        )
        return data
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
        throw error
      } finally {
        this.loading = false
      }
    },
    async removeCover () {
      try {
        const $user = useAuthStore()
        const personId = $user.user?.id
        await useApi({ ...ePersonMedia.removeCover }, { personId })
        // useMainStore().toast({ type: 'success', message: i18n('toast.error'), detail: i18n('toast.success') })
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
      }
    },
    async removeAvatar () {
      try {
        const $user = useAuthStore()
        const personId = $user.user?.id
        await useApi({ ...ePersonMedia.removeAvatar }, { personId })
        // useMainStore().toast({ type: 'success', message: i18n('toast.error'), detail: i18n('toast.success') })
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
      }
    }
  },
})
