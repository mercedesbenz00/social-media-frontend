<template>
  <div class="w-full relative">
    <div class="w-full flex flex-none h-4 bg-bg-secondary rounded-full overflow-hidden">
      <div class="bg-primary flex-none" :style="`width: ${value}%`"></div>
      <div class="h-full w-1 bg-bg-primary"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  value: {
    type: Number,
    default: 0,
  },
})
</script>

<style lang="scss" scoped></style>
