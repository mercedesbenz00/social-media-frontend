<template>
  <div class="default-layout">
    <HeaderComponent></HeaderComponent>
    <div class="router-view">
      <slot>
        <RouterView></RouterView>
      </slot>
    </div>

    <div class="left-floating" v-if="false">
      <LocaleSwitch> </LocaleSwitch>
      <ColorModeSwitch></ColorModeSwitch>
      <PButton class="p-button-primary-outline" icon="i-figma:log-out" @click="logout"></PButton>
    </div>
    <div class="absolute inset-x-0 bottom-0">
      <div class="max-w-1200px mx-auto relative">
        <div v-if="$route.path != '/chat' && windowSize > 600" class="right-floating">
          <FloatingChatRooms></FloatingChatRooms>
          <FloatingChatList> </FloatingChatList>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/data/auth/auth.store'
const $route = useRoute()
const windowSize = ref(window?.innerWidth)
const logout = async () => {
  await useAuthStore().logout()
}

const handleResize = () => {
  windowSize.value = window?.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
<style lang="scss" scoped>
.router-view {
  --at-apply: 'flex flex-1 w-full  defaults overflow-y-scroll justify-center';
}
.left-floating {
  --at-apply: 'absolute start-2 bottom-2 flex gap-2';
}
.right-floating {
  --at-apply: 'absolute end-4 bottom-4 flex gap-2 z-99';
}
.default-layout {
  --at-apply: 'flex flex-col h-screen  relative min-h-screen w-full overflow-hidden';
}
</style>
