<template>
  <div class="mx-auto max-w-720px w-full">
    <slot name="menu"></slot>
    <group-wrapper :is-admin="isAdmin" :group="group" @update="emits('update')" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: group
</route>

<script setup lang="ts">
import type { IGroup } from '@/data/groups/groups.interface'
import type { PropType } from 'vue'

const props = defineProps({
  group: {
    type: Object as PropType<IGroup>,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
})

const emits = defineEmits(['update'])
</script>
