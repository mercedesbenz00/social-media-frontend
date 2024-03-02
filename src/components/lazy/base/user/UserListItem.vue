<template>
  <div class="flex items-center">
    <slot name="avatar">
      <div
        class="w-12 h-12 lg:w-16 lg:h-16 overflow-hidden rounded-full"
        :class="[{ 'border-2 border-white': avatar }]"
      >
        <img :src="avatar || assetImage('no-avatar.svg')" class="w-full h-full" />
      </div>
    </slot>
    <div class="flex items-center">
      <slot name="displayText">
        <div class="px-2 font-bold text-sm lg:text-lg">{{ displayText }}</div>
      </slot>
      <slot name="assiveText">
        <div class="px-2 text-gray-400 text-xs lg:text-sm">{{ assiveText }}</div>
      </slot>
    </div>
    <div class="ms-auto">
      <slot name="button"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAssets } from '@/composables/useAssets'

defineProps({
  displayText: {
    type: [String, Number],
    default: '',
  },
  assiveText: {
    type: [String, Number],
    default: '',
  },
  avatar: {
    type: String,
    default: null,
  },
})

const assetImage = useAssets
</script>

<style scoped></style>
