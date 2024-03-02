import type { App } from 'vue'
import JsonViewer from 'vue-json-viewer'

export const install = (app: App) => {
  app.component('Json', JsonViewer)
}

export default install
