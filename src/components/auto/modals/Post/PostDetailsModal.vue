<template>
  <vue-final-modal content-class="absolute inset-0 w-full h-full py-6 bg-black/75 z-100 flex">
    <div class="relative flex flex-col md:flex-row px-4 md:pl-16 md:pr-6">
      <div
        class="absolute top-2 z-10 left-4 bg-bg-primary w-8 h-8 z-10 rounded-full flex items-center justify-center cursor-pointer"
        @click="emit('close')"
      >
        <i class="i-figma:x bg-black block"></i>
      </div>
      <PostDetailsMedia :post="data" :page="index" />
      <div class="card-defaults overflow-auto w-full px-2 md:py-4 md:ps-4 md:pe-2 md:w-[376px] h-full flex flex-col">
        <PostItemHeader :isSmall="true" :post="data" />
        <PostContent v-if="data.content" :content="data.content" />
        <PostItemFooter :post="data" />
        <PostDetailsComments :isSmall="true" class="mt-4" v-if="data" :data="data" />
      </div>
    </div>
  </vue-final-modal>
</template>
<script setup lang="ts">
import type { IPost } from '@/data/posts/posts.interface'
import type { PropType } from 'vue'
const emit = defineEmits(['close'])
defineProps({
  data: {
    type: Object as PropType<IPost>,
    required: true,
  },
  index: {
    type: Number,
    required: false,
    default: 0,
  },
})
const handleEsc = (e) => {
  if (e.keyCode === 27) emit('close')
}
onMounted(() => {
  if (window) window.addEventListener('keyup', handleEsc)
})
onUnmounted(() => {
  emit('close')
  window.removeEventListener('key', handleEsc)
})
</script>
<style scoped lang="scss">
.border-bottom {
  border-bottom: 1px solid rgba(var(--bg-border-light));
}
</style>
