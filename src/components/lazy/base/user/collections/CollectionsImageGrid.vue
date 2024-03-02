<template>
  <div
    class="grid rounded-2xl overflow-hidden"
    v-if="posts && posts.length > 0"
    :class="{ 'grid-cols-2 grid-rows-2 gap-2': posts.length > 1, 'me-2 !gap-0.5': isSmall }"
  >
    <div
      v-for="(post, index) in posts"
      :key="index"
      :class="postImages"
      class="bg-bg-purple-light/50 flex items-center justify-center"
    >
      <img
        class="w-full h-full object-cover"
        v-if="post.files && post.files.length > 0 && post.files[0].mimeType.startsWith('image')"
        :src="post.files[0].path"
        alt="post image"
      />
      <i v-else class="i-figma:image bg-primary" :class="isSmall ? 'w-3 h-3' : 'w-10 h-10'"></i>
    </div>
    <div
      v-for="i in 4 -
      (posts.length === 0 || posts.length === 1
        ? posts[0] && posts[0]?.files.length === 0
          ? 4
          : posts[0]?.files && posts[0]?.files.length > 0
          ? 4
          : 3
        : posts.length)"
      :key="i"
      class="bg-bg-purple-light/50"
      :class="postImages"
    >
      <i class="i-figma:image bg-primary" :class="isSmall ? 'w-3 h-3' : 'w-10 h-10'"></i>
    </div>
  </div>
  <div v-else :class="postImages" class="bg-bg-purple-light/50 flex items-center justify-center rounded-2xl">
    <i class="i-figma:image bg-primary" :class="isSmall ? 'w-3 h-3' : 'w-10 h-10'"></i>
  </div>
</template>
<script setup lang="ts">
import type { IPost } from '@/data/posts/posts.interface'
import type { PropType } from 'vue'

const props = defineProps({
  posts: {
    type: Array as PropType<IPost[]>,
    required: false,
    default: [],
  },
  isSmall: {
    type: Boolean,
    required: false,
    default: false,
  },
})
const postImages = computed(() => {
  if (props.posts && props.posts.length > 1) {
    if (props.isSmall) return 'w-30px h-30px'
    return 'w-full h-110px'
  }
  if (props.isSmall) return 'w-16 h-16'
  return 'w-full h-229px'
})
</script>
