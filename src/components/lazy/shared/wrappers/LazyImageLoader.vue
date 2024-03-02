<template>
  <div class="lazy-image-loader relative">
    <img
      class="!w-full max-h-[700px] h-auto object-contain"
      loading="lazy"
      :src="props.src"
      :alt="props.alt"
      ref="imgRef"
    />
    <LoaderSpinner v-if="loading" class="lazy-image-loader__loading" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: false,
  },
})

const loading = ref(true)

const imgRef = ref<HTMLImageElement>()

onMounted(() => {
  if (imgRef.value) {
    imgRef.value.onload = () => {
      loading.value = false
    }
  }
})
</script>

<style scoped lang="scss">
.lazy-image-loader {
  & img {
    width: auto;
    margin: auto;
    height: 100%;
  }

  &__loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
