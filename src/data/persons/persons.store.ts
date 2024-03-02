import { defineStore } from 'pinia'
import { useMainStore } from '../main.store'
import { ePersons } from './persons.endpoint'
import type {
  IBlockedPerson,
  IFollowersResponse,
  IFollowingResponse,
  IMutedPerson,
  IPerson,
} from '@/data/persons/persons.interface'
import { useAuthStore } from '../auth/auth.store'
import type { IPage } from '@/data/main.model'
import { i18n } from '@/plugins/0/i18n.plugin'
import { useRequest } from '@/composables/useRequest'
import { get } from 'lodash'
import { parseOptions } from '@/utils/axios.utils'

export const usePersonsStore = defineStore({
  id: 'persons',
  state: () => {
    return {
      loading: false,
      users: {} as IPerson[],
      promiseMap: {},
      mutedPeople: [] as IMutedPerson[],
      blockedPeople: [] as IBlockedPerson[],
      following: [] as any
    }
  },
  actions: {
    async getAllPersons(params = {}, signal?: AbortSignal, showError = true) {
      try {
        this.loading = true
        const { data } = await useApi<IPage<IPerson>>(
          {
            ...ePersons.persons,
            params,
          },
          {
            signal,
          }
        )
        if (data && data.content && data.content.length == 0 && showError) {
          useMainStore().toast({
            type: 'error',
            additionalType: 'member',
            message: i18n('toast.member_title_error'),
            detail: i18n('toast.member_desc_error'),
            life: 10000,
            retryFunc: () => {
              this.getAllPersons(params, signal)
            }
          })
        }
        data.content = data.content.filter((p) => p.id !== useAuthStore().user?.id)
        return data
      } catch (error) {
        if (error.name !== 'CanceledError') {
          useMainStore().toast({
            type: 'error',
            message: i18n('toast.error'),
            detail: get(error, 'response.data.message'),
          })
          throw error
        }
      } finally {
        this.loading = false
      }
    },
    async getPersonById(personId, force?: boolean, showError = true) {
      const id = `${personId}`

      if (!personId) return null
      if (!force && this.users[id]) return this.users[id]
      if (this.promiseMap[id]) {
        return await this.promiseMap[id]
      }
      this.promiseMap[id] = new Promise((resolve, reject) => {
        this.loading = true
        useApi(
          {
            ...ePersons.getPersonById,
          },
          {
            personId,
          }
        )
          .then(({ data }) => {
            this.users = { ...this.users, [id]: data }
            this.promiseMap[id] = undefined
            resolve(data)
          })
          .catch((err) => {
            if (showError) {
              useMainStore().toast({
                type: 'error',
                additionalType: 'member',
                message: i18n('toast.member_title_error'),
                detail: i18n('toast.member_desc_error'),
                life: 10000,
                retryFunc: () => {
                  this.getPersonById(personId, force)
                }
              })
            }
            this.promiseMap[id] = undefined
            reject(err)
          })
          .finally(() => {
            this.loading = false
          })
      })
      return await this.promiseMap[id]
    },
    async getPersons(params = {}) {
      const { data } = await useApi({ ...ePersons.getPerson, params })
      return data
    },
    async updateProfile(body: Partial<IPerson> & { id: string | number }) {
      try {
        this.loading = true
        const { data }: { data: IPerson } = await useApi(
          {
            ...ePersons.updateProfile,
            body,
          },
          {
            personId: body.id?.toString(),
          }
        )

        useMainStore().toast({
          type: 'success',
          message: i18n('toast.success'),
          detail: i18n('profile.update_message'),
        })
        this.refreshUserAfterUpdate(body.id)
        return data
      } catch (error) {
        useMainStore().toast({
          type: 'error',
          message: i18n('toast.error'),
          detail: get(error, 'response.data.message'),
        })
      } finally {
        this.loading = false
      }
    },
    async checkUserName(username: string): Promise<boolean> {
      try {
        await useApi({
          ...ePersons.checkUserName,
          params: { username },
        })
        return true
      } catch (error) {
        return false
      }
    },
    async getFollowers(personId, params = {}) {
      try {
        this.loading = true
        const { data }: { data: IFollowersResponse } = await useApi(
          {
            ...ePersons.followers,
            params,
          },
          { personId }
        )
        const ids = data.content.map((i: any) => i.subscriber.id)
        return data
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
        throw error
      } finally {
        this.loading = false
      }
    },
    async isFollower(personId) {
      const user = useAuthStore().user
      const params = {
        page: 0,
        size: 10,
        query: user?.displayName ?? '',
      }
      const { data } = await useApi(
        {
          ...ePersons.followers,
          params,
        },
        { personId }
      )
      for (const subscribers of data.content) if (subscribers.subscriber.id === user?.id) return true
    },
    async getFollowing(personId, params = {}) {
      Promise.resolve(null)
      try {
        this.loading = true
        const { data }: { data: IFollowingResponse } = await useApi(
          {
            ...ePersons.following,
            params,
          },
          { personId }
        )
        this.following = data.content
        return data
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
        throw error
      } finally {
        this.loading = false
      }
    },
    async followUser(personId) {
      try {
        this.loading = true
        const { data }: { data: IFollowersResponse } = await useApi(ePersons.follow, { personId })
        useAuthStore().following.push(data)
        useMainStore().toast({ type: 'success', message: i18n('toast.follow_user'), detail: i18n('toast.success') })
        return data
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
        throw error
      } finally {
        this.loading = false
      }
    },
    async unFollowUser(personId) {
      try {
        this.loading = true
        const { data }: { data: IFollowersResponse } = await useApi(ePersons.unfollow, { personId })
        useAuthStore().following = useAuthStore().following.filter((i) => i.subscribedTo.id !== personId)
        useMainStore().toast({ type: 'success', message: i18n('toast.unfollow_user'), detail: i18n('toast.success') })
        return data
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
        throw error
      } finally {
        this.loading = false
      }
    },
    async updatePerson(person, params = {}) {
      try {
        const { data } = await useApi(
          {
            ...ePersons.updatePerson,
            body: person,
            params,
          },
          { personId: person.id }
        )
        return data
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.errors[0] })
        throw error
      }
    },
    async inviteFriend(payload: { name: string; email: string; captchaResponse: string; siteKey: string }) {
      const { data } = await useApi({ ...ePersons.inviteFriend, body: payload })
      useMainStore().toast({
        type: 'success',
        message: i18n('settings.success'),
      })
      return data
    },
    async getBlockedPeople() {
      const $auth = useAuthStore()

      if ($auth.user && $auth.user.id) {
        const { data } = await useApi(ePersons.getBlockedPersons, { userId: $auth.user.id })
        this.blockedPeople = data.content
        return data
      }
    },
    async unBlockPeople(id: number) {
      try {
        const { data }: { data: IBlockedPerson } = await useApi(ePersons.unblockPerson, { personId: id })
        const found = this.blockedPeople.find((person) => person.blockedPerson.id === id)
        this.blockedPeople = this.blockedPeople.filter((person) => person.blockedPerson.id !== id)
        useMainStore().toast({
          type: 'success',
          message: i18n('profile.unblock_person', {
            person: `${found?.blockedPerson.firstName} ${found?.blockedPerson.lastName}`,
          }),
        })
        return data
      } catch (err) {
        useMainStore().toast({
          type: 'error',
          message: i18n('toast.error'),
          detail: err?.response?.data?.message,
        })
      }
    },
    async getMutedPeople() {
      const $auth = useAuthStore()
      if ($auth.user && $auth.user.id) {
        const { data } = await useApi(ePersons.getMutedPersons, { userId: $auth.user.id })
        this.mutedPeople = data.content
        return data
      }
    },
    async unMutedPeople(id: number) {
      try {
        const { data }: { data: IMutedPerson } = await useApi(ePersons.unmutePerson, { userId: id })
        const found = this.mutedPeople.find((person) => person.mutedPerson.id === id)
        this.mutedPeople = this.mutedPeople.filter((person) => person.mutedPerson.id !== id)
        useMainStore().toast({
          type: 'success',
          message: i18n('profile.unmute_person', {
            person: `${found?.mutedPerson.firstName} ${found?.mutedPerson.lastName}`,
          }),
        })
        return data
      } catch (err) {
        useMainStore().toast({
          type: 'error',
          message: i18n('toast.error'),
          detail: err?.response?.data?.message,
        })
      }
    },
    async getGroupBans(params = {}) {
      const { data } = await useApi({
        ...ePersons.getGroupBans,
        params,
      })
      return data
    },
    async deleteGroupBan(groupBanId) {
      try {
        const { data } = await useApi(ePersons.deleteGroupBan, { groupBanId })
        useMainStore().toast({
          type: 'success',
          message: i18n('toast.success'),
          detail: i18n('toast.remove_group_ban')
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
    async createGroupBan(payload: { days: number; groupIds: number[]; personId: number; reason: string }) {
      try {
        const { data } = await useApi({
          ...ePersons.createGroupBans,
          body: payload,
        })
        useMainStore().toast({ type: 'success', message: i18n('toast.success'), detail: i18n('moderation.create_ban') })
        return data
      } catch (error) {
        useMainStore().toast({
          type: 'error',
          message: i18n('toast.error'),
          detail: get(error, 'response.data.message'),
        })
      }
    },
    async changePassword(body: { oldPassword: string; password: string; confirmPassword: string }) {
      try {
        const { data } = await useApi<IPage<IPerson>>({
          ...ePersons.changePassword,
          body,
        })
        await useAuthStore().logout()
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
    async deleteAccount() {
      try {
        await useApi<IPage<IPerson>>({
          ...ePersons.deleteAccount,
        })
        await useAuthStore().logout()
      } catch (error) {
        useMainStore().toast({
          type: 'error',
          message: i18n('toast.error'),
          detail: get(error, 'response.data.message'),
        })
        throw error
      }
    },
    refreshUserAfterUpdate(id?: number | string, force = false) {
      if (useAuthStore().user?.id.toString() === id?.toString() || force) {
        useAuthStore().refresh()
      }
    },
    async complaintUser(payload: {
      personId: number
      reason: string
      reasonId: number
      userGroupId: number | undefined
    }) {
      try {
        this.loading = true
        const { data } = await useApi({
          ...ePersons.createComplaints,
          body: payload,
        })
        useMainStore().toast({ type: 'success', message: i18n('toast.success'), detail: i18n('toast.person_complaint_message') })
        return data
      } catch (err) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: err.response.data.message })
      } finally {
        this.loading = true
      }
    },
    async blockPerson(id: number) {
      try {
        const { data }: { data: IBlockedPerson } = await useApi(ePersons.blockPerson, { userId: id })
        this.blockedPeople.push(data)
        useMainStore().toast({
          type: 'success',
          message: i18n('profile.block_person', {
            person: `${data.blockedPerson.firstName} ${data.blockedPerson.lastName}`,
          }),
        })
      } catch (err) {
        useMainStore().toast({
          type: 'error',
          message: i18n('toast.error'),
          detail: err?.response?.data?.message,
        })
      }
    },
    async mutePerson(id: number) {
      try {
        const { data }: { data: IMutedPerson } = await useApi(ePersons.mutePerson, { userId: id })
        this.mutedPeople.push(data)
        useMainStore().toast({
          type: 'success',
          message: i18n('profile.mute_person', {
            person: `${data.mutedPerson.firstName} ${data.mutedPerson.lastName}`,
          }),
        })
      } catch (err) {
        useMainStore().toast({
          type: 'error',
          message: i18n('toast.error'),
          detail: err?.response?.data?.message,
        })
      }
    },
    async getFollowersNotificationSettings(params: any = {}) {
      try {
        const { data } = await useApi({ ...ePersons.getFollowersNotificationsSettings, params })
        return data.content
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
      }
    },
    async getFollowingNotificationSettingsById(followingId) {
      try {
        const { data } = await useApi({ ...ePersons.getFollowingNotificationSettingsById }, { followingId })
        return data.isMuted
      } catch (error) {
        return false
        // useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
      }
    },
    async setFollowerNotificationSettingsById(followingId: number, val: boolean) {
      try {
        await useApi(
          { ...ePersons.setPersonsNotificationsSettings, body: { isMuted: val } },
          { followingId }
        )
        useMainStore().toast({
          type: 'success',
          message: i18n('toast.success'),
          detail: val ? i18n('profile_card.mute_toast') : i18n('profile_card.unmute_toast'),
        })
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
      }
    },
    mutePeople() {
      return useRequest<any, { personId: number }>({
        req: ({ personId }) => parseOptions(ePersons.unmutePerson, { personId }),
        onError: (e: any) =>
          useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: e?.response?.data?.message }),
      })
    }
  },
  getters: {
    cacheUserById: (state) => (id: number | string) => state.users[id],
    cacheUserDisplayNameById: (state) => (id: number | string) => {
      const user = state.users[id]
      return user?.displayName ? user?.displayName : `${user?.firstName} ${user?.lastName}`
    },
    isBlocked: (state) => (id: number | undefined) => state.blockedPeople.find((user) => user.blockedPerson.id === id),
    isMuted: (state) => (id: number | undefined) => state.mutedPeople.find((user) => user.mutedPerson.id === id),
    isFollowing: (state) => (id: number | undefined) => state.following.find((u) => u?.subscribedTo?.id === id)
  },
})
