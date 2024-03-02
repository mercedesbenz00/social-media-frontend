import type { App } from 'vue'

export const setupPlugins = (app: App, options?: any) => {
  const plugins = import.meta.globEager('./**/*.plugin.ts')

  for (const [, plugin] of Object.entries(plugins)) {
    if (plugin && plugin.install) plugin.install(app, options)
  }
}
