<template>
  <div class="gap-y-4">
    <PostItem v-for="post in posts" :post="post" :key="post.id" @refresh="fetchPosts" />
  </div>
</template>
<script setup lang="ts">
import type { IPost } from '@/data/posts/posts.interface'
import { usePostsStore } from '@/data/posts/posts.store'
const props = defineProps({
  collectionId: {
    type: Number,
    required: true,
  },
})
const $posts = usePostsStore()
const posts = ref([] as IPost[])
const fetchPosts = async () => {
  posts.value = await $posts.getCollectionPosts(props.collectionId)
}
onMounted(fetchPosts)
</script>
