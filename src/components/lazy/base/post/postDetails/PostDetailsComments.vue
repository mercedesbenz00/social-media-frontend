<template>
  <div class="flex-1 overflow-y-scroll overflow-x-hidden w-full pt-4">
    <Comments class="!bg-transparent !rounded-none !shadow-none !p-0" v-if="data" :post="data" :is-details="true" />
  </div>
</template>
<script setup lang="ts">
import type { IPost } from '@/data/posts/posts.interface'
import type { PropType } from 'vue'

defineProps({
  data: {
    type: Object as PropType<IPost>,
    required: true,
  },
  isSmall: {
    type: Boolean,
    required: false,
    default: false,
  },
})
</script>
