import type { App } from "vue";
import LoadScript from "vue-plugin-load-script";

export const install = (app: App) => {
  app.use(LoadScript)
}
export default install