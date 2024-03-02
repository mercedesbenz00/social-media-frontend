<template>
  <div class="min-h-screen pt-[10vh] flex relative">
    <LocaleSwitch class="absolute top-2 ltr:right-2 rtl:left-2"></LocaleSwitch>
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition ?? 'fade'" mode="out-in">
        <component :is="Component" class="w-600px max-w-90vw mx-auto flex flex-col items-center gap-y-10 lg:gap-y-16" />
      </transition>
    </router-view>
  </div>
</template>

<script setup></script>

<style lang="css" scoped>
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-left-enter {
  transform: translateX(100%);
}

.slide-left-leave-to {
  transform: translateX(-100%);
}

.slide-right-enter {
  transform: translateX(-100%);
}

.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
