<template>
  <div class="cover-uploader">
    <Cropper
      ref="cropper"
      class="cropper"
      :src="image.src"
      :stencil-size="{
        width: 720,
        height: 280,
      }"
      :stencil-props="{
        handlers: {},
        movable: false,
        resizable: false,
        aspectRatio: 16 / 4.4,
      }"
      image-restriction="stencil"
    />
    <label for="file" class="file-select" v-if="!image.src">
      <span class="i-figma-camera" />
    </label>
    <input class="hidden" id="file" type="file" ref="file" @change="uploadImage($event)" accept="image/*" />
    <div class="btn-group" v-if="image.src">
      <PButton class="p-button-danger" icon="pi pi-times" @click="cancel" />
      <div>
        <label for="fileBtn" class="btn-new">
          <span class="pi pi-camera" />
        </label>
        <input class="hidden" id="fileBtn" type="file" ref="file" @change="uploadImage($event)" accept="image/*" />
      </div>
      <PButton @click="cropImage" class="p-button" icon="pi pi-save" :loading="loading" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

const image = reactive({
  src: '',
  type: '',
})
const cropper = ref()
const props = defineProps({
  loading: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
})
const emits = defineEmits(['upload', 'error'])

const uploadImage = (event) => {
  /// Reference to the DOM input element
  const { files } = event.target
  // Ensure that you have a file before attempting to read it
  if (files && files[0]) {
    // 1. Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
    if (image.src) {
      URL.revokeObjectURL(image.src)
    }
    // 2. Create the blob link to the file to optimize performance:
    const blob = URL.createObjectURL(files[0])

    // 3. Update the image. The type will be derived from the extension and it can lead to an incorrect result:
    image.src = blob
    image.type = files[0].type
  }
}
const cancel = () => {
  image.src = ''
  image.type = ''
}
const cropImage = () => {
  if (cropper.value) {
    const { canvas } = cropper.value.getResult()
    if (canvas) {
      const img = canvas.toDataURL(image.type)
      updateCover(img)
    }
  }
}
const updateCover = (img: any) => {
  fetch(img)
    .then((res) => res.blob())
    .then(async (blob) => {
      const file = new File([blob], 'File name', { type: image.type })
      const formData = new FormData()
      formData.append('file', file)
      emits('upload', formData)
    })
}
watch(props, (v) => {
  if (!v.loading) cancel()
})
</script>

<style lang="scss">
.cover-uploader {
  --at-apply: 'w-full h-full flex justify-center items-center position-relative';
  .file-select {
    --at-apply: 'hidden p-button !text-white h-4 justify-center items-center w-full h-full cursor-pointer';
  }

  &:hover {
    .file-select {
      --at-apply: 'inline-flex';
    }
  }

  .btn-group {
    --at-apply: 'position-absolute z-100 right-3 flex gap-3 items-center bottom-3';
    .btn-new {
      --at-apply: 'bg-secondary px-1 rounded-full px-3 py-2 cursor-pointer';
      font-size: 18px;
      color: #fff;
    }
  }
}
</style>
