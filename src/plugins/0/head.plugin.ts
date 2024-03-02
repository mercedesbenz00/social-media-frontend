import type { App } from 'vue'
import { createHead } from '@vueuse/head'

export const install = (app: App) => {
  const head = createHead()
  app.use(head)
}

export default install
