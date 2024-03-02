<template>
  <div class="flex items-center justify-between mt-0 md:mt-2 px-4 md:px-0">
    <div class="flex items-center gap-x-2 md:gap-x-4">
      <vote-wrapper :data="data" @update="updateVote" @remove="removeVote" />
      <router-link class="flex items-center me-4" :to="`/posts/` + props.post.id">
        <i class="i-figma:message-circle bg-primary/60 w-4 h-4 md:w-6 md:h-6 me-1 cursor-pointer"></i>
        <div class="text-sm">{{ data.commentsCount ?? '0' }}</div>
      </router-link>
    </div>
    <PostShareDropdown :post="post" />
  </div>
</template>
<script lang="ts" setup>
import type { IPost } from '@/data/posts/posts.interface.js'
import { usePostsStore } from '@/data/posts/posts.store'
import type { PropType } from 'vue'
const $posts = usePostsStore()
const props = defineProps({
  post: {
    type: Object as PropType<IPost>,
    required: true,
  },
})
const initilizePostFooter = () => {
  if (props.post)
    $posts.initilizePostFooter(props.post.id, {
      upvotesTotal: props.post.totalVotes?.upvotesTotal ?? 0,
      downvotesTotal: props.post.totalVotes?.downvotesTotal ?? 0,
      voteValue: props.post.totalVotes?.voteValue ?? 0,
      commentsCount: props.post.commentsCount ?? 0,
    })
}
initilizePostFooter()
const data = computed(() => $posts.postFooters[props.post.id])

const updateVote = async (voteType: 'UPVOTE' | 'DOWNVOTE') => {
  await $posts.updateVote(props.post.id, voteType)
}
const removeVote = async () => {
  await $posts.removeVote(props.post.id)
}
</script>
<style scoped lang="scss">
.post-item-footer {
  --at-apply: 'flex';
}
@media screen and (max-width: 575px) {
  .post-item-footer {
    & > i {
      --at-apply: 'w-4 h-4';
    }
  }
}
</style>
