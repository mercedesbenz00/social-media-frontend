<template>
  <div v-if="!disabled" class="comments-card">
    <Comments :post="post" :comment="comment"></Comments>
  </div>
</template>

<script setup lang="ts">
import type { IComment, IPost } from '@/data/posts/posts.interface'
import type { PropType } from 'vue'

const props = defineProps({
  post: {
    type: Object as PropType<IPost>,
  },
  comment: {
    type: Object as PropType<IComment>,
  },
  isSmall: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const disabled = computed(() => {
  if (props.post) return props.post.state !== 'PUBLISHED'
  return false
})
</script>

<style scoped lang="scss">
.comments-card {
  --at-apply: 'w-full mx-auto max-w-180 p-2 md:p-4 rounded-lg bg-bg-primary border border-bg-purple-light/50';
}
</style>
