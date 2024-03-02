<template>
  <div v-if="!room.state">
    <div
      v-tooltip.top="get(messager, 'profile.displayName')"
      class="chat-avatar"
      :class="{
        'border-green': get(messager, 'state.presence') == 'online',
        'border-red': get(messager, 'state.presence') == 'offline',
      }"
      @click="toggleFloatingChat"
    >
      <img
        :src="get(messager, 'profile.avatar.path') || assetImage('no-avatar.svg')"
        alt=""
        class="w-full h-full bg-center bg-cover"
      />
    </div>
  </div>
  <ChatRoom
    v-else-if="chatRoom"
    class="w-320px h-400px rounded-xl"
    :room-id="room.id"
    :floating="true"
    :displayEmojiStickerAndLoader="true"
  >
  </ChatRoom>
</template>

<script setup lang="ts">
import { useAssets } from '@/composables/useAssets'
import type { IFloatingRoom } from '@/data/chat/chat.interface'
import { useChatStore } from '@/data/chat/chat.store'
import { isEmpty, get } from 'lodash'
import type { PropType } from 'vue'
const chat = useChatStore()
const assetImage = useAssets

const props = defineProps({
  room: {
    type: Object as PropType<IFloatingRoom>,
    required: true,
  },
})
const chatRoom = computed(() => {
  return chat.rooms[props.room.id]
})
const isGroup = computed(() => {
  return chatRoom.value.members.length > 2
})

const members = computed(() => {
  return chatRoom.value.members.map((e) => chat.users[e.id])
})
const messager = computed(() => {
  if (!isGroup.value && !isEmpty(members.value)) {
    return members.value.find((e) => e?.id !== chat.myId)
  }
  return {}
})
const toggleFloatingChat = () => {
  chat.toggleFloatingChat(props.room.id, true)
}
</script>

<style lang="scss" scoped>
.chat-avatar {
  --at-apply: 'btn-hover w-12 h-12 flex-center-none rounded-full overflow-hidden bg-gray-200 border-2 primary-shadow ';
}
</style>
