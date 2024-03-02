<template>
  <div class="app-header">
    <div class="max-w-1232px mx-auto flex items-center justify-between w-full px-4">
      <HeaderHamburger v-if="md" />
      <div v-else class="flex items-center justify-between w-full">
        <HeaderIcon />
        <HeaderContent />
      </div>
      <HeaderTrailing />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
const md = useBreakpoints(breakpointsTailwind).smaller('md')
</script>

<style lang="scss" scoped>
.app-header {
  --at-apply: 'h-16 border border-bg-purple-light/50 lg:border-none lg:card-defaults rounded-none z-50 w-full flex items-center justify-between relative';
}
</style>
