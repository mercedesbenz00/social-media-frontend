<template>
  <div v-if="loading" class="card-defaults p-6 space-y-4 mt-2 md:mt-4">
    <user-list-item-skeleton v-for="i in 6" :key="i" />
  </div>
  <slot v-else-if="items && items.length > 0"></slot>
  <UniversalEmptyState v-else :state="state" />
</template>
<script setup lang="ts">
const props = defineProps({
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
  items: {
    type: Array,
    required: true,
    default: [],
  },
  state: {
    type: String,
    required: true,
  },
})
</script>
