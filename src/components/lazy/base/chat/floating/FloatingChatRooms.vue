<template>
  <div class="flex flex-none gap-2 items-end">
    <FloatingChatRoom v-for="room in rooms" :key="room.id" :room="room"></FloatingChatRoom>
  </div>
</template>

<script setup>
import { useChatStore } from '@/data/chat/chat.store'

const chat = useChatStore()

const rooms = computed(() => {
  return chat.floating.openRooms
})
</script>

<style lang="scss" scoped></style>
