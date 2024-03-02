<template>
  <div class="space-y-6 mt-2" v-if="comments && comments.content && comments.content.length > 0">
    <ReportedComment
      :comment="comment"
      v-for="comment in comments.content"
      :key="comment.commentUuid"
      @keep="keep"
      @remove="remove"
    />
  </div>
  <UniversalEmptyState v-else state="reportedComments" />
</template>
<script setup lang="ts">
import { usePostsStore } from '@/data/posts/posts.store'

const props = defineProps({
  searchValue: {
    type: String,
    required: false,
    default: '',
  },
})

const $posts = usePostsStore()
const route = useRoute()
const comments = ref([] as any)
const params = ref({
  size: 10,
  page: 0,
  groupId: route.params.id,
  query: props.searchValue,
})
const fetchComments = async () => {
  comments.value = await $posts.getCommentsWithComplaints(params.value)
}
const keep = async (id: string) => {
  await $posts.removeCommentComplaints(id)
  fetchComments()
}
const remove = async (commentUuid: string) => {
  await $posts.removeComment({ uuid: commentUuid })
  fetchComments()
}

watch(
  props,
  () => {
    fetchComments()
  },
  { immediate: true }
)
</script>
