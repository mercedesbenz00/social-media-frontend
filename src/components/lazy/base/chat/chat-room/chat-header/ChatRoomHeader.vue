<template>
  <div
    class="flex flex-none justify-between border-b-1 border-gray-300 h-16 px-4"
    :class="{ 'chat-header-blocked': isBlocked }"
  >
    <div class="flex items-center">
      <i @click="router.back()" class="i-figma:arrow-left text-base flex lg:hidden me-2"></i>
      <div class="w-10 h-10 flex-center-none rounded-full overflow-hidden bg-gray-200">
        <component :is="link ? 'router-link' : 'div'" :to="link ?? ''">
          <img
            :src="get(messager, 'profile.avatar.path') || assetImage('no-avatar.svg')"
            alt=""
            class="w-full h-auto object-cover"
          />
        </component>
      </div>
      <div class="flex flex-col">
        <span class="px-2 font-bold">{{ get(messager, 'profile.displayName') }}</span>
        <span v-if="isBlocked" class="px-2 block-status-text font-normal">{{ t('chat.blocked') }}</span>
      </div>
    </div>
    <div class="flex items-center">
      <!-- <div v-if="myMembership.membership === 'invite'">
        <p-button
          class="btn-primary"
          :class="{ 'text-sm p-0': floating }"
          :label="floating ? 'Join' : 'Join Room'"
          @click="joinRoom"
        ></p-button>
      </div> -->
      <!-- <p-button class="icon-button" icon="i-figma-more-horizontal" /> -->
      <div v-if="floating" class="minimize">
        <PButton
          class="icon-button !hidden lg:flex"
          icon="i-figma:chevron-down text-xl"
          @click="minimizeChat"
        ></PButton>
        <PButton class="icon-button" icon="i-figma:more-horizontal text-3xl lg:text-xl" @click="togglePopup"></PButton>
        <PopupMenu :items="popupMenuItems" ref="popupMenu" />
      </div>
      <div v-if="floating" class="close hidden lg:flex">
        <PButton class="icon-button" icon="i-figma:x text-xl" @click="closeChat"></PButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAssets } from '@/composables/useAssets'
import { useChatStore } from '@/data/chat/chat.store'
import { useNotification } from '@/composables/useNotification'
import { isEmpty, get } from 'lodash'
import { useMainStore } from '@/data/main.store'

const assetImage = useAssets
const chat = useChatStore()
const { t } = useI18n()

const props = defineProps({
  room: {
    type: Object,
    required: true,
  },
  floating: {
    type: Boolean,
    default: false,
  },
})
const router = useRouter()
const link = computed(() => {
  const id = get(messager.value, 'id')
  if (!id || typeof id !== 'string') return null
  const profileLink = id.split(/[.:]/g)
  if (!profileLink || !profileLink[1]) return null
  return '/profile/' + profileLink[1]
})
const popupMenu = ref()
const togglePopup = (e) => {
  popupMenu.value.toggle(e)
}

const popupMenuItems = computed(() => {
  const menus = [
    {
      title: t('chat.leave'),
      action: async () => {
        useMainStore().confirm({
          header: t('chat.leave_header'),
          message: t('chat.leave_message'),
          acceptLabel: t('acceptLabel'),
          rejectLabel: t('rejectLabel'),
          accept: async () => {
            await chat.leaveRoom(props.room.id)
            chat.removeFloatingChat(props.room.id)
          },
          reject: () => {},
        })
      },
    },
  ]
  const messagerId = get(messager.value, 'id')
  if (messagerId) {
    if (chat.isBlockedUser(messagerId)) {
      menus.push({
        title: t('profile_card.unblock'),
        action: async () => {
          const result = await chat.removeFromBlockList(messagerId)
          if (result.success) {
            useNotification().showModal({
              title: t('toast.success'),
              subtitle: t('chat.unblocked_message', [get(messager.value, 'profile.displayName')]),
              type: 'success',
            })
          }
        },
      })
    } else {
      menus.push({
        title: t('chat.block'),
        action: async () => {
          const result = await chat.addToBlockList(messagerId)
          if (result.success) {
            useNotification().showModal({
              title: t('toast.success'),
              subtitle: t('chat.blocked_message', [get(messager.value, 'profile.displayName')]),
              type: 'success',
            })
          }
        },
      })
    }
  }
  return menus
})

// const myMembership = computed(() => {
//   return props.room.members.find((e) => e.id === chat.myId) ?? {}
// })
const isGroup = computed(() => {
  return props.room.members.length > 2
})
const members = computed(() => {
  return props.room.members.map((e) => chat.users[e.id])
})
const messager = computed(() => {
  if (!isGroup.value && !isEmpty(members.value)) {
    return members.value.find((e) => e?.id !== chat.myId)
  }
  return {}
})
const isBlocked = computed(() => {
  const messagerId = get(messager.value, 'id')
  if (messagerId) {
    return chat.isBlockedUser(messagerId)
  }
  return false
})

// const joinRoom = () => {
//   chat.joinRoom(props.room.id)
// }
const minimizeChat = () => {
  chat.toggleFloatingChat(props.room.id, false)
}
const closeChat = () => {
  chat.removeFloatingChat(props.room.id)
}
</script>

<style lang="scss" scoped>
.icon-button {
  --at-apply: 'btn-flat-primary !min-h-24px !min-w-24px !h-24px !w-24px';
}
.chat-header-blocked {
  background-color: #e0e0e0;
}

.block-status-text {
  font-size: 10px;
  color: #424242;
}
</style>
