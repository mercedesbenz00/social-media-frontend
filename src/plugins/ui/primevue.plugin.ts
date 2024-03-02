import type { App } from 'vue'
import PrimeVue from 'primevue/config'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'

import ToastService from 'primevue/toastservice'
import Menuitem from 'primevue/menu/Menuitem.vue'
import tooltip from 'primevue/tooltip'
import BadgeDirective from 'primevue/badgedirective'
import ConfirmationService from 'primevue/confirmationservice'

export const install = (app: App) => {
  app.use(ConfirmationService)
  app.use(PrimeVue, { ripple: true })
  // services
  app.use(ToastService)
  // components
  app.component('PToast', Toast)
  app.component('PConfirmDialog', ConfirmDialog)
  app.component('PMenuitem', Menuitem)
  // directives
  app.directive('badge', BadgeDirective)
}

export default install
