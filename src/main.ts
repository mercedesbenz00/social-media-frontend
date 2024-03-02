import { createApp } from 'vue'

import App from './App.vue'
import { createPinia } from 'pinia'
import { router } from '@/plugins/0/router.plugin'
import ReverseScroll from '@/utils/directives/reverse-scroll'

import VueVideoPlayer from '@videojs-player/vue'

import 'uno.css'
import 'video.js/dist/video-js.css'

import { setupPlugins } from './plugins/setup'

const pinia = createPinia()
pinia.use(({ store }) => {
  store.$router = markRaw(router)
})

const app = createApp(App)
app.use(pinia)

app.use(VueVideoPlayer)

app.directive('reverse-scroll', ReverseScroll)
setupPlugins(app)

app.mount('#app')

export const useApp = () => app
export const useGlobals = () => app?.config?.globalProperties
