<template>
  <template v-if="groupData && groupData.memberState == 'PENDING'">
    <PButton
      class="btn-primary-outlined"
      :disabled="true"
      icon="i-figma:clock"
      :label="device == 'desktop' ? $t('group.waiting_join_approval') : ''"
    />
  </template>
  <template v-else>
    <template v-if="total > MIN_GROUP_COUNT">
      <PButton
        v-if="groupData && groupData.memberState === 'APPROVED'"
        @click.stop="leave"
        :loading="loading"
        class="btn-outlined-primary"
        icon="i-figma:user"
        :label="device == 'desktop' ? $t('group.leave') : ''"
      />
      <PButton
        v-else
        :loading="loading"
        icon="i-fas:user-plus w-4 h-4"
        class="w-auto h-8 flex items-center justify-center h-1"
        :label="device == 'desktop' ? (requiredApproval ? $t('group.join_request') : $t('group.join')) : ''"
        @click.stop="join"
      />
    </template>
    <template v-else>
      <PButton
        v-if="groupData && groupData.memberState === 'APPROVED'"
        @click.stop
        class="btn-outlined-primary"
        v-tooltip.right="$t('group.group_min_number_tooltip', [MIN_GROUP_COUNT])"
        icon="i-figma:user"
        :label="device == 'desktop' ? $t('profile.group_leave') : ''"
      />
      <PButton
        v-else
        :loading="loading"
        icon="i-fas:user-plus w-4 h-4"
        class="w-auto h-8 flex items-center justify-center h-1"
        :label="device == 'desktop' ? (requiredApproval ? $t('group.join_request') : $t('group.join')) : ''"
        @click.stop="join"
      />
    </template>
  </template>
</template>

<script setup lang="ts">
import { useGroupsStore } from '@/data/groups/groups.store'
import type { PropType } from 'vue'
import type { IGroup } from '@/data/groups/groups.interface'
import { useDeviceDetector } from '@/utils/device-detector.utils'

const props = defineProps({
  groupData: {
    type: Object as PropType<IGroup>,
    required: true,
  },
  total: {
    type: Number as PropType<number>,
    required: true,
  },
})
const device = useDeviceDetector()
const $group = useGroupsStore()

const MIN_GROUP_COUNT = ref(5)

const emit = defineEmits(['refresh'])

const requiredApproval = computed(() => props.groupData?.accessType === 'PRIVATE' ?? false)
const hasJoinRequest = computed(() => requiredApproval.value && $group.hasJoinRequest(props.groupData?.id))
const loading = ref(false)

const join = async () => {
  loading.value = true
  await $group.joinGroup(props.groupData.id, requiredApproval.value)
  emit('refresh')
}

const leave = async () => {
  loading.value = true
  await $group.removeUserFromGroup(props.groupData.id)
  emit('refresh')
}

const member = computed(() => props.groupData?.memberState === 'APPROVED')
watch(member, () => {
  loading.value = false
})
</script>

<style scoped></style>
