<template>
  <BaseRenderlessModal :title="$t(title)" subtitle="" @close="() => $emit('close')">
    <div class="flex flex-row">
      <div
        v-if="!image.src"
        @dragenter="onDragEnter"
        @dragleave="onDragLeave"
        @dragover.prevent
        @drop="onDrop"
        :class="[{ 'bg-primary text-blue': isDragging }]"
        class="mb-5 border border-dashed bg-no-repeat border-gray-200 bg-secondary/50 text-center w-75 h-75 flex justify-center items-center bg-contain bg-center"
        :style="src ? `background-image:url(${src})` : ''"
      >
        <div
          :class="
            src
              ? 'bg-black-900/40 p-2 rounded-2xl cursor-pointer transition-250 easy-out opacity-0 hover:opacity-100'
              : ''
          "
        >
          <div class="text-white">{{ $t('profile_card.avatar_upload.drag_file') }}</div>
          <div class="text-white">{{ $t('profile_card.avatar_upload.or') }}</div>
          <label for="files" class="p-button btn-white h-4">
            {{ $t('profile_card.avatar_upload.select_image') }}
          </label>
          <input class="hidden" id="files" type="file" ref="file" @change="uploadImage($event)" accept="image/*" />
        </div>
      </div>
      <div class="flex justify-center flex-col" v-else>
        <Cropper
          ref="cropper"
          class="cropper"
          :src="image.src"
          @dragenter="onDragEnter"
          @dragleave="onDragLeave"
          @dragover.prevent
          @drop="onDrop"
          style="height: 300px; width: 300px"
          :stencil-component="stencilComponent"
          :stencil-props="{
            aspectRatio: 4 / 3,
          }"
        />
        <div class="flex justify-center py-5 gap-3">
          <div>
            <label for="changeFile" class="p-button btn-outlined-primary h-4">
              {{ $t('profile_card.avatar_upload.select_image') }}
            </label>
            <input
              class="hidden"
              id="changeFile"
              type="file"
              ref="file"
              @change="uploadImage($event)"
              accept="image/*"
            />
          </div>
          <PButton
            class="p-button-primary"
            :loading="loading"
            :label="$t('profile_card.avatar_upload.save')"
            @click="cropImage"
          />
        </div>
      </div>
    </div>
  </BaseRenderlessModal>
</template>

<script setup lang="ts">
import { usePersonMediaStore } from '@/data/personMedia/personMedia.store'
import { useGroupsStore } from '@/data/groups/groups.store'
const emits = defineEmits(['close', 'upload'])
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  title: {
    type: String,
    default: 'profile_card.avatar_upload.title',
  },
  src: {
    type: String,
    required: false,
    default: undefined,
  },
})
const file = ref()
const cropper = ref()

const image = reactive({
  src: '',
  type: '',
})

const dragCount = ref(0)
const isDragging = ref(false)
const loading = computed(() => usePersonMediaStore().loading || useGroupsStore().loading)

const updateAvatar = (img: any) => {
  fetch(img)
    .then((res) => res.blob())
    .then(async (blob) => {
      const file = new File([blob], 'File name', { type: image.type })
      const formData = new FormData()
      formData.append('file', file)
      emits('upload', formData)
    })
}
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
const cropImage = () => {
  if (cropper.value) {
    const { canvas } = cropper.value.getResult()
    if (canvas) {
      const img = canvas.toDataURL(image.type)
      updateAvatar(img)
    }
  }
}

const onDragEnter = (e) => {
  e.preventDefault()
  dragCount.value += 1
  isDragging.value = true
}
const onDragLeave = (e) => {
  e.preventDefault()
  dragCount.value -= 1
  if (dragCount.value <= 0) {
    isDragging.value = false
  }
}
const onDrop = (e) => {
  e.preventDefault()
  e.stopPropagation()
  isDragging.value = false
  const { files } = e.dataTransfer
  const event = { target: { files } }
  uploadImage(event)
}

const stencilComponent = resolveComponent('Stencil')
</script>

<style scoped></style>
