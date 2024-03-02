<template>
  <div v-if="authStore.fetching" class="relative w-screen h-screen flex-center-1" :class="font">
    <SplashScreen></SplashScreen>
  </div>
  <div v-else class="relative" :class="font">
    <RouterView></RouterView>
    <ModalsContainer></ModalsContainer>
    <CustomToast />
    <PConfirmDialog></PConfirmDialog>
  </div>
</template>

<script setup>
import { metaDefaults } from '@/constants/global.constants'
import { useTheme } from './composables/useTheme'
import { useAuthStore } from './data/auth/auth.store'
import { useMainStore } from './data/main.store'
import { isRTL } from './plugins/0/i18n.plugin'
const { locale } = useI18n({ useScope: 'global' })
const lang = useStorage('locale')
const font = useStorage('font')
const authStore = useAuthStore()
watch(
  locale,

  (v) => {
    lang.value = v
    font.value = v == 'kur' ? 'font-noto' : 'font-poppins'
    document.documentElement.setAttribute('lang', v)
  },
  { immediate: true }
)
useTheme()
// const mode = useColorMode()
const mainStore = useMainStore()
mainStore.init()

useHead({
  title: metaDefaults.title,
  titleTemplate: metaDefaults.titleTemplate,
  meta: [
    {
      name: 'description',
      content: metaDefaults.description,
    },
    {
      name: 'author',
      content: metaDefaults.author,
    },
    {
      name: 'keywords',
      content: metaDefaults.keywords,
    },
  ],
  htmlAttrs: computed(() => ({
    dir: isRTL() ? 'rtl' : 'ltr',
  })),
})
</script>

<style lang="scss">
@import '@unocss/reset/tailwind.css';
@import '@/assets/css/base.scss';
@import '@/assets/css/theme.scss';
@import '@/assets/css/overrides.scss';

/* width */
::-webkit-scrollbar {
  width: 8px;
}
/* Track */
::-webkit-scrollbar-track {
  box-shadow: none;
  border-radius: 10px;
}
/* Handle */
::-webkit-scrollbar-thumb {
  --at-apply: 'bg-gray-400';
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  --at-apply: 'bg-gray-500';
}
</style>
