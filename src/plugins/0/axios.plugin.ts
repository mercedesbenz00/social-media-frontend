import type { IRequest } from '@/data/main.interface'
import _ from 'lodash'
import { ACCESS_TOKEN } from '@/constants/global.constants'
import { useAuthStore } from '@/data/auth/auth.store'
import axios, { type AxiosPromise, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import type { App } from 'vue'
import qs from 'qs'
import { useCookies } from '@vueuse/integrations/useCookies'
import { useMainStore } from '@/data/main.store'
import { i18n } from './i18n.plugin'
import { omitOptions, parseOptions } from '@/utils/axios.utils'
import { eAuth } from '@/data/auth/auth.endpoint'

const prefix = import.meta.env.APP_BASE_URL_PREFIX
const MAX_RETRY_COUNT = 3

const client = axios.create({ baseURL: prefix, headers: { 'Access-Control-Allow-Origin': true } })

export interface IApiOptions {
  signal?: AbortSignal
  [key: string]: any
}

export const useApi = <T = any>(req: IRequest | string, opt?: IApiOptions): AxiosPromise<T> => {
  const options = parseOptions(req, opt)
  const omited = omitOptions(options) as Partial<AxiosRequestConfig>

  return client({
    url: options.url,
    ...omited,
    signal: opt?.signal,
  })
}

export const install = (app: App) => {
  client.interceptors.request.use((config: AxiosRequestConfig) => {
    if (
      config.headers &&
      config.headers['retry-count'] &&
      typeof config.headers['retry-count'] === 'number' &&
      config.headers['retry-count'] > MAX_RETRY_COUNT
    ) {
      const controller = new AbortController()
      controller.abort()
      config.signal = controller.signal
      return config
    }
    const token = useCookies().get(ACCESS_TOKEN)
    const lang = document.documentElement.getAttribute('lang')
    config.headers = {
      'Accept-Language': lang || 'en',
      ...(config.headers ?? {}),
    }

    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    config.paramsSerializer = (p) => {
      return qs.stringify(p, { arrayFormat: 'repeat' })
    }

    return config
  })

  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response
    },
    async (error) => {
      // const token = useCookies().get(ACCESS_TOKEN)
      // const refresh = useCookies().get(REFRESH_TOKEN)
      const $auth = useAuthStore()

      if (error.response && error.response.status === 502) {
        await $auth.logout()

        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: i18n('toast.server_error') })
        return Promise.reject(error)
      }
      if (error.config.url && error.config.url == eAuth.refresh.url && error.response.status == 401) return Promise.reject(error)
      if (error.response) {
        if (error.response.status === 401) {
          // lower case all errors in array and do it string
          const errors = error.response.data.error.join('|').toLowerCase() 
          if (errors.includes('unauthorized')) {
            try {
              await $auth.refreshToken()
    
              error.config = _.omit(error.config, 'headers.Authorization')
              error.config.headers['retry-count'] = (error.config.headers['retry-count'] ?? 0) + 1
    
              return client.request(error.config)
            } catch (e) {
              await $auth.logout()
              Promise.reject(error)
            }
          }
        }

        if (error.response.status === 403) return useGlobals().$router.push('/auth/confirm')
      } else {
        await $auth.logout()
        return Promise.reject(error)
      }
      return Promise.reject(error)
    }
  )

  app.provide('axios', client)
  app.provide('useApi', useApi)

  app.config.globalProperties.$api = useApi
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $api: typeof useApi
  }
}

export default install
