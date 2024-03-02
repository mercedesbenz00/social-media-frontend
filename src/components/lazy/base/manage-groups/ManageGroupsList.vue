<template>
  <div class="flex flex-col space-y-2">
    <ManageGroupsItem v-for="group in groups" :key="group.id" :group="group.userGroup" />
  </div>
</template>
<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  groups: {
    type: Array as PropType<any>,
    required: true,
  },
})
</script>
