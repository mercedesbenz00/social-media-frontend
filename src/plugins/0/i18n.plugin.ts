import type { App } from 'vue'
import { createI18n } from 'vue-i18n'

const fallbackLocale = 'en'
const rtlLanguages = ['ar', 'arc', 'ckb', 'fa', 'he', 'ks', 'ps', 'ur', 'yi', 'kur']

const messages = Object.fromEntries(
  Object.entries(import.meta.globEager('@/locales/*.json')).map(([key, value]) => {
    const parsedKey = key.replace(/.+\/locales\//, '').replace('.json', '')

    return [parsedKey, value.default]
  })
)

function getLocale(): string {
  return useStorage('locale', fallbackLocale).value ?? fallbackLocale
}
const instance = createI18n({
  locale: getLocale(),
  legacy: false,
  globalInjection: true,
  messages,
})

export const install = (app: App) => {
  app.use(instance)
}

export default install
export const isRTL = () => rtlLanguages.includes(instance.global.locale.value)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const i18n = instance.global.t as any
