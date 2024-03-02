<template>
  <div class="flex flex-1 h-screen w-full items-center justify-center relative">
    <div class="absolute top-4 rtl:left-4 ltr:right-4 flex gap-x-2">
      <ColorModeSwitch />
      <LocaleSwitch />
    </div>
    <div class="auth-visual">
      <div class="absolute start-20% top-10%">
        <img src="@/assets/images/logo-light.png" />
        <p class="text-white text-xl font-300 pt-2">{{ t('auth.phrase') }}</p>
      </div>
    </div>
    <div class="flex flex-1 items-center justify-center">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
</script>

<style scoped lang="scss">
.auth-visual {
  --at-apply: 'hidden  w-[60%] h-full  bg-cover bg-center bg-primary  lg:flex relative';
  background-image: url('@/assets/images/login-bg.png');
}
</style>
