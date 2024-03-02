<template>
  <div>
    <PButton
      class="w-full"
      :loading="loading"
      :class="button.class"
      :label="button.label"
      @click.stop.prevent="button.action"
      :icon="button.icon"
      :disabled="button.disabled"
    />
  </div>
</template>
<script setup lang="ts">
import type { IGroup } from '@/data/groups/groups.interface'
import { useGroupsStore } from '@/data/groups/groups.store'
import { useMainStore } from '@/data/main.store'
import type { PropType } from 'vue'

const props = defineProps({
  group: {
    type: Object as PropType<IGroup>,
    required: true,
  },
})
const { t } = useI18n()
const $groups = useGroupsStore()
const $main = useMainStore()
const loading = ref(false)
const isMember = ref(props.group.memberState ?? 'NOT_MEMBER')
const isPrivate = ref(props.group.accessType ?? 'PRIVATE')

const actions = computed(() => {
  return {
    JOIN: {
      label: t('group.join'),
      icon: 'i-figma:user-plus',
      action: () => join(),
      disabled: false,
      class: 'btn-primary',
    },
    JOIN_REQUEST: {
      label: t('group.join_request'),
      icon: 'i-figma:user-plus',
      disabled: false,
      action: () => join(true),
      class: 'btn-primary',
    },
    LEAVE: {
      label: t('group.leave'),
      icon: 'i-figma:user-minus',
      disabled: false,
      action: () => {
        $main.confirm({
          header: t('groups.leave_header'),
          message: t('groups.leave_message'),
          acceptLabel: t('acceptLabel'),
          rejectLabel: t('rejectLabel'),
          accept: leave,
          reject: () => {},
        })
      },
      class: 'btn-outlined-primary',
    },
    PENDING: {
      label: t('group.waiting_join_approval'),
      icon: 'i-figma:clock',
      disabled: true,
      class: 'btn-primary text-xs',
      action: () => {},
    },
  }
})
const join = async (approval = false) => {
  try {
    loading.value = true
    await $groups.joinGroup(props.group.id, approval)
    isMember.value = approval ? 'PENDING' : 'APPROVED'
  } finally {
    loading.value = false
  }
}
const leave = async () => {
  try {
    loading.value = true
    await $groups.removeUserFromGroup(props.group.id)
    isMember.value = 'REJECTED'
  } finally {
    loading.value = false
  }
}

const button = computed(() => {
  const ACTIONS = actions.value
  if (isMember.value === 'APPROVED') return ACTIONS.LEAVE
  else if (isMember.value === 'PENDING') return ACTIONS.PENDING
  else {
    if (isPrivate.value === 'PRIVATE') return ACTIONS.JOIN_REQUEST
    else return ACTIONS.JOIN
  }
})
</script>
