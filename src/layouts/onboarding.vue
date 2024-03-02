<template>
  <div class="min-h-screen pt-[5vh] flex relative">
    <div class="flex items-center justify-end gap-x-4 absolute top-2 ltr:right-2 rtl:left-2">
      <ColorModeSwitch />
      <LocaleSwitch />
    </div>
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition ?? 'fade'" mode="out-in">
        <component :is="Component" class="max-w-90vw mx-auto" />
      </transition>
    </router-view>
  </div>
</template>

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
