<template>
  <div class="bg-primary w-screen h-screen flex items-center justify-center">
    <div class="max-w-80% w-full flex flex-col items-center justify-center space-y-4">
      <img :src="assetImage('logo-light.png')" alt="" />
      <img :src="assetImage('download_background.png')" alt="" />
      <div class="text-2xl text-white font-bold">{{ t('download.title') }}</div>
      <div class="text-sm text-white text-center">
        {{ t('download.subtitle') }}
      </div>
      <PButton
        @click="goToApp"
        class="btn-primary text-black"
        style="background-color: #d7c9ff"
        :label="t('download.button')"
      />
      <div class="flex items-center">
        <PButton @click="downloadIos">
          <img :src="assetImage('apple-store.png')" alt="Apple store" />
        </PButton>
        <PButton @click="downloadGoogle">
          <img :src="assetImage('google-play.png')" alt="Google play" />
        </PButton>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: empty
</route>

<script setup lang="ts">
import { useAssets } from '@/composables/useAssets'
import { useMainStore } from '@/data/main.store'
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const $main = useMainStore()
const goToApp = () => {
  useCookie().set('download', false, { path: '/' })
  router.push({ path: route.query.redirect?.toString() || '/' })
}
const downloadIos = () => {
  window.open('https://apps.apple.com/np/app/link-%D9%84%D9%8A%D9%86%D9%83/id6467857173', '_blank')
}
const downloadGoogle = () => {
  window.open('https://play.google.com/store/apps/details?id=com.earthlink.social&', '_blank')
}
const assetImage = useAssets
</script>
