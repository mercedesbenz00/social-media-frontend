<template>
  <NotFoundFiller v-if="notFound"></NotFoundFiller>
  <div v-else class="post-details">
    <div class="cursor-pointer mt-4 text-lg font-bold ps-8 flex items-center back-button" @click="router.push('/')">
      <i class="i-figma:arrow-left w-6 h-6 me-2"></i>

      <div>{{ $t('go_back') }}</div>
    </div>
    <PostItem
      @refresh="refresh"
      @update="refresh"
      v-if="post && !postLoading"
      :post="post"
      @remove="router.push('/')"
    ></PostItem>
    <PostSkeleton v-if="postLoading"></PostSkeleton>
    <CommentsCard v-if="post && !postLoading" :post="post"></CommentsCard>
  </div>
</template>
<script setup lang="ts">
import { usePostsStore } from '@/data/posts/posts.store'
const route = useRoute()
const router = useRouter()
const post = ref()
const postLoading = ref(false)
const postId = computed(() => route.params?.id)
const notFound = ref(false)
const refresh = () => {
  fetchPost()
}

const fetchPost = async () => {
  try {
    postLoading.value = true
    const data = await usePostsStore().getPost(Number(postId.value))
    if (data) {
      post.value = data
    }
  } catch (error) {
    // router.push({ path: '/404' })
    notFound.value = true
  } finally {
    postLoading.value = false
  }
}
watch(route, () => {
  if (route.path.startsWith('/posts')) fetchPost()
})
onBeforeMount(() => {
  if (postId.value) {
    fetchPost()
  }
})
</script>

<style scoped lang="scss">
.post-details {
  --at-apply: 'flex flex-col flex-1 gap-y-4 w-full mx-auto  max-w-180  h-max pb-4 md:px-0';
}
</style>
