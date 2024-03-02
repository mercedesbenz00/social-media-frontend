import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'

import type { App } from 'vue'
import { ACCESS_TOKEN } from '@/constants/global.constants'
import { useCookies } from '@vueuse/integrations/useCookies'
import _ from 'lodash'
import { isRTL } from './i18n.plugin'
import { useAuthStore } from '@/data/auth/auth.store'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { useOnboardingStore } from '@/data/onboarding/onboarding.store'

const routesWithLayouts = generatedRoutes.map((route) => {
  if (route.path.startsWith('/auth')) {
    route.meta = { ...route.meta, layout: route.meta?.layout ?? 'auth' }
  } else if (route.path.startsWith('/setup')) {
    route.meta = {
      ...route.meta,
      layout: route.meta?.layout ?? 'setup',
    }
  }
  // else if (route.path.startsWith('/examples')) route.meta = { ...route.meta, layout: route.meta?.layout ?? 'example' }
  return route
})

const routes = setupLayouts(routesWithLayouts)

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

export const install = (app: App) => {
  // default page setups for layouts
  const $auth = useAuthStore()
  const cookie = useCookie()

  router.beforeResolve(async (to: any, from: any, next) => {
    const token = useCookies().get(ACCESS_TOKEN)
    const user = await $auth.me()
    const showDownload = cookie.get('download')
    const $onboarding = useOnboardingStore()
    const sm = useBreakpoints(breakpointsTailwind).smaller('md')
    // custom transition embedding
    if (_.has(to, 'meta.order') && _.has(from, 'meta.order')) {
      if (_.get(to, 'meta.order') > _.get(from, 'meta.order')) {
        to.meta.transition = isRTL() ? 'slide-right' : 'slide-left'
      } else {
        to.meta.transition = isRTL() ? 'slide-left' : 'slide-right'
      }
    }
    const state = $onboarding.state ?? $onboarding.init()
    const isAuthenticated = user && token && state

    if (isAuthenticated) {
      switch (state) {
        case "ACCOUNT_CREATED":
          return !to.fullPath.startsWith('/auth') ? next({ path: '/auth/confirm' }) : next()
        case "EMAIL_CONFIRMED":
          return !to.fullPath.startsWith('/onboarding') ? next({ path: '/onboarding/form' }) : next()
        case "INFO_PROVIDED":
          return !to.fullPath.startsWith('/onboarding') ? next({ path: '/onboarding/interests' }) : next()
        case "INTERESTS_PROVIDED":
          return !to.fullPath.startsWith('/onboarding') ? next({ path: '/onboarding/join-groups' }) : next()
        default:
          if (showDownload && sm.value && !to.fullPath.startsWith('/auth')) return next({ path:'/auth/download' })
          else return next()
      } 
    } else return !to.fullPath.startsWith('/auth') ? next({ path: '/auth/login' }) : next()
  })

  app.use(router)
}

export default install