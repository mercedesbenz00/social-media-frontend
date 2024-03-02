<template>
  <div
    class="flex flex-none flex-col items-center w-full sm:px-6 px-0 md:w-120 max-w-[80%]"
    :class="elevated ? 'space-y-10' : 'sm:space-y-8 space-y-4'"
  >
    <div class="block w-full space-y-4">
      <h2 v-if="title" class="sm:text-4xl text-xl font-bold text-primary">{{ title }}</h2>
      <h3 v-if="subtitle" class="sm:text-sm text-xs">{{ subtitle }}</h3>
    </div>
    <div class="min-h-80 h-full w-full" :class="elevated ? 'shadow-md rounded-md border-px border-gray-100 p-4' : ''">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    title: {
      type: String,
      default: undefined,
    },
    subtitle: {
      type: String,
      default: undefined,
    },
    elevated: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    return {}
  },
})
</script>

<style scoped></style>
