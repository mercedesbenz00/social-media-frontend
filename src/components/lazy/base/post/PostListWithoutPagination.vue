<template>
  <PostItem v-for="post in posts" :key="post.id" :post="post"></PostItem>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import type { IPage } from '@/data/main.model'
import type { IPost } from '@/data/posts/posts.interface'

const props = defineProps({
  data: Object as PropType<IPage<IPost>>,
})

const posts = computed(() => {
  if (props.data && props.data?.content?.length) return props.data.content
  else return []
})
</script>
