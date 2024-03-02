<template>
  <div>
    <div class="flex items-center mb-2">
      <slot name="avatar">
        <div
          class="w-12 h-12 lg:w-16 lg:h-16 overflow-hidden rounded-full"
          :class="[{ 'border-2 border-white': avatar }]"
        >
          <img :src="avatar || assetImage('no-avatar.svg')" class="w-full h-full" />
        </div>
      </slot>
      <slot name="displayText">
        <div class="px-2 font-bold text-sm lg:text-lg">{{ displayText }}</div>
      </slot>
    </div>
    <slot name="description">
      <div class="px-2 mb-2 font-bold text-sm lg:text-lg">{{ description }}</div>
    </slot>
    <div class="flex items-center">
      <slot name="assiveText">
        <div class="flex items-center px-2 mb-2">
          <i class="i-figma:users bg-primary w-4 h-4 me-2"></i>
          <div class="text-gray-400 text-xs lg:text-sm">{{ assiveText }}</div>
        </div>
      </slot>
    </div>
    <MembersGroupAvatar :group-id="groupId" />
    <div class="flex items-center justify-end">
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
  description: {
    type: String,
    default: '',
  },
  groupId: {
    type: Number,
    required: true,
  },
})

const assetImage = useAssets
</script>

<style scoped></style>
