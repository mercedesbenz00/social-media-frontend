<template>
  <div class="view" :class="showComments ? 'min-h-50vh overflow-auto' : ''">
    <CommentCard
      :class="showComments ? 'hidden' : ''"
      class="comment"
      ref="commentView"
      :comment="comment"
      @open-comments="showComments = true"
    />
    <div class="users" :class="showComments ? 'is-visible' : ''" :style="`max-height: ${usersHeight()}`">
      <ComplaintsUsers :complaints="complaints" @back="showComments = false" />
    </div>
    <div
      class="border border-bg-purple-light/50 mx-px md:border-none md:mx-0 md:card-defaults buttons flex items-center justify-center p-4"
    >
      <PButton :label="t('moderation.keep')" class="btn-outlined-primary" @click="$emit('keep', comment.commentUuid)" />
      <PButton :label="t('moderation.remove')" class="ms-2 btn-primary" @click="$emit('remove', comment.commentUuid)" />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { IComment } from '@/data/posts/posts.interface'
import { usePostsStore } from '@/data/posts/posts.store'
import type { PropType } from 'vue'

const props = defineProps({
  comment: {
    type: Object as PropType<IComment>,
    required: true,
  },
})
const { t } = useI18n()
const showComments = ref(false)
const commentView = ref()
const usersHeight = () => commentView.value?.$el.getBoundingClientRect().height + 90 + 'px'
const $posts = usePostsStore()
const complaints = ref([] as any[])
const fetchComplaints = async () => {
  complaints.value = await $posts.getCommentComplaints(props.comment.commentUuid)
}
defineEmits(['keep', 'remove'])
onMounted(fetchComplaints)
</script>
<style scoped lang="scss">
.view {
  --at-apply: 'max-w-screen flex flex-col md:grid gap-4 relative grid-cols-2';
  grid-template-columns: 3fr 2fr;
  grid-template-areas:
    'c u'
    'b u';
  .comment {
    grid-area: c;
    --at-apply: 'w-screen md:w-full';
  }
  .buttons {
    grid-area: b;
    --at-apply: 'w-screen md:w-full';
  }
  .users {
    grid-area: u;
    --at-apply: 'h-full w-screen translate-x-full absolute md:translate-x-none md:w-full md:relative z-50';
    &.is-visible {
      --at-apply: 'translate-x-none !max-h-full h-auto';
    }
  }
}
</style>
