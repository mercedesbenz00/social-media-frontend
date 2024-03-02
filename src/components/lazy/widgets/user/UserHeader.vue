<template>
  <div class="lg:text-2xl font-700 w-full">
    <div v-if="title" class="text-primary pb-1">{{ title }}</div>

    <div class="flex items-center justify-center w-full text-sm sm:gap-x-2 font-300 flex-wrap">
      <span v-if="subtitle">{{ subtitle }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: undefined,
  },
  subtitle: {
    type: String,
    default: undefined,
  },
})
</script>
