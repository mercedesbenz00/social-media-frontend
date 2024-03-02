import { defineStore } from 'pinia'
import { useMainStore } from '../main.store'
import { eGroups } from './groups.endpoint'
import { useAuthStore } from '@/data/auth/auth.store'
import type { IPage, IParams } from '@/data/main.model'
import type { IGroup, IGroupMember } from '@/data/groups/groups.interface'
import { get } from 'lodash'
import { i18n } from '@/plugins/0/i18n.plugin'
import type { IPromiseMap } from '../main.interface'

export const useGroupsStore = defineStore({
  id: 'group-store',
  state: () => {
    return {
      loading: false,
      memberInGroups: null as number | null,
      permissions: {} as IPage<any>,
      groups: {} as IGroup[],
      userGroups: null as IGroup[] | null,
      userGroupsLoading: false,
      group: null as IGroup | null,
      promiseMap: {} as IPromiseMap<IGroup>,
      joinRequests: {},
    }
  },
  actions: {
    async getMyGroups(params = {}) {
      const { data } = await useApi<IPage<IGroup>>({ ...eGroups.myGroups, params: { size: 200, ...params } })
      return data
    },
    async getGroups(
      params: IParams,
      type: 'groups' | 'suggestedGroups' | 'popularGroups' | 'topGroups' | 'similarGroups' | 'frequentGroups' = 'groups',
      signal?: AbortSignal
    ) {
      try {
        this.loading = true
        const { data } = await useApi<IPage<IGroup>>(
          {
            ...eGroups[type],
            params,
          },
          {
            signal,
          }
        )
        return data
      } catch (error) {
        if (error.name !== 'CanceledError') {
          useMainStore().toast({
            type: 'error',
            message: i18n('toast.error'),
            detail: get(error, 'response.data.message'),
          })
        }
        throw error
      } finally {
        this.loading = false
      }
    },
    async getManagedGroups(params = {}) {
      try {
        params = { ...{ statuses: 'ADMIN, MODERATOR' }, ...params, }
        const { data } = await useApi({ ...eGroups.permissions, params })
        return data
      } catch (error) {
        useMainStore().toast({
          type: 'error',
          message: i18n('toast.error'),
          detail: get(error, 'response.data.message'),
        })
        throw error
      }
    },
    async getMemberState(groupId: number, memberId: number) {
      try {
        const { data } = await useApi({ ...eGroups.memberState }, { groupId, memberId })
        return data
      } catch (error) {
        return { state: 'NOT MEMBER' }
      }
    },
    async updateMemberState(groupId: number, memberId: number, params = {}) {
      try {
        const { data } = await useApi(
          {
            ...eGroups.updateMemberState,
            params,
          },
          { groupId, memberId }
        )
        useMainStore().toast({
          type: 'success',
          message: i18n('toast.success'),
          detail: i18n('toast.success'),
        })
        return data
      } catch (error) {
        useMainStore().toast({
          type: 'error',
          message: i18n('toast.error'),
          detail: get(error, 'response.data.message'),
        })
      }
    },
    async updateGroup({ groupId, payload }) {
      try {
        this.loading = true
        const { data }: { data: any } = await useApi(
          {
            ...eGroups.updateGroup,
            body: payload,
          },
          {
            groupId,
          }
        )
        useMainStore().toast({
          type: 'success',
          message: i18n('toast.success'),
          detail: i18n('toast.group_updated'),
        })
        return data
      } catch (error) {
        useMainStore().toast({
          type: 'error',
          message: i18n('toast.error'),
          detail: get(error, 'response.data.message'),
        })
        throw error
      } finally {
        this.loading = false
      }
    },

    async getRecentlyJoinedGroups(params?: IParams): Promise<IPage<IGroup>> {
      this.userGroupsLoading = true
      const groupsPage = await this.getMyGroups({ ...params })
      this.userGroupsLoading = false
      if (groupsPage) {
        this.memberInGroups = groupsPage.content.length
        this.userGroups = groupsPage.content
      }

      return groupsPage
    },
    async getSimilarGroups(params?: IParams) {
      return this.getGroups({ ...params }, 'similarGroups')
    },
    async getSuggestedGroups(params?: IParams) {
      return this.getGroups({ ...params }, 'suggestedGroups')
    },
    async getPopularGroups(params?: IParams) {
      return this.getGroups({ ...params }, 'popularGroups')
    },
    async getTopGroups(params?: IParams) {
      return this.getGroups({ ...params }, 'topGroups')
    },
    async getFrequentGroups(params?: IParams) {
      return this.getGroups({ ...params }, 'frequentGroups')
    },
    async removeUserFromGroup(groupId) {
      const user = await useAuthStore().me()
      const minGroups = import.meta.env.APP_MIN_GROUPS
      if (user && user.groupCount <= 5) {
        useMainStore().toast({ type: 'warn', message: i18n('toast.warning'), detail: i18n('group.min_groups', { count: minGroups }) })
        return false
      } else {
        try {
          this.loading = true
          const { data }: { data: any } = await useApi(eGroups.removeUserFromGroup, { groupId })
          const key = this.getGroupJoinRequestKey(groupId)
          if (this.joinRequests[key]) {
            this.joinRequests[key] = undefined
          }
          useMainStore().toast({ type: 'success', message: i18n('toast.success'), detail: i18n('group.left_message') })
          return data
        } catch (error) {
          useMainStore().toast({
            type: 'error',
            message: i18n('toast.error'),
            detail: get(error, 'response.data.message'),
          })
          throw error
        } finally {
          this.loading = false
        }
      }
    },
    async isMember(groupId, memberId?: string | undefined) {
      memberId = memberId || useAuthStore().user?.id.toString()
      if (!memberId) return false
      const { data } = await useApi(eGroups.isMember, { groupId, memberId })
      return data
    },
    async joinGroup(groupId, requiresApproval = false, onboarding: boolean = false) {
      const user = useAuthStore().user
      try {
        this.loading = true
        const { data }: { data: any } = await useApi({ ...eGroups.joinGroup, params: { onboarding } }, { groupId },)
        if (requiresApproval) {
          useMainStore().toast({
            type: 'success',
            message: i18n('toast.success'),
            detail: i18n('group.join_request_sent'),
          })
          this.joinRequests[this.getGroupJoinRequestKey(groupId)] = true
          return true
        } else {
          if (user) user.groupCount += 1
          useMainStore().toast({ type: 'success', message: i18n('toast.success'), detail: i18n('group.join_message') })
        }
        return data
      } catch (error) {
        useMainStore().toast({
          type: 'error',
          message: i18n('toast.error'),
          detail: get(error, 'response.data.message'),
        })
        throw error
      } finally {
        this.loading = false
      }
    },
    async getGroupById(groupId, force?: boolean) {
      const id = `${groupId}`
      if (!groupId) return null
      if (!force && this.groups[id]) {
        this.group = this.groups[id]
        return this.groups[id]
      }
      if (this.promiseMap[id]) {
        return await this.promiseMap[id]
      }

      this.promiseMap[id] = new Promise<IGroup>((resolve, reject) => {
        this.loading = true
        useApi<IGroup>(eGroups.group, { groupId })
          .then(({ data }) => {
            this.groups = { ...this.groups, [id]: data }
            this.promiseMap[id] = undefined
            this.group = data
            resolve(data)
          })
          .catch((err) => {
            this.promiseMap[id] = undefined
            useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: err.response?.data?.message })
            reject(err)
          })
          .finally(() => {
            this.loading = false
          })
      })
      return await this.promiseMap[id]
    },
    async getGroupMembersByGroupId(groupId, params = {}) {
      try {
        this.loading = true
        const { data }: { data: any } = await useApi(
          {
            ...eGroups.members,
            params,
          },
          { groupId }
        )
        return data
      } catch (error) {
        useMainStore().toast({
          type: 'error',
          message: i18n('toast.error'),
          detail: get(error, 'response.data.message'),
        })
        throw error
      } finally {
        this.loading = false
      }
    },
    async getAllCategories(params = {}) {
      const { data } = await useApi<IPage<any>>({
        url: `${eGroups.categories.url}?skipParent=true&sort=groupCount,desc`,
        method: 'get',
        params,
      })
      return data
    },
    async removePermission(groupId, permissionId) {
      try {
        await useApi({ ...eGroups.removePermission }, { groupId, permissionId })
      } catch (error) {
        useMainStore().toast({
          type: 'error',
          message: i18n('toast.error'),
          detail: get(error, 'response.data.message'),
        })
        throw error
      }
    },
    async addPermission(groupId, payload) {
      try {
        const { data } = await useApi({...eGroups.addPermission, body: payload }, { groupId })
        return data
      } catch (error) {
        useMainStore().toast({
          type: 'error',
          message: i18n('toast.error'),
          detail: get(error, 'response.data.message'),
        })
        throw error
      }
    },
    async getPermissions(params = {}, force?: boolean) {
      try {
        if (!force && Object.keys(this.permissions).length) return this.permissions
        this.loading = true
        const { data } = await useApi<IPage<any>>({
          ...eGroups.permissions,
          params,
        })

        this.permissions = data
        return data
      } catch (error) {
        useMainStore().toast({
          type: 'error',
          message: i18n('toast.error'),
          detail: get(error, 'response.data.message'),
        })
        throw error
      } finally {
        this.loading = false
      }
    },
    async getGroupsByCategoryIds(categoryIds: number, params = { size: 3 }) {
      const { data } = await useApi({
        ...eGroups.groups,
        params: {
          ...params,
          categoryIds,
        },
      })

      return data
    },
    async getCategory(categoryId: number) {
      const { data } = await useApi(eGroups.category, { categoryId })
      return data
    },
    async setAvatar({ groupId, payload }) {
      try {
        this.loading = true
        const { data }: { data: any } = await useApi(
          {
            ...eGroups.avatar,
            body: payload,
          },
          { groupId }
        )
        return data
      } catch (error) {
        useMainStore().toast({
          type: 'error',
          message: i18n('toast.error'),
          detail: get(error, 'response.data.message'),
        })
        throw error
      } finally {
        this.loading = false
      }
    },
    async setCover({ groupId, payload }) {
      try {
        this.loading = true
        const { data }: { data: any } = await useApi(
          {
            ...eGroups.cover,
            body: payload,
          },
          { groupId }
        )
        return data
      } catch (error) {
        useMainStore().toast({
          type: 'error',
          message: i18n('toast.error'),
          detail: get(error, 'response.data.message'),
        })
        throw error
      } finally {
        this.loading = false
      }
    },
    getGroupJoinRequestKey(groupId) {
      return `${groupId}-${useAuthStore()?.user?.id}`
    },
    hasJoinRequest(groupId) {
      return this.joinRequests[this.getGroupJoinRequestKey(groupId)] === true ?? false
    },
    async getMutualFriends(groupId: number, params = {}) {
      try {
        const { data } = await useApi({ ...eGroups.mutualFriends, params }, { groupId })
        return data
      } catch (error) {
        useMainStore().toast({
          type: 'error',
          message: i18n('toast.error'),
          detail: get(error, 'response.data.message'),
        })
      }
    },
    async inviteToGroup(groupId: number, memberId: number, first = true) {
      try {
        await useApi({ ...eGroups.invite }, { groupId, memberId })
        useMainStore().toast({ type: 'success', message: i18n('toast.success'), detail: i18n(first ? 'group.send_success' : 'group.resend_success') })
      } catch (error) {
        useMainStore().toast({
          type: 'error',
          message: i18n('toast.error'),
          detail: get(error, 'response.data.message'),
        })
      }
    },
    async getGroupsNotificationSettingsById(groupId) {
      try {
        const { data } = await useApi({ ...eGroups.getGroupNotificationSettingsById }, { groupId})
        return data.isMuted
      } catch (error) {
        return false
        // useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
      }
    },
    async getGroupsNotificationSettings(params = {}) {
      try {
        const { data } = await useApi({ ...eGroups.getGroupsNotificationSettings, params })
        return data.content
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
      }
    },
    async getGroupNotificationSettingsById(groupId: number) {
      try {
        const { data } = await useApi(eGroups.getGroupNotificationSettingsById, { groupId })
        if (data) return data.muted
      } catch (error) {
        return false
      }
    },
    async setGroupNotificationSettings(id: number, val: boolean) {
      try {
        await useApi({ ...eGroups.setGroupNotificationsSettings, body: { isMuted: val } }, { groupId: id.toString() })
        useMainStore().toast({
          type: 'success',
          message: i18n('toast.success'),
          detail: val ? i18n('group.mute_toast') : i18n('group.unmute_toast'),
        })
      } catch (error) {
        useMainStore().toast({
          type: 'error',
          message: i18n('toast.error'),
          detail: get(error, 'response.data.message'),
        })
      }
    },
  },
  getters: {
    isAdmin(state) {
      const p = state.permissions?.content?.filter((p) => p.userGroup.id === state.group?.id) ?? []
      if (!p?.length) return false
      return p.filter((p) => p.permission === 'ADMIN').length > 0
    },
    isAdminByGroupId: (state) => (groupId) => {
      const permissions = state.permissions?.content?.filter((p) => p.userGroup.id == groupId)
      if (!permissions?.length) return false
      return permissions.filter((p) => p.permission == 'ADMIN').length > 0
    },
    isModerator(state) {
      const p = state.permissions?.content?.filter((p) => p.userGroup.id === state.group?.id) ?? []
      if (!p?.length) return false
      return p.filter((p) => p.permission === 'MODERATOR').length > 0
    },
    isModeratorbyGroupId: (state) => (groupId) => {
      const p = state.permissions?.content?.filter((p) => p.userGroup.id === groupId)
      if (!p?.length) return false
      return p.filter((p) => p.permission === 'MODERATOR').length > 0
    }
  },
})
