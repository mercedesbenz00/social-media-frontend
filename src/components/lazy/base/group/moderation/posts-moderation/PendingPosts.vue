<template>
  <div>
    <PostSkeletonList v-if="loading" />
    <div v-else-if="posts.content && posts.content.length > 0">
      <PostItem v-for="post in posts.content" :key="post.id" :post="post">
        <template #footer>
          <PostModerationButtons :post-id="post.id" @update="removeFromList" />
        </template>
      </PostItem>
    </div>
    <UniversalEmptyState v-else state="pending" />
  </div>
</template>
<script setup lang="ts">
import type { IGroup } from '@/data/groups/groups.interface'
import type { IPostData } from '@/data/posts/posts.interface'
import { usePostsStore } from '@/data/posts/posts.store'

const props = defineProps({
  searchValue: {
    type: String,
    required: false,
    default: '',
  },
})

const route = useRoute()
const $posts = usePostsStore()
const { id } = route.params
const posts = ref([] as any)
const loading = ref(false)
const fetchPosts = async () => {
  try {
    loading.value = true
    posts.value = await $posts.getPosts({
      groupIds: [Number(id)],
      states: ['WAITING_TO_BE_PUBLISHED'],
      query: props.searchValue,
    })
  } finally {
    loading.value = false
  }
}

watch(props, () => {
  fetchPosts()
})

const removeFromList = (postId) => {
  posts.value.content = posts.value.content.filter((p) => p.id !== postId)
}
onMounted(fetchPosts)
</script>
