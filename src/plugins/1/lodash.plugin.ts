import type { App } from 'vue'
import lodash, { type LoDashStatic } from 'lodash'

export const install = (app: App) => {
  app.provide('_lodash', lodash)
  app.config.globalProperties.$lodash = lodash
}
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $lodash: LoDashStatic
  }
}

export function useLodash() {
  return lodash
}

export default install
