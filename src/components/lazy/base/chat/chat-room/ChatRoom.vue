<template>
  <div class="chat-room-wrapper" :class="{ 'card-defaults': floating }">
    <div class="chat-room card-defaults" v-if="!roomId || !chat.rooms[roomId]">
      <div class="h-16 flex-center-none w-full">{{ $t('chat.room_placeholder') }}</div>
      <div class="flex-center-1">
        <img :src="asset('chat/placeholder.png')" class="" />
      </div>
    </div>
    <div v-else-if="chat.rooms[roomId]" class="chat-room" :class="floating ? '' : 'space-y-4'">
      <div class="chat-area" :class="floating ? '' : 'card-defaults'">
        <ChatRoomHeader :room="chat.rooms[roomId]" :floating="floating"></ChatRoomHeader>
        <ChatRoomTimeline :room="chat.rooms[roomId]" :key="roomId"></ChatRoomTimeline>
      </div>

      <div class="chat-input" :class="floating ? '' : 'card-defaults px-6 py-4'">
        <ChatInputBox
          :room-id="roomId"
          @on-send-message="sendMessage"
          :floating="floating"
          :displayEmojiStickerAndLoader="displayEmojiStickerAndLoader"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAssets } from '@/composables/useAssets'
import { useChatStore } from '@/data/chat/chat.store'

const asset = useAssets

const props = defineProps({
  roomId: {
    type: String,
    default: undefined,
  },
  floating: {
    type: Boolean,
    default: false,
  },
  displayEmojiStickerAndLoader: {
    type: Boolean,
    default: false,
  },
})
const chat = useChatStore()
const sendMessage = (text, media) => {
  chat.sendMessage(props.roomId, text, media)
}
</script>

<style lang="scss" scoped>
$bottomHeight: 80px;
.chat-room-wrapper {
  --at-apply: 'flex-1 flex flex-col z-999';
}
.chat-room {
  --at-apply: 'flex flex-col h-full ';
  .chat-area {
    --at-apply: 'flex flex-col flex-1   h-full overflow-y-hidden';
  }
  .chat-input {
    --at-apply: 'flex flex-none w-full  ';
  }
}
</style>
