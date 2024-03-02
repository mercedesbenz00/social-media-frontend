<template>
  <div class="flex items-center gap-x-2">
    <PButton
      v-for="(btn, index) in buttons"
      :key="index"
      :class="btn.class"
      :icon="btn.icon"
      :label="btn.label"
      @click="btn.action"
      :disabled="btn.disabled"
      :loading="loading"
    />
  </div>
</template>
<script setup lang="ts">
import type { IUser } from '@/data/auth/auth.interface'
import { useGroupsStore } from '@/data/groups/groups.store'
import { useMainStore } from '@/data/main.store'
import { usePersonsStore } from '@/data/persons/persons.store'
import type { PropType } from 'vue'
const loading = ref(false)
const route = useRoute()
const props = defineProps({
  user: {
    type: Object as PropType<any>,
    required: true,
  },
  status: {
    type: Object as PropType<any>,
    required: false,
  },
})
const { t } = useI18n()
const emits = defineEmits(['update'])
const $main = useMainStore()
const $groups = useGroupsStore()
const $persons = usePersonsStore()
const state = ref(props.user.state)
const { id } = route.params
const buttons = computed(() => {
  const ACTIONS = actions.value
  if (props.user.bannedPerson) return [ACTIONS.UNMUTE]
  switch (state.value ?? props.status?.state) {
    case 'REQUESTED':
      return [ACTIONS.REQUESTED]
    case 'PENDING':
      return [ACTIONS.IGNORE, ACTIONS.ACCEPT]
    case 'INVITED':
      return [ACTIONS.RESEND]
    case 'APPROVED':
      return [ACTIONS.REMOVE]
    default:
      return [ACTIONS.INVITE]
  }
})

const showConfirm = (header: string, acceptFunc: Function, message?: string) => {
  $main.confirm({
    header,
    message: message ?? '',
    acceptLabel: t('acceptLabel'),
    rejectLabel: t('rejectLabel'),
    accept: async () => acceptFunc(),
    reject: () => {},
  })
}
const actions = computed(() => {
  return {
    ACCEPT: {
      label: t('moderation.accept'),
      icon: 'i-figma:user-plus',
      class: 'btn-primary',
      action: async () => {
        try {
          loading.value = true
          await $groups.updateMemberState(Number(id), props.user.personId ?? props.user.id, { state: 'APPROVED' })
          emits('update', props.user.personId ?? props.user.id)
        } finally {
          loading.value = false
        }
      },
    },
    IGNORE: {
      label: t('moderation.ignore'),
      icon: '',
      class: 'btn-outlined-primary',
      action: async () => {
        try {
          loading.value = true
          await $groups.updateMemberState(Number(id), props.user.personId ?? props.user.id, { state: 'REJECTED' })
          emits('update', props.user.personId ?? props.user.id)
        } finally {
          loading.value = false
        }
      },
    },
    RESEND: {
      label: t('moderation.resend'),
      icon: 'i-figma:resend',
      class: 'btn-primary',
      action: async () => {
        try {
          loading.value = true
          await $groups.inviteToGroup(Number(id), props.user.personId ?? props.user.id, false)
          state.value = 'REQUESTED'
        } finally {
          loading.value = false
        }
      },
    },
    UNMUTE: {
      label: t('moderation.unmute'),
      icon: '',
      class: 'btn-primary',
      action: async () => {
        try {
          loading.value = true
          await $persons.deleteGroupBan(props.user.id)
          emits('update', props.user.personId ?? props.user.id)
        } finally {
          loading.value = false
        }
      },
    },
    REMOVE: {
      label: t('moderation.remove'),
      icon: '',
      class: 'btn-primary',
      action: async () => {
        try {
          showConfirm(t('moderation.remove_member_header'), async () => {
            loading.value = true
            await $groups.updateMemberState(Number(id), props.user.personId ?? props.user.id, {
              state: 'REJECTED',
            })
            emits('update', props.user.personId ?? props.user.id)
            state.value = 'NOT_A_MEMBER'
          })
        } finally {
          loading.value = false
        }
      },
    },
    INVITE: {
      label: t('moderation.invite'),
      icon: 'i-figma:user-plus',
      class: 'btn-primary',
      action: async () => {
        try {
          loading.value = true
          await $groups.inviteToGroup(Number(id), props.user.personId ?? props.user.id)
          state.value = 'INVITED'
        } finally {
          loading.value = false
        }
      },
    },
    REQUESTED: {
      label: t('moderation.requested'),
      icon: 'i-figma:clock',
      class: 'btn-primary',
      disabled: true,
      action: () => {},
    },
  }
})
</script>
