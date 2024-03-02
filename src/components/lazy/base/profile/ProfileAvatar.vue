<template>
  <div class="relative w-max h-120px">
    <Avatar class="w-120px h-120px" :src="avatar" @open="emits('show-image', avatar)" :disallow-link="true" />
    <profile-upload-btn
      id="avatar"
      class="bg-primary text-white absolute bottom-0 right-0"
      v-if="me"
      @upload="uploadCanvas"
      :loading="loading"
      :btn-options="btnOptions"
      :rounded="true"
    />
  </div>
</template>
<script setup lang="ts">
import { useAssets } from '@/composables/useAssets'
import { usePersonMediaStore } from '@/data/personMedia/personMedia.store'
const $personMedia = usePersonMediaStore()
const props = defineProps({
  avatar: {
    type: String,
    required: false,
    default: '',
  },
  me: {
    type: Boolean,
    required: false,
    default: false,
  },
})
const emits = defineEmits(['update', 'show-image'])
const loading = ref(false)
const avatar = ref(props.avatar)
const uploadCanvas = async (canvas: HTMLCanvasElement) => {
  try {
    loading.value = true
    const dataUrl = canvas.toDataURL()
    avatar.value = dataUrl
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b))
    })
    if (blob) {
      const file = new File([blob], 'File name', { type: 'image/jpg' })
      const formData = new FormData()
      formData.append('file', file)
      await $personMedia.setAvatar(formData)
      showSuccess()
      emits('update')
    }
  } catch (error) {
    avatar.value = props.avatar
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

defineExpose({ avatar })
</script>
