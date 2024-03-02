<template>
  <div>
    <PButton class="uppercase w-40px h-40px" :icon="`${theme.next.icon} text-xl`" @click="theme.change()"></PButton>
  </div>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'

const theme = useTheme()
</script>

<style scoped></style>
