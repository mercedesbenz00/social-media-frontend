<template>
  <div
    :style="[cover ? `background-image: url(${cover}); background-size: cover` : '']"
    class="min-h-20 bg-cover bg-gray-500 bg-no-repeat relative mb-6 md:mb-4"
  >
    <Avatar
      :src="avatar || assetImage('no-group.svg')"
      class="absolute w-16 h-16 inset-x-0 mx-auto -bottom-6 md:w-12 md:h-12 md:left-4 md:mx-0 md:-bottom-4 duration-250 ease-out"
    />
  </div>
</template>
<script setup lang="ts">
import { useAssets } from '@/composables/useAssets'

defineProps({
  cover: {
    type: String || null,
    required: false,
    default: null,
  },
  avatar: {
    type: String,
    required: false,
    default: '',
  },
})
const assetImage = useAssets
</script>
