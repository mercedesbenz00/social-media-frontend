import type { BasicColorSchema } from '@vueuse/core'

export function useTheme() {
  const options = {
    light: {
      class: 'light-mode',
      icon: 'i-heroicons-solid:sun',
    },
    dark: {
      class: 'dark-mode',
      icon: 'i-heroicons-solid:moon',
    },
  }
  const { map, mapValues, get } = useLodash()

  const themes = Object.keys(options)
  const mode = useColorMode({
    storageKey: 'theme',
    modes: mapValues(options, 'class'),
  })

  if (!Object.keys(options).includes(mode.value)) mode.value = 'light'

  const index = computed(() => themes.indexOf(mode.value) ?? 0)
  const change = (val) => {
    if (val) {
      mode.value = val
    } else {
      const i = (index.value + 1) % themes.length
      mode.value = themes[i] as BasicColorSchema
    }
  }
  const next = computed(() => {
    const i = (index.value + 1) % themes.length
    return get(options, themes[i])
  })
  const current = computed(() => {
    return get(options, themes[index.value])
  })

  return reactive({
    mode,
    current,
    change,
    next,
  })
}
