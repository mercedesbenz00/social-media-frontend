<template>
  <div v-if="isGrid" class="grid gap-2 md:grid-cols-3 mt-4">
    <div class="grid grid-cols-2 grid-rows-2 gap-1 rounded-2xl" v-for="i in 6" :key="i">
      <PSkeleton v-for="k in 4" :key="k" class="bg-bg-purple-light/50 !h-16" />
    </div>
  </div>
  <div class="flex flex-col gap-y-2" v-else>
    <div v-for="i in 4" :key="i" class="flex gap-x-2 items-center">
      <PSkeleton shape="circle" class="!w-12 !h-12" />
      <PSkeleton width="60%" height="1.2rem" />
      <PSkeleton class="!w-4 !h-4 ms-auto" />
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  isGrid: {
    type: Boolean,
    required: false,
    default: true,
  },
})
</script>
