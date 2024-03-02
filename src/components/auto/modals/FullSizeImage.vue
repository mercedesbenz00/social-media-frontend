<template>
  <vue-final-modal content-class="absolute inset-0 w-full h-full py-6 bg-black/75 z-100 flex">
    <div class="relative w-full items-center justify-center flex flex-col md:flex-row px-4 md:pl-16 md:pr-6">
      <div
        class="absolute top-2 z-10 left-4 bg-bg-primary w-8 h-8 z-10 rounded-full flex items-center justify-center cursor-pointer"
        @click="emits('close')"
      >
        <i class="i-figma:x bg-black block"></i>
      </div>
      <img class="w-full h-full max-w-90vw max-h-90vh object-contain m-auto" :src="url" />
    </div>
  </vue-final-modal>
</template>
<script setup lang="ts">
defineProps({
  url: {
    type: String,
    required: true,
  },
})
const emits = defineEmits(['close'])
</script>
