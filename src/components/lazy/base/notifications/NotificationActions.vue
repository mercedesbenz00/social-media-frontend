<template>
  <div class="flex items-center space-x-2 mb-1">
    <PButton
      v-for="(button, index) in buttons"
      :key="index"
      @click.stop="button.action"
      :label="button.label"
      :icon="button.icon"
      :class="button.class"
      class="text-xs"
    />
  </div>
</template>
<script setup lang="ts">
import { useGroupsStore } from '@/data/groups/groups.store'
import type { INotification } from '@/data/notifications/notifications.interface'
import { useNotificationsStore } from '@/data/notifications/notifications.store'
import type { PropType } from 'vue'
const props = defineProps({
  notification: {
    type: Object as PropType<INotification>,
    required: true,
  },
  isSmall: {
    type: Boolean,
    required: false,
    default: false,
  },
})
const $groups = useGroupsStore()
const $notifications = useNotificationsStore()
const buttons = computed(() => {
  switch (props.notification.topic) {
    case 'GROUP_JOIN_REQUESTED':
      return [
        {
          label: 'Accept',
          icon: 'i-figma:user-plus',
          class: props.isSmall ? 'h-6 !min-h-6 btn-primary' : 'btn-primary',
          action: () => {
            acceptRequest()
          },
        },
        {
          label: 'Ignore',
          class: props.isSmall ? 'h-6 !min-h-6 btn-outlined-primary' : 'btn-outlined-primary',
          action: () => {
            rejectRequest()
          },
        },
      ]
    case 'USER_INVITED_TO_GROUP':
      return [
        {
          label: 'Accept',
          icon: 'i-figma:user-plus',
          class: props.isSmall ? 'h-6 !min-h-6 btn-primary' : 'btn-primary',
          action: () => {
            join()
          },
        },
        {
          label: 'Ignore',
          class: props.isSmall ? 'h-6 !min-h-6 btn-outlined-primary' : 'btn-outlined-primary',
          action: () => {
            leave()
          },
        },
      ]
  }
})
const emits = defineEmits(['hide'])
const join = async (requiresApproval = false) => {
  if (!props.notification.metadata.groupId) return
  await $groups.joinGroup(props.notification.metadata.groupId, requiresApproval)
  updateNotifications()
}
const leave = async () => {
  if (!props.notification.metadata.groupId) return
  await $groups.removeUserFromGroup(props.notification.metadata.groupId)
  updateNotifications()
}
const acceptRequest = async () => {
  if (!props.notification.metadata.groupId) return
  await $groups.updateMemberState(props.notification.metadata.groupId, props.notification.eventAuthor.id, {
    state: 'APPROVED',
  })
  updateNotifications()
}
const rejectRequest = async () => {
  if (!props.notification.metadata.groupId) return
  await $groups.updateMemberState(props.notification.metadata.groupId, props.notification.eventAuthor.id, {
    state: 'REJECTED',
  })
  updateNotifications()
}

const updateNotifications = async () => {
  await $notifications.updateNotifications([props.notification.id], 'DELETED')
  emits('hide')
}
</script>
