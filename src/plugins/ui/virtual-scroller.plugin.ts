import type { App } from 'vue'
// import VirtualScroller from '../../custom-plugins/virtual-scroll';
import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

export const install = (app: App) => {
  app.use(VueVirtualScroller)
}

export default install
