<template>
  <div class="flex py-4 item">
    <Avatar :person-id="memberData.personId" @loaded="onMemberLoaded" />
    <div class="flex-1 cursor-pointer" @click="gotoProfile">
      <div class="px-2 font-bold text-lg">{{ memberData.displayName }}</div>
      <div class="px-2 text-gray-400 text-sm">{{ lodash.get('cityId', member) }}</div>
      <div class="px-2 text-gray-400 text-sm">{{ assiveText }}</div>
    </div>
    <div v-if="isAdmin">
      <div v-if="buttons && Array.isArray(buttons)" class="flex space-x-4 items-center">
        <PButton
          v-for="(button, index) in buttons"
          :key="index"
          @click.stop="button.action"
          :label="button.label"
          :class="button.class"
          :icon="button.icon"
          :disabled="button.disabled"
          :loading="roomLoading"
          class="px-8 text-sm"
        />
      </div>
      <PButton
        v-else
        @click.stop="buttons.action"
        :label="buttons.label"
        :class="buttons.class"
        :icon="buttons.icon"
        :disabled="buttons.disabled"
        :loading="roomLoading"
        class="px-8 text-sm"
      />
    </div>
    <p-button
      v-else
      class="btn-outlined-primary h-1"
      :label="$t('profile.follow_message')"
      @click="openChat"
      :loading="roomLoading"
      :icon="'i-figma-mail'"
      :disabled="memberData.personId == $auth.user?.id"
    />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { useLodash } from '@/plugins/1/lodash.plugin'
import { useLocation } from '@/composables/useLocation'
import { useRouter } from 'vue-router'
import { useGroupsStore } from '@/data/groups/groups.store'
import { useChatStore } from '@/data/chat/chat.store'
import { useAuthStore } from '@/data/auth/auth.store'
const { t } = useI18n()
const $auth = useAuthStore()
const props = defineProps({
  memberData: {
    type: Object as PropType<any>,
  },
  isAdmin: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  groupId: {
    type: Number,
    required: true,
  },
})
const memberState = ref({} as any)
const state = computed(() => props.memberData.state ?? memberState.value.state ?? 'NOT_MEMBER')
const buttons = computed<any>(() => {
  switch (state.value) {
    case 'PENDING':
      return [
        {
          label: t('group.join_ignore'),
          class: 'btn-outlined-primary',
          icon: '',
          disabled: false,
          action: () => {
            leave()
          },
        },
        {
          label: t('group.join_accept'),
          class: 'btn-primary',
          icon: 'i-figma:user-plus',
          disabled: false,
          action: () => {
            join()
          },
        },
      ]
    case 'APPROVED':
      return {
        label: t('group.remove'),
        class: 'btn-outlined-primary',
        icon: '',
        disabled: false,
        action: () => {
          leave()
        },
      }
    case 'INVITED':
      return {
        label: t('group.resend'),
        class: 'btn-primary',
        icon: 'i-figma:repeat',
        action: () => {
          invite()
        },
      }
    case 'NOT_MEMBER':
    case 'REJECTED':
      return {
        label: t('group.invite'),
        class: 'btn-primary',
        icon: 'i-figma:user-plus',
        action: () => {
          invite()
        },
      }
  }
})
const $groups = useGroupsStore()
const member = ref()
const assiveText = ref()
const loading = ref(false)
const id = ref(props.memberData.personId ?? props.memberData.id)
const onMemberLoaded = (data) => {
  member.value = data
}
const invite = async () => {
  try {
    loading.value = true
    await $groups.inviteToGroup(props.groupId, id.value), emits('update')
  } finally {
    loading.value = false
  }
}
watch(member, (newValue) => {
  if (newValue.value.cityId) {
    assiveText.value = useLocation(newValue.value.cityId)
  }
})

const gotoProfile = () => {
  router.push(`/profile/${id.value}`)
}

const join = async () => {
  try {
    loading.value = true
    await $groups.updateMemberState(props.groupId, id.value, { state: 'APPROVED' })
    emits('update')
  } finally {
    loading.value = false
  }
}
const leave = async () => {
  try {
    loading.value = true
    await $groups.updateMemberState(props.groupId, id.value, { state: 'REJECTED' })
    emits('update')
  } finally {
    loading.value = false
  }
}
const lodash = useLodash()
const router = useRouter()

const roomLoading = ref(false)
const openChat = async () => {
  if (roomLoading.value) return
  try {
    roomLoading.value = true
    await useChatStore().initRoom(id.value)
  } finally {
    roomLoading.value = false
  }
}
const emits = defineEmits(['update'])
</script>

<style scoped lang="scss">
.item {
  border-bottom: 1px solid rgb(var(--bg-border-light));
}
</style>
