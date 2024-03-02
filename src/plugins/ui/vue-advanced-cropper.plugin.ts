import type { App } from 'vue'
import { Cropper  } from 'vue-advanced-cropper'

import 'vue-advanced-cropper/dist/style.css'

export const install = (app: App) => {
  app.component('Cropper', Cropper)
}

export default install
