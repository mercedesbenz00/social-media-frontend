import type { App } from "vue";
import FileSelector from 'vue-file-selector';

export const install = (app: App) => {
  app.use(FileSelector)
}