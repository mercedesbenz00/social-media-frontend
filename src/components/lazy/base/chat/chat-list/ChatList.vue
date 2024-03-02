<template>
  <div class="flex flex-col flex-1">
    <div v-if="!floating" class="flex-none px-4 my-4 lg:my-0 lg:h-16">
      <div class="flex flex-1 items-center justify-between">
        <router-link :to="'/'" class="flex items-center">
          <i class="flex i-figma:arrow-left me-2"></i>
          <div class="font-bold text-sm lg:text-xl">{{ $t('chat.messages') }}</div>
        </router-link>
        <div class="new-message">
          <PButton @click="onSearch(false)" class="btn-flat-primary" icon="i-figma:edit text-sm lg:text-xl" />
        </div>
      </div>
    </div>
    <div class="chat-list">
      <!-- header begin -->
      <div class="chat-header">
        <div v-if="floating" class="flex h-16 items-center mx-4 border-b-px border-text-primary/20 justify-between">
          <div class="font-bold">{{ $t('chat.messages') }}</div>

          <div class="header-trailing">
            <RouterLink class="enlarge" to="/chat">
              <PButton class="icon-button" icon="i-fas:arrow-up-right-from-square text-lg"></PButton>
            </RouterLink>
            <div class="new-message">
              <PButton class="icon-button" icon="i-figma:edit text-lg" @click="onSearch(true)"></PButton>
            </div>
            <div class="minimize">
              <PButton class="icon-button" icon="i-figma:chevron-down text-lg" @click="minimizeChat"></PButton>
            </div>
          </div>
        </div>
        <!--
        <InputField :shrink-wrap="floating" class="chat-list-header">
          <template #leading>
            <span class="i-figma:search"></span>
          </template>
          <p-input-text placeholder="Search Message" class="w-full h-8 text-sm placeholder:text-sm" />
        </InputField>
        -->
      </div>
      <!-- header end -->

      <!-- content begin -->
      <div class="chat-content">
        <ChatListItem
          v-for="roomId in chatRooms"
          :key="roomId"
          :room-id="roomId"
          :selected="modelValue"
          @click="() => onSelect(roomId)"
        />
      </div>
      <!-- content end -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from '@/data/chat/chat.store'
import type { PropType } from 'vue'
import { useGlobals } from '@/main'
import { useDeviceDetector } from '@/utils/device-detector.utils'

const device = useDeviceDetector()
const chat = useChatStore()
const router = useRouter()
const props = defineProps({
  chatRooms: {
    type: Array as PropType<any[]>,
    default: () => [],
    required: true,
  },
  modelValue: {
    type: String as PropType<string>,
    default: undefined,
  },
  floating: {
    type: Boolean,
    default: false,
  },
})

/* const roomsList = computed(() => {
  let emptyRooms = [] as any
  Object.values(chat.rooms).forEach((room: any) => {
    const members = room.members.filter((m: any) => m.id !== chat.myId)
    room.members.forEach((member: any) => {
      if (member.membership === 'leave') emptyRooms.push(room)
    })
  })
  emptyRooms = emptyRooms.map((r) => r.id)
  const rooms = props.chatRooms.filter((room) => !emptyRooms.includes(room))
  return rooms
}) */
const emits = defineEmits(['update:modelValue', 'select'])

const onSelect = (roomId) => {
  if (device.value !== 'desktop') {
    chat.openRoom(roomId)
    router.push('/chat/' + roomId)
    return
  }
  if (props.floating) {
    chat.openRoom(roomId)
  } else {
    emits('select', roomId)
    emits('update:modelValue', roomId)
  }
}

const minimizeChat = () => {
  chat.toggleChat()
}

const onSearch = (isFloatingView = true) => {
  const { $vfm } = useGlobals()
  const component = resolveComponent('SearchPersonToChat')
  $vfm.show({
    component,
    bind: {
      drag: false,
      size: 'small',
      adaptive: false,
      noActions: true,
      isFloatingView,
    },
    on: {
      close: () => {
        $vfm.hideAll()
      },
    },
  })
}
</script>

<style scoped lang="scss">
.chat-content {
  max-height: calc(40rem - 64px);
  --at-apply: 'flex flex-col flex-1 overflow-y-auto';
}
.chat-list {
  --at-apply: 'flex flex-col h-full border border-bg-purple-light/50 mx-px lg:rounded-2xl lg:border-none lg:primary-shadow bg-bg-primary';
  &-header {
    --at-apply: 'px-4 pt-2';
  }

  &-content {
    --at-apply: 'position-relative overflow-y-auto ';
  }

  .selected {
    --at-apply: 'bg-bg-primary-extra-light';
  }
  .header-trailing {
    --at-apply: 'flex flex-none gap-y-1 items-center';
  }
}
.icon-button {
  --at-apply: 'btn-flat-primary !min-h-32px !min-w-32px !h-32px !w-32px';
}
</style>
