<template>
  <div class="hidden md:grid">
    <div class="grid gap-1px mt-2" :style="gridStyles">
      <div
        class="relative cursor-pointer"
        @click="openMedia(image)"
        v-for="(image, index) in images"
        :key="index"
        :style="imageStyles(index)"
      >
        <img class="w-full h-full object-cover" :src="image" :alt="image" />
        <div
          class="absolute inset-0 flex items-center justify-center bg-black/25 text-3xl"
          v-if="images.length > 5 && index == images.length - 1"
        >
          +{{ images.length - 5 }}
        </div>
      </div>
    </div>
    <video v-if="video && video.length > 0" controls class="w-full h-full mt-4 max-h-80vh">
      <source :src="video[0].path" />
    </video>
  </div>
</template>

<script setup lang="ts">
import type { IPost } from '@/data/posts/posts.interface'
import type { PropType } from 'vue'

const props = defineProps<{
  post: IPost
}>()

const openMedia = (path: string) => {
  const index = props.post.files?.findIndex((f) => f.path == path)
  if (index !== -1) emits('open-image', index)
}
const emits = defineEmits(['open-image'])
const images = computed(() => props.post.files?.filter((f) => f.mimeType.startsWith('image')).map((f) => f.path))
const video = computed(() => props.post.files?.filter((f) => f.mimeType.startsWith('video')))
const calculateGridStyles = (numImages: number) => {
  switch (numImages) {
    case 1:
      return 'grid-template-rows: repeat(1, 1fr); grid-template-columns: repeat(1, 1fr)'
    case 2:
      return 'grid-template-rows: repeat(1, 1fr); grid-template-columns: repeat(2, 1fr)'
    case 3:
    case 4:
    default:
      return 'grid-template-rows: repeat(2, 1fr); grid-template-columns: repeat(4, 1fr)'
  }
}

const calculateImageStyles = (index: number, numImages: number) => {
  switch (numImages) {
    case 1:
      return 'grid-area: 1 / 1 / 2 / 2'
    case 2:
      return index === 0 ? 'grid-area: 1 / 1 / 2 / 2' : 'grid-area: 1 / 2 / 2 / 3'
    case 3:
      return index === 0
        ? 'grid-area: 1 / 1 / 3 / 3'
        : index === 1
        ? 'grid-area: 1 / 3 / 2 / 5'
        : 'grid-area: 2 / 3 / 3 / 5'
    case 4:
      return index === 0
        ? 'grid-area: 1 / 1 / 3 / 3'
        : index === 1
        ? 'grid-area: 1 / 3 / 2 / 4'
        : index === 2
        ? 'grid-area: 1 / 4 / 2 / 5'
        : 'grid-area: 2 / 3 / 3 / 5'
    default:
      return index === 0
        ? 'grid-area: 1 / 1 / 3 / 3'
        : index === 1
        ? 'grid-area: 1 / 3 / 2 / 4'
        : index === 2
        ? 'grid-area: 1 / 4 / 2 / 5'
        : index === 3
        ? 'grid-area: 2 / 3 / 3 / 4'
        : 'grid-area: 2 / 4 / 3 / 5'
  }
}

const gridStyles = computed(() => calculateGridStyles(images.value?.length || 0))
const imageStyles = (index: number) => calculateImageStyles(index, images.value?.length || 0)
</script>
