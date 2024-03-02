<template>
  <div class="md:mr-16 md:pb-18 relative">
    <div class="mb-5 md:mb-0">
      <MediaCarousel
        :full="true"
        :page="page"
        class="w-full h-full carousel"
        v-if="media && media.length > 1"
        :data="media"
      />
      <div class="full mb-4" v-else-if="media && media.length > 0 && media[0].mimeType.startsWith('image')">
        <img class="w-auto h-full m-auto" :src="media[0].path" alt="" />
      </div>
      <div class="full mb-4" v-else-if="media && media.length > 0 && media[0].mimeType.startsWith('video')">
        <video class="w-full h-full m-auto" controls>
          <source :src="media[0].path" :type="media[0].mimeType" />
        </video>
      </div>
    </div>
    <PostItemFooter :post="post"></PostItemFooter>
  </div>
</template>
<script setup lang="ts">
import type { IPost } from '@/data/posts/posts.interface.js'
import type { PropType } from 'vue'

const props = defineProps({
  post: {
    type: Object as PropType<IPost>,
    required: true,
  },
  page: {
    type: Number,
    required: false,
    default: 0,
  },
})

const media = computed(() => props.post.files)
</script>
<style scoped lang="scss">
@media screen and (min-width: 768px) {
  .carousel {
    width: calc(100vw - 526px);
    height: 100vh;
  }
  .full {
    width: calc(100vw - 526px);
    height: calc(100vh - 9rem);
  }
}
</style>
