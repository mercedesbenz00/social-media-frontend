<template>
  <div>
    <PostMediaCollage :post="post" @open-image="openMedia($event)" />
    <div v-show="(post.files && post.files.length > 0) || post.linkMeta" class="pt-2">
      <div class="block md:hidden">
        <MediaCarousel
          @openMedia="openMedia($event)"
          class="media-caurosel"
          v-if="post.files && post.files.length > 1"
          :data="post.files"
        />
        <LazyImageLoader
          @click="openMedia(0)"
          v-else-if="post.files && post.files.length > 0 && post.files[0].mimeType.startsWith('image')"
          class="w-full max-h-[700px] bg-cover mb-2 lg:mb-4"
          :src="getPath(post.files[0])"
        />
        <video
          @click="openMedia(0)"
          class="mb-4 w-full h-[374px]"
          v-else-if="post.files && post.files.length > 0 && post.files[0].mimeType.startsWith('video')"
          controls
        >
          <source :src="post.files[0].path" :type="post.files[0].mimeType" />
        </video>
      </div>
      <link-preview v-if="post.files && post.files.length == 0 && post.linkMeta" :meta="post.linkMeta" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useDeviceDetector } from '@/utils/device-detector.utils'
import { useSizedImage } from '@/composables/useSizedImage'
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
})
const getPath = (data: any) => useSizedImage([data], 'BIG')
const emits = defineEmits(['redirect'])
const device = useDeviceDetector()
const patternLink = /https?:\/\/\S+/gi
const openMedia = (index: number) => {
  const { $vfm } = useGlobals()
  $vfm.show({
    component: 'PostDetailsModal',
    bind: {
      drag: false,
      size: 'auto',
      adaptive: false,
      noActions: true,
      data: props.post,
      index: index,
    },
    on: {
      close: () => {
        $vfm.hideAll()
      },
    },
  })
}
</script>
<style scoped lang="scss">
.media-caurosel {
  :deep(.p-carousel-container) {
    --at-apply: 'w-full h-[374px]';
  }
}
</style>
