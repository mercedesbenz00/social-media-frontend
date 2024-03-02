import { defineStore } from 'pinia'
import { useMainStore } from '../main.store'
import { eOnboarding } from './onboarding.endpoint'
import {useAuthStore} from "@/data/auth/auth.store";
import type { IPage } from "@/data/main.model";
import type { ICategory } from "./onboarding.interface";
import { i18n } from '@/plugins/0/i18n.plugin'

export const useOnboardingStore = defineStore({
  id: 'onboarding',
  state: () => {
    return {
      loading: false,
      states: ['ACCOUNT_CREATED', 'EMAIL_CONFIRMED', 'INFO_PROVIDED', 'INTERESTS_PROVIDED', 'REGISTRATION_COMPLETED'],
      state: null as null | string,
      interestsCount: 0 as number,
      groupsCount: 0 as number
    }
  },
  actions: {
    init() {
      const $auth = useAuthStore()
      if ($auth.user) {
        this.state = $auth.user.state
        this.interestsCount = $auth.user.interestCount
        this.groupsCount = $auth.user.groupCount
        return this.state
      }
    },
    async getCategories(params: {personId?: any, parentCategoryId?: string | number, skipUnusedInGroups?: boolean} = {}): Promise<IPage<ICategory>> {
      try {
        this.loading = true
        params.skipUnusedInGroups = params.skipUnusedInGroups ?? true
        const { data } = await useApi<IPage<ICategory>>({
          ...eOnboarding.categories,
            params
        })
        return data
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
        throw error
      }
      finally {
        this.loading = false
      }
    },
    async getCategoriesByPersonId() {
      const authStore = useAuthStore()
      return this.getCategories({ personId: authStore?.user?.id})
    },
    async assignCategories(params) {
      try {
        const data = useApi({...eOnboarding.assignCategories, params })
        if (data) {
          useMainStore().toast({
            type: 'success',
            message: i18n('toast.success'),
            detail: i18n('profile.update_message'),
          })
          return data
        }
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
        throw error
      }
    },
  }
})
