<template>
  <div
    class="flex items-center hover:bg-primary-light/20 transition-250 easy-out px-6 py-2 cursor-pointer"
    @click="() => emits('onClick', item && item.id)"
  >
    <Avatar class="me-2 !w-10 !h-10" :src="get(item, 'avatar.path', undefined)" />
    <div>
      <div class="text-xs font-bold">{{ get(item, 'name', 'No name') }}</div>
      <div class="text-10px leading-tight text-text-secondary-light flex items-center">
        <div class="me-1">{{ get(item, 'stats.membersCount', 0) }}</div>
        <div>{{ $t('group.total_members') }}</div>
      </div>
    </div>
    <div
      v-if="get(item, 'rules')"
      class="ms-auto cursor-pointer text-primary text-sm"
      @click="emits('onRules', get(item, 'rules'))"
    >
      {{ $t('group.rules') }}
    </div>
  </div>
</template>
<script setup lang="ts">
import type { IGroup, IGroupMember } from '@/data/groups/groups.interface'
import type { PropType } from 'vue'
import { get, has } from 'lodash'
const props = defineProps({
  group: {
    type: Object as PropType<IGroup | IGroupMember>,
    required: true,
  },
})
const item = computed(() => {
  if (has(props.group, 'group')) {
    return get(props.group, 'group')
  }
  return props.group as IGroup
})
const emits = defineEmits(['onClick', 'onRules'])
</script>
