<template>
  <div
    @click="cover ? emits('show-image', cover) : null"
    :class="{ 'cursor-pointer': cover }"
    class="w-full bg-cover bg-no-repeat h-200px relative bg-center"
    :style="{ backgroundImage: `url('${cover || assetImage('no-group-cover.svg')}')` }"
  >
    <div class="absolute start-6 end-4 top-4 flex items-center justify-end gap-x-2" @click.stop>
      <profile-upload-btn
        id="cover"
        class="bg-gray-400 text-white"
        v-if="me"
        @upload="uploadCanvas"
        :loading="loading"
        :options="{ aspectRatio: 3.6 / 1 }"
        :btn-options="btnOptions"
      />
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAssets } from '@/composables/useAssets'
import { usePersonMediaStore } from '@/data/personMedia/personMedia.store'
import { usePersonsStore } from '@/data/persons/persons.store'

const props = defineProps({
  me: {
    type: Boolean,
    required: false,
    default: false,
  },
  cover: {
    type: String,
    required: false,
    default: '',
  },
})
const emits = defineEmits(['update', 'show-image'])
const route = useRoute()
const $personMedia = usePersonMediaStore()
const assetImage = useAssets
const loading = ref(false)
const cover = ref<string>(props.cover)
const uploadCanvas = async (canvas: HTMLCanvasElement) => {
  try {
    loading.value = true
    const dataUrl = canvas.toDataURL()
    cover.value = dataUrl
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b))
    })
    if (blob) {
      const file = new File([blob], 'File name', { type: 'image/jpg' })
      const formData = new FormData()
      formData.append('file', file)
      await $personMedia.setCover(formData)
      showSuccess()
      emits('update')
    }
  } catch (error) {
    cover.value = props.cover
    showError()
  } finally {
    loading.value = false
  }
}

const showSuccess = () => {
  btnOptions.value.icon = 'i-figma:check'
  btnOptions.value.class = 'btn-success'
  setTimeout(() => {
    btnOptions.value.icon = 'i-figma:camera'
    btnOptions.value.class = 'btn-primary'
  }, 3000)
}

const showError = () => {
  btnOptions.value.icon = 'i-figma:x'
  btnOptions.value.class = 'btn-error'
  setTimeout(() => {
    btnOptions.value.icon = 'i-figma:camera'
    btnOptions.value.class = 'btn-primary'
  }, 3000)
}

const btnOptions = ref({
  icon: 'i-figma:camera',
  class: 'btn-primary',
})

defineExpose({ cover })
</script>
