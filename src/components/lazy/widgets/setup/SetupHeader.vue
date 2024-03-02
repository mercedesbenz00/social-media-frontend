<template>
  <div class="lg:text-2xl text-xl font-300 w-full">
    <div v-if="top" class="text-center pb-1 text-smaller">{{ top }}</div>

    <div class="flex w-full items-center gap-x-2 justify-center flex-wrap">
      <div class="bg-text-primary w-10 h-10 rounded-md flex-center-none">
        <div class="rounded-sm i-heroicons-outline:view-grid text-white text-3xl"></div>
      </div>
      <span class="font-400">SMB Dashboard</span>
      <span v-if="trailing">{{ trailing }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  top: {
    type: String,
    default: undefined,
  },
  trailing: {
    type: String,
    default: 'setup wizard',
  },
})
</script>

<style lang="scss" scoped></style>
