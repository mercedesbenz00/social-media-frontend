<template>
  <div class="flex flex-col items-center justify-center font-poppins">
    <img
      :src="assetImage('private-group.svg')"
      alt="private-placeholder"
      class="w-full h-full bg-center bg-cover max-w-[120px] max-h-[120px] mb-5"
    />
    <div class="font-bold text-primary text-2xl mb-2">{{ title }}</div>
    <div class="text-primary text-sm mb-28">{{ subtitle }}</div>
  </div>
</template>
<script setup lang="ts">
import { useAssets } from '@/composables/useAssets'

defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
})

const assetImage = useAssets
</script>
