<template>
  <div class="block w-full">
    <h1 v-if="title" class="text-3xl font-700 pb-12">{{ title }}</h1>
    <h2 v-if="subtitle" class="pb-4 text-sm">{{ subtitle }}</h2>
    <div class="form-content">
      <slot></slot>
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

<style lang="scss" scoped></style>
