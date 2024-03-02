<template>
  <div>
    <div
      @click="myMembership.membership === 'invite' ? join() : ''"
      class="chat-list-item relative"
      :class="roomId === selected ? 'bg-bg-primary-extra-light/50 text-primary' : ''"
      @mouseover="showClear = true"
      @mouseleave="showClear = false"
    >
      <div class="w-4 h-full">
        <svg
          v-if="roomId === selected"
          width="8"
          height="72"
          viewBox="0 0 8 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 0C4.41828 0 8 3.58172 8 8V64C8 68.4183 4.41828 72 0 72V0Z" fill="#352466" />
        </svg>
      </div>

      <div
        class="w-12 h-12 flex-center-none rounded-full overflow-hidden bg-gray-200 border-2"
        :class="{
          'border-green': get(messager, 'state.presence') == 'online',
          'border-red': get(messager, 'state.presence') == 'offline',
        }"
      >
        <img
          :src="get(messager, 'profile.avatar.path') || assetImage('no-avatar.svg')"
          alt=""
          class="w-full h-auto object-cover"
        />
      </div>
      <div class="flex flex-col px-2 flex-1 overflow-hidden">
        <div class="flex justify-between">
          <span class="font-bold text-sm mb-1"> {{ roomName }}</span>
          <PBadge v-if="room.handler.getUnreadNotificationCount()" :value="room.handler.getUnreadNotificationCount()">
          </PBadge>
        </div>
        <div class="w-full flex-none">
          <div v-if="get(messager, 'state.typing')">{{ $t('typing') }}</div>
          <div v-else-if="lastMessage" class="text-xs mr-4 overflow-hidden w-full">
            <div class="max-w-80% line-clamp-1 break-words" v-if="lastMessage.msgtype === 'm.image'">
              <div class="i-figma:image w-4 h-4"></div>
            </div>
            <p v-else class="line-clamp-1 break-words max-w-80%">
              {{ lastMessage.message.length > 30 ? lastMessage.message.slice(0, 10) + '...' : lastMessage.message }}
            </p>
            <p class="self-end text-end pe-4">{{ moment(lastMessage.time).locale(locale).fromNow() }}</p>
          </div>
          <p class="line-clamp-1 break-works max-w-80% text-xs mr-4" v-if="myMembership.membership === 'invite'">
            new message
          </p>
        </div>
      </div>
      <PButton @click.stop="decline" v-if="true" icon="i-figma:x" class="icon-button"></PButton>
    </div>
    <div class="h-px w-90% bg-text-primary/20 mx-auto"></div>
  </div>
</template>

<script setup>
import { useChatStore } from '@/data/chat/chat.store'
import { isEmpty, get, last } from 'lodash'
import { useAssets } from '@/composables/useAssets'
import moment from 'moment-with-locales-es6'
import { useMainStore } from '@/data/main.store'
const { locale } = useI18n()

const chat = useChatStore()
const $main = useMainStore()
const { t } = useI18n()
const assetImage = useAssets

const props = defineProps({
  roomId: {
    type: String,
    required: true,
  },
  selected: {
    type: String,
    default: undefined,
  },
})
const room = computed(() => {
  return chat.rooms[props.roomId]
})
const isGroup = computed(() => {
  return room.value.members.length > 2
})

// const isAlone = computed(() => {
//   return room.value.members[0].id === chat.myId && room.value.members.length === 1
// })

const myMembership = computed(() => {
  return room.value.members.find((e) => e.id === chat.myId) ?? {}
})

const join = () => {
  chat.joinRoom(props.roomId)
}

const decline = () => {
  $main.confirm({
    header: t('chat.remove_chat_header'),
    message: t('chat.remove_chat_message'),
    acceptLabel: t('acceptLabel'),
    rejectLabel: t('rejectLabel'),
    accept: async () => {
      chat.leaveRoom(props.roomId)
    },
    reject: () => {},
  })
}

const members = computed(() => {
  return room.value.members.map((e) => chat.users[e.id])
})
const messager = computed(() => {
  if (!isGroup.value && !isEmpty(members.value)) {
    return members.value.find((e) => e?.id !== chat.myId)
  }
  return {}
})
// const status = computed(() => {
//   if (isGroup.value) return 'unknown'
//   return messager.value.state
// })
const roomName = computed(() => {
  if (isGroup.value) return room.value.handler.displayName
  return messager.value?.profile?.displayName ?? room.value.members.find((e) => e.id != chat.myId).displayName
})

const lastMessage = computed(() => {
  if (room.value && room.value.handler.timeline) {
    const msg = last(room.value.handler.timeline.filter((e) => e.event.type === 'm.room.message'))
    return msg
      ? {
          message: msg.event.content.body,
          time: msg.event.origin_server_ts,
          msgtype: msg.event.content.msgtype,
        }
      : undefined
  }

  return
})
</script>

<style lang="scss" scoped>
.chat-list-item {
  --at-apply: 'flex items-center w-full flex-none border-gray-200  cursor-pointer h-72px';
}
.icon-button {
  --at-apply: 'btn-flat-primary !min-h-24px !min-w-24px !h-24px !w-24px';
}
</style>
