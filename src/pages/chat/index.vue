<template>
  <div class="w-full h-full overflow-hidden lg:p-8 max-w-1200px mx-auto">
    <div class="h-full relative">
      <div class="absolute inset-0 flex gap-4">
        <ChatList v-model="selectedRoom" class="w-full lg:max-w-80" :chat-rooms="chat.roomOrder" />
        <ChatRoom class="flex-1 !hidden lg:!flex" :room-id="selectedRoom"></ChatRoom>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useChatStore } from '@/data/chat/chat.store'

const chat = useChatStore()
const selectedRoom = computed({
  get: () => chat.selectedRoom,
  set: (v) => {
    chat.selectRoom(v)
  },
})
</script>

<style lang="scss" scoped></style>
