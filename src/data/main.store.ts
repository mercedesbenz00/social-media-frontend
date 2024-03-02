import { defineStore } from 'pinia'
import type { IConfirm, IToast } from './main.interface'
import { useAuthStore } from './auth/auth.store'

export const useMainStore = defineStore({
  id: 'main',
  state: () => ({
    isInitilized: false,
    language: 'en'
  }),
  actions: {
    async init() {
      const $auth = useAuthStore()
      const { isInitilized } = this.$state
      if (isInitilized) return
      this.isInitilized = true
      await $auth.init()
    },
    toast(payload: IToast) {
      if (!payload.detail || payload.detail === '') return
      if (payload.detail?.match(/(Invalid Token)|(Invalid token)/)) return
      const temp = {
        severity: payload.type ?? 'info',
        life: payload.life ?? 3000,
        summary: payload.message,
        detail: payload.detail,
        closable: payload.closable ?? false,
        group: payload.group,
        styleClass: `toast-outer ${payload.class ?? ''}`,
        contentStyleClass: `toast-inner ${payload.contentClass ?? ''}`,
        additionalType: payload.additionalType,
        retryFunc: payload.retryFunc
      }
      useGlobals().$toast.add({ ...temp })
    },
    confirm(payload: IConfirm) {
      const options = {
        message: payload.message ?? '',
        header: payload.header ?? '',
        icon: payload.icon ?? '',
        acceptLabel: payload.acceptLabel,
        rejectLabel: payload.rejectLabel,
        accept: () => {
          payload.accept()
        },
        reject: () => {
          payload.reject()
        },
      }
      useGlobals().$confirm.require(options)
    },
    clearAllToasts: () => {
      useGlobals().$toast.removeAllGroups()
    },
  },
})
