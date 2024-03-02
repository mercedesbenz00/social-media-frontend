<template>
  <div v-if="chat.floating.state" class="floating-chat-list">
    <ChatList :chat-rooms="chat.roomOrder" :floating="true" />
    <!-- <ChatListFiller /> -->
  </div>
  <div v-else class="flex flex-col justify-end">
    <PButton
      v-if="chat.unreadCount"
      v-badge="chat.unreadCount"
      icon="i-figma:mail text-2xl"
      class="icon-button"
      @click="toggleChat"
    />
    <PButton v-else icon="i-figma:mail text-2xl" class="icon-button" @click="toggleChat"></PButton>
  </div>
</template>

<script setup>
import { useChatStore } from '@/data/chat/chat.store'

const chat = useChatStore()
const toggleChat = () => {
  chat.toggleChat()
}
</script>

<style lang="scss" scoped>
.icon-button {
  --at-apply: 'h-48px w-48px primary-shadow overflow-visible';
  :deep(.p-badge) {
    --at-apply: '!h-8 !w-8 text-lg bg-primary-light';
  }
}
.floating-chat-list {
  --at-apply: 'w-64 h-120 relative z-999 flex';
}

.dark-mode {
  .icon-button {
    :deep(.p-badge) {
      --at-apply: 'text-primary';
    }
  }
}
</style>
