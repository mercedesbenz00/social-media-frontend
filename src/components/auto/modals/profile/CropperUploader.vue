<template>
  <base-renderless-modal :title="title">
    <div
      class="cropper w-90vw md:w-50vw h-30vh md:h-50vh md:max-h-436px rounded-3xl overflow-hidden"
      :class="{ rounded: rounded }"
    >
      <img id="image" :src="src" alt="Cropper" />
    </div>
    <template #actions>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-x-2">
          <p-button class="btn-primary font-bold" icon="i-figma:plus" @click="cropper.zoom(0.1)" />
          <p-button class="btn-primary font-bold" icon="i-figma:minus" @click="cropper.zoom(-0.1)" />
        </div>
        <p-button class="btn-primary" label="Save" @click="crop" />
      </div>
    </template>
  </base-renderless-modal>
</template>
<script setup lang="ts">
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import type { PropType } from 'vue'

const emits = defineEmits(['crop'])

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  src: {
    type: String,
    required: true,
  },
  options: {
    type: Object,
    required: true,
  },
  rounded: {
    type: Boolean,
    required: true,
  },
})
const cropper = ref<any>(null)
const init = () => {
  const image = document.getElementById('image') as HTMLImageElement
  const options = { ...props.options, ...{ viewMode: 1, responsive: true } } as any
  cropper.value = new Cropper(image, options)
}

const destroy = () => {
  cropper.value?.destroy()
}

const crop = () => {
  const canvas: HTMLCanvasElement = cropper.value.getCroppedCanvas()
  emits('crop', canvas)
}

onMounted(init)
onUnmounted(destroy)
</script>

<style scoped lang="scss">
:deep(.cropper.rounded) {
  .cropper-view-box {
    --at-apply: 'rounded-full';
  }
}
</style>
