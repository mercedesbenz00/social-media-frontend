<template>
  <div class="view" :class="showComments ? 'min-h-50vh overflow-auto' : ''">
    <PostCard
      :class="showComments ? 'hidden' : ''"
      class="post"
      ref="postView"
      :post="post"
      @open-comments="showComments = true"
    />
    <div class="users" :class="showComments ? 'is-visible' : ''" :style="`max-height: ${usersHeight()}`">
      <ComplaintsUsers :complaints="complaints" @back="showComments = false" />
    </div>
    <div
      class="border border-bg-purple-light/50 mx-px md:border-none md:mx-0 md:card-defaults buttons flex items-center justify-center p-4"
    >
      <PButton :label="t('moderation.keep')" class="btn-outlined-primary" @click="$emit('keep', post.id)" />
      <PButton :label="t('moderation.unpublish')" class="ms-2 btn-primary" @click="$emit('unpublish', post.id)" />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { IPost } from '@/data/posts/posts.interface'
import { usePostsStore } from '@/data/posts/posts.store'
import type { PropType } from 'vue'

const props = defineProps({
  post: {
    type: Object as PropType<IPost>,
    required: true,
  },
})
const showComments = ref(false)
const { t } = useI18n()
const postView = ref()
const usersHeight = () => postView.value?.$el.getBoundingClientRect().height + 90 + 'px'
const $posts = usePostsStore()
const complaints = ref([] as any[])
const fetchComplaints = async () => {
  complaints.value = await $posts.getPostComplaints(props.post.id)
}
defineEmits(['keep', 'unpublish'])
onMounted(fetchComplaints)
</script>
<style scoped lang="scss">
.view {
  --at-apply: 'max-w-screen flex flex-col md:grid gap-4 relative grid-cols-2';
  grid-template-columns: 3fr 2fr;
  grid-template-areas:
    'p u'
    'b u';
  .post {
    grid-area: p;
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
