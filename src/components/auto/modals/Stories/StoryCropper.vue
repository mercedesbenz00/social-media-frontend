<template>
  <div class="flex flex-col items-center justify-between min-h-[300px]">
    <Cropper
      ref="cropper"
      class="cropper mb-6"
      :src="src"
      style="height: 386px; width: 360px"
      image-class="blur-sm"
      foreground-class="!opacity-0"
      :stencil-props="{
        aspectRatio: 9 / 16,
        handlerComponent: '',
      }"
    />
    <PButton :loading="loading" @click="share" :label="$t('stories.share')"></PButton>
  </div>
</template>
<script setup lang="ts">
import { useStoriesStore } from '@/data/stories/stories.store'
const $stories = useStoriesStore()
defineProps({
  src: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['close'])
const cropper = ref()
const loading = ref(false)

const share = () => {
  const { canvas } = cropper.value.getResult()
  canvas.toBlob(async (blob: Blob) => {
    loading.value = true
    await $stories.postStory(blob)
    loading.value = false
    emit('close')
  })
}
</script>
