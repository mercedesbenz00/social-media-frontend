<template>
  <div
    class="flex flex-col items-center justify-center space-y-4 min-h-[300px]"
    @drop.prevent="upload($event)"
    @dragover.prevent
  >
    <div class="i-figma:smartphone bg-primary w-[80px] h-[80px]"></div>
    <div>{{ $t('stories.drag_drop') }}</div>
    <div>
      <label>
        <div class="p-button p-component btn-primary">{{ $t('stories.browse') }}</div>
        <input class="hidden" type="file" id="file" @input="upload" accept="image/png, image/gif, image/jpeg" />
      </label>
    </div>
  </div>
</template>
<script lang="ts" setup>
const emit = defineEmits(['upload'])

const upload = (event) => {
  if (event.type === 'input') emit('upload', event.target.files[0])
  else if (event.type === 'drop') emit('upload', event.dataTransfer.files[0])
}
</script>
