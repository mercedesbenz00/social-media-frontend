<template>
  <div class="flex items-center gap-x-2">
    <profile-dropdown :data="data" />
    <p-button
      :loading="loadingChat"
      v-if="!data.me"
      class="btn-flat-primary"
      :icon="commonActions.OPEN_CHAT.icon"
      @click="commonActions.OPEN_CHAT.action()"
    />
    <div class="flex items-center gap-x-2">
      <p-button
        class="btn-primary flex items-center gap-x-2"
        @click="action.action ? action.action() : null"
        :label="action.label"
        :icon="action.icon"
        :loading="loading"
      >
      </p-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useChatStore } from '@/data/chat/chat.store'
import { useMainStore } from '@/data/main.store'
import { usePersonsStore } from '@/data/persons/persons.store'
import type { PropType } from 'vue'
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
const $main = useMainStore()
const $persons = usePersonsStore()
const { t } = useI18n()
const router = useRouter()
const $chat = useChatStore()
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})
const md = useBreakpoints(breakpointsTailwind).smaller('md')
const loadingChat = ref(false)
const loading = ref(false)
const commonActions = computed(() => {
  return {
    FOLLOW: {
      label: t('profile_card.follow'),
      icon: 'i-figma:user-plus',
      action: async () => {
        try {
          loading.value = true
          await $persons.followUser(props.data.id)
        } finally {
          loading.value = false
        }
      },
    },
    UNFOLLOW: {
      label: t('profile_card.un_follow'),
      icon: 'i-figma:user-minus',
      action: async () => {
        try {
          loading.value = true
          await $persons.unFollowUser(props.data.id)
        } finally {
          loading.value = false
        }
      },
    },
    OPEN_CHAT: {
      icon: 'i-figma:mail',
      action: async () => {
        try {
          loadingChat.value = true
          const roomId = await $chat.initRoom(props.data.id)
          if (!md) return
          if (roomId) router.push('/chat/' + roomId)
        } finally {
          loadingChat.value = false
        }
      },
    },
    SETTINGS: {
      label: t('profile_dropdown.settings'),
      icon: 'i-figma:edit-2',
      action: () => {
        router.push('/settings')
      },
    },
  }
})
const action = computed(() => {
  const ACTIONS = commonActions.value
  if (props.data.me) return ACTIONS.SETTINGS
  if (props.data.isFollowing) return ACTIONS.UNFOLLOW
  else return ACTIONS.FOLLOW
})
</script>
