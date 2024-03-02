<template>
  <BaseRenderlessModal :title="t('stories.title')">
    <div class="w-full h-full">
      <StoryUploadImage v-if="!src" @upload="readImage($event)"></StoryUploadImage>
      <StoryCropper v-if="src && !croppedSrc" :src="src" @close="emits('success')"></StoryCropper>
    </div>
  </BaseRenderlessModal>
</template>

<script setup lang="ts">
const { t } = useI18n()
const src = ref()
const croppedSrc = ref()
const emits = defineEmits(['success'])
const readImage = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    src.value = e.target?.result
  }
  reader.readAsDataURL(file)
}
</script>
<style scoped lang="scss">
:deep(.post-create) {
  --at-apply: 'p-0 m-0 border-none shadow-none';
}
</style>
