import { autocompleteOff } from '@/utils/mixins.utils'
import type { App } from 'vue'

export const install = (app: App) => {
  autocompleteOff.install(app)
}

export default install
