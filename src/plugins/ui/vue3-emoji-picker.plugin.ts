import type { App } from 'vue'
import EmojiPicker from 'vue3-emoji-picker'
// import css
import '/node_modules/vue3-emoji-picker/dist/style.css'


export const install = (app: App) => {
  app.component('EmojiPicker', EmojiPicker)
}

export default install
