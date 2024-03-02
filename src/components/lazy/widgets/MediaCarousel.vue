<template>
  <PCarousel ref="carousel" class="flex" :value="data" :page="currentPage">
    <template #item="{ data: d, index }">
      <LazyImageLoader
        @click="emit('openMedia', index)"
        class="w-full h-[330px] bg-contain"
        :class="full ? 'full' : ''"
        v-if="d.mimeType.startsWith('image')"
        :src="getPath(d)"
      />
      <video v-else controls class="w-full h-full">
        <source :src="d.path" />
      </video>
    </template>
  </PCarousel>
</template>
<script setup lang="ts">
import { useSizedImage } from '@/composables/useSizedImage'

const emit = defineEmits(['openMedia'])
const carousel = ref()
const props = defineProps({
  data: {
    type: Array || Object,
    required: true,
  },
  full: {
    type: Boolean,
    required: false,
    default: false,
  },
  page: {
    type: Number,
    required: false,
    default: 0,
  },
})
const getPath = (data: any) => useSizedImage([data], 'BIG')
const currentPage = ref(0)
onMounted(() => {
  currentPage.value = props.page ?? 0
})
</script>
<style scoped lang="scss">
@media screen and (min-width: 768px) {
  .full {
    height: calc(100vh - 9rem);
  }
}
</style>
