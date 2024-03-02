import type { App } from "vue";
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'

export const install = (app: App) => {
  app.use(FloatingVue)
}
export default install