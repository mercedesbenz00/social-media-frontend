/* eslint-disable no-console */
import type { App } from 'vue'

function toPascalCase(string): string {
  return `${string}`
    .replace(new RegExp(/[-_]+/, 'g'), ' ')
    .replace(new RegExp(/[^\w\s]/, 'g'), '')
    .replace(new RegExp(/\s+(.)(\w*)/, 'g'), ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`)
    .replace(new RegExp(/\w/), (s) => s.toUpperCase())
}

export const install = (app: App) => {
  const isDev = import.meta.env.DEV
  const plugins = import.meta.globEager('@/components/auto/**/*.vue')
  const registered: string[] = []
  for (const [name, plugin] of Object.entries(plugins)) {
    const match = name.match(/(?:\/)([^/]+)\.vue$/)
    if (match) {
      const componentName = toPascalCase(match[1])

      if (!registered.includes(componentName)) {
        app.component(componentName, defineComponent(plugin.default))
        registered.push(componentName)
      } else if (!isDev) {
        console.error(
          'Auto components:',
          `${componentName} is already registered \nPlease rename your component to avoid conflicts at ${name}`
        )
      }
    }
  }
}

export default install
