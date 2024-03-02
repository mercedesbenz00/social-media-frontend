<template>
  <div class="my-4 text-sm" v-if="group.description">{{ group.description }}</div>
  <div v-if="tags">
    <div class="text-text-primary-dark font-bold text-sm">{{ $t('group.tags') }}:</div>
    <div class="flex flex-wrap gap-2 mt-4">
      <div v-for="(tag, index) in tags" :key="index">
        <div class="rounded-full px-3 py-1 text-xs text-text-primary primary-shadow">{{ tag }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { IGroupData } from '@/data/groups/groups.interface'
import type { PropType } from 'vue'

const props = defineProps({
  group: {
    type: Object as PropType<IGroupData>,
    required: true,
  },
})

const tags = computed(() => {
  if (props.group.tags && props.group.tags.length > 0) props.group.tags.map(({ tag }) => tag)
})
</script>
