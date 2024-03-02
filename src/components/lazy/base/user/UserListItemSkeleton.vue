<template>
  <div class="flex items-center">
    <PSkeleton shape="circle" class="!w-12 !h-12 lg:!w-16 lg:!h-16" />
    <div class="flex flex-1 justify-between">
      <div class="flex flex-col gap-2 mx-2 w-full">
        <PSkeleton width="70%" height="1.2rem" />
        <PSkeleton width="50%" height="1.2rem" />
      </div>
      <PSkeleton width="20%" height="1.2rem" class="rounded-full" v-if="showButton" />
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps({
  showButton: {
    type: Boolean,
    default: true,
  },
})
</script>
