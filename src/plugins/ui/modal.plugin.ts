import type { App } from 'vue'
import vfmPlugin, { type VfmOptions, type VueFinalModalProperty } from 'vue-final-modal'

export const install = (app: App) => {
  const options: VfmOptions = {
    key: '$vfm',
    componentName: 'VueFinalModal',
    dynamicContainerName: 'ModalsContainer',
  }
  app.use(vfmPlugin as any, options)
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    readonly $vfm: VueFinalModalProperty
  }
}

export default install
