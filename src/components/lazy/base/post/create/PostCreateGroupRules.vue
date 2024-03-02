<template>
  <div class="px-6 py-4">
    <div class="flex items-center justify-between">
      <div>{{ $t('group.rules') }}</div>
      <PButton class="btn-flat-primary" icon="i-figma:x" @click="() => emits('close')" />
    </div>
    <PDivider layout="horizontal" />
    <div>{{ rules }}</div>
  </div>
</template>
<script setup lang="ts">
defineProps({
  rules: {
    type: String,
    required: true,
  },
})
const emits = defineEmits(['close'])
</script>
