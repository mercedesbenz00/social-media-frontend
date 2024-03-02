<template>
  <div class="space-y-6 mt-2" v-if="posts && posts.content && posts.content.length > 0">
    <ReportedPost :post="post" v-for="post in posts.content" :key="post.id" @keep="keep" @unpublish="unpublish" />
  </div>
  <UniversalEmptyState v-else state="reportedPosts" />
</template>
<script setup lang="ts">
import { usePersonsStore } from '@/data/persons/persons.store'
import { usePostsStore } from '@/data/posts/posts.store'

const props = defineProps({
  searchValue: {
    type: String,
    required: false,
    default: '',
  },
})
const $persons = usePersonsStore()
const $posts = usePostsStore()
const route = useRoute()
const posts = ref([] as any)
const params = computed(() => {
  return {
    size: 10,
    page: 0,
    groupId: route.params.id,
    query: props.searchValue,
  }
})
const fetchPosts = async () => {
  posts.value = await $posts.getPostsWithComplaints(params.value)
}
const keep = async (id: number) => {
  await $posts.removePostComplaints(id)
  posts.value.content = posts.value.content.filter((p) => p.id !== id)
}
const unpublish = async (postId: number) => {
  await $posts.updatePost({ postId, data: { state: 'WAITING_TO_BE_PUBLISHED' } })
  keep(postId)
}
watch(
  props,
  () => {
    fetchPosts()
  },
  { immediate: true }
)
</script>
