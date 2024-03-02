/* eslint-disable no-console */
import { useChatStore } from './../chat/chat.store'
import { defineStore } from 'pinia'
import { useMainStore } from '../main.store'
import { ACCESS_TOKEN, REFRESH_TOKEN, REMEMBER } from '@/constants/global.constants'
import { eAuth } from './auth.endpoint'
import type { IAuthUser, ITokenResponse } from './auth.interface'
import { useAssets } from '@/composables/useAssets'
import { useNotification } from '@/composables/useNotification'
import { useGroupsStore } from '@/data/groups/groups.store'
import { usePersonsStore } from '../persons/persons.store'
import { i18n } from '@/plugins/0/i18n.plugin'
import { useNotificationsStore } from '../notifications/notifications.store'
import { useOnboardingStore } from '../onboarding/onboarding.store'
import type { IGroup } from '../groups/groups.interface'

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      user: null as IAuthUser | null,
      following: [] as any,
      fetching: false,
      credentials: {} as any,
      mePromise: null as Promise<any> | null,
      refreshPromise: null as Promise<any> | null,
      minGroups: 1,
      minInterests: 1
    }
  },
  actions: {
    async init() {
      const access = useCookie().get(ACCESS_TOKEN)
      const refresh = useCookie().get(REFRESH_TOKEN)
      if (access || refresh) {
        await this.me()
        useOnboardingStore().init()
      }
    },
    getUserAvatar() {
      return this.user?.avatar?.path || useAssets('no-avatar.svg')
    },
    async token(payload: { credential: string; password: string }) {
      if (this.user) return
      const { credential, password } = payload
      const body = {
        email: credential,
        password,
      }

      try {
        const { data }: { data: ITokenResponse } = await useApi({
          ...eAuth.token,
          body,
        })
        this.setTokens(data, true)

        this.me()

        this.$router.push(this.$router.currentRoute.value.query?.redirect?.toString() ?? '/')

        return data
      } catch (error) {
        this.credentials = payload
        const type = error.response.status === 404 ? 'error' : 'warn'
        const message = error.response.status === 404 ? i18n('toast.wrong_credentials') : i18n('toast.warning')
        const detail = error.response.data.message
        if (type === 'warn') {
          useNotification().showModal({
            title: message,
            subtitle: detail,
            type: type,
          })
        } else {
          useMainStore().toast({ type, message, detail })
        }
        throw error
      }
    },
    async signup(payload: {
      credential: string
      password: string
      confirmPassword: string
      captchaResponse: string
      siteKey: string
    }) {
      try {
        const { data } = await useApi({ ...eAuth.signup, body: payload })
        this.credentials = payload
        return data
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
      }
    },
    async resend(payload: { captchaResponse: string; siteKey: string }) {
      if (!this.credentials) return
      try {
        const { credential } = this.credentials
        const body = {
          email:credential,
          ...payload,
        }
        await useApi({ ...eAuth.resend, body })
        useMainStore().toast({ type: 'success', message: i18n('toast.success'), detail: i18n('toast.success') })
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
      }
    },
    async socialLogin(payload: { providerName: string; accessToken: string }) {
      try {
        const { data }: { data: ITokenResponse } = await useApi({
          url: `${eAuth.token.url}/${payload.providerName}`,
          method: 'post',
          body: { accessToken: payload.accessToken },
        })
        this.setTokens(data, true)
        this.me()

        this.$router.push('/')
        return data
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
      }
    },
    async me(forceRequest = false): Promise<IAuthUser | undefined> {
      const $groups = useGroupsStore()

      if (this.user && !forceRequest) return this.user

      if (!useCookie().get(ACCESS_TOKEN)) return
      try {
        this.fetching = !forceRequest

        if (!this.mePromise) {
          this.mePromise = new Promise((resolve) => {
            useApi({ ...eAuth.me })
              .then((res) => {
                this.user = res.data
                setTimeout(() => {
                  $groups.getPermissions({
                    size: 100,
                    personId: this.user?.id,
                    statuses: 'ADMIN,MODERATOR',
                  })
                  usePersonsStore()
                    .getFollowing(this.user?.id)
                    .then((r) => {
                      if (r) this.following = r.content
                      const chat = useChatStore()
                      chat.initClient()
                    })
                })
                this.mePromise = null
                resolve(res.data)
              })
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              .catch((e) => {
                this.mePromise = null
              })
          })

          return await this.mePromise
        } else {
          return await this.mePromise
        }
      } finally {
        this.fetching = false
      }
    },
    async refresh() {
      const { data } = await useApi({ ...eAuth.me })
      this.user = data
      return data
    },
    async resetPassword(payload: {
      email: string
      code: string
      password: string
      confirmationPassword: string
      captchaResponse: string
      siteKey: string
    }) {
      try {
        await useApi({ ...eAuth.resetPassword, body: payload })
        useMainStore().toast({
          type: 'success',
          message: i18n('auth.reset_success_message'),
          detail: i18n('toast.success'),
        })
        await this.token({ credential: payload.email, password: payload.password })
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
        throw error
      }
    },
    async forgotPassword(payload: { email: string; captchaResponse: string; siteKey: string }) {
      try {
        const { data } = await useApi({ ...eAuth.forgotPassword, body: payload })
        useMainStore().toast({
          type: 'success',
          message: i18n('auth.forget_message'),
          detail: i18n('toast.success'),
        })
      // globals.$router.push('/auth/login')
      return data
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
        throw error
      }
    },
    async refreshToken() {
      if (this.refreshPromise) return await this.refreshPromise
      this.refreshPromise = new Promise((resolve, reject) => {
        const token = useCookie().get(REFRESH_TOKEN)
        const access = useCookie().get(ACCESS_TOKEN)
        const remember = useCookie().get(REMEMBER)
        if (!token || !remember || !access) {
          this.logout()

          return reject()
        }
        useCookie().remove(REFRESH_TOKEN, { path: '/' })

        useApi({
          ...eAuth.refresh,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            this.refreshPromise = null
            this.setTokens(res.data)
            resolve(res.data)
          })
          .catch((e) => {
            this.refreshPromise = null
            this.logout()

            useMainStore().toast({
              type: 'error',
              message: i18n('toast.sessing_expired'),
              detail: i18n('toast.login_to_proceed'),
            })
            reject(e)
          })
      })
      return await this.refreshPromise
    },
    async logout(noRouting = false) {
      this.user = null
      this.mePromise = null
      this.refreshPromise = null
      this.fetching = false

      this.setTokens()
      useChatStore().resetState()
      useGroupsStore().groups = {} as IGroup[]
      setTimeout(() => {
        useNotificationsStore().logout()
      })
      if (noRouting) return
      this.$router.push({ path: '/auth/login' })
    },
    setTokens(tokens?: ITokenResponse, remember?: boolean) {
      const cookie = useCookie()
      const r = remember ?? cookie.get(REMEMBER) ?? false
      if (tokens) {
        cookie.set(ACCESS_TOKEN, tokens.token, { path: '/' })
        cookie.set('download', true, { path: '/' })
        if (r) {
          cookie.set(REFRESH_TOKEN, tokens.refreshToken, { path: '/' })
          cookie.set(REMEMBER, true, { path: '/' })
        }
      } else {
        cookie.remove(ACCESS_TOKEN, { path: '/' })
        cookie.remove(REFRESH_TOKEN, { path: '/' })
        cookie.remove(REMEMBER, { path: '/' })
      }
    },
    async confirmEmail(payload: { code: string; email: string }) {
      try {
        const response = await useApi({
          url: `${eAuth.confirmEmail.url}?code=${payload.code}&email=${payload.email}`,
          method: 'get',
        })
        return response
      } catch (error) {
        return error.response
      }
    },
  },
  getters: {
    isAuthenticated: () => !!useCookie().get(ACCESS_TOKEN),
    isAdmin: (state) => state.user?.admin ?? false,
    isOwnComment: (state) => (authorId) => state.user?.id == authorId,
    isFollowing: (state) => (id: number) => state.following.find((f) => f.subscribedTo.id == id)
  },
})
