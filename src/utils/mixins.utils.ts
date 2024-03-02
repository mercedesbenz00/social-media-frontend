import type { App } from 'vue'

export const autocompleteOff = {
  install(app: App) {
    app.mixin({
      mounted() {
        this.autocompleteOff()
      },
      methods: {
        autocompleteOff() {
          const elements = document.querySelectorAll('[autocomplete="off"]')
          if (!elements || !elements.length) return

          elements.forEach((element) => {
            element.setAttribute('readonly', 'readonly')
            setTimeout(() => {
              element.removeAttribute('readonly')
            }, 500)
          })
        },
      },
    })
  },
}
