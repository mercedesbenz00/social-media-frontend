<template>
  <div class="group-members">
    <div class="flex items-center justify-between">
      <PSkeleton class="!h-4 !w-4/12" />
    </div>
    <div class="flex justify-between items-center mt-3">
      <div class="flex gap-3">
        <PSkeleton v-for="i in 10" class="!h-12 !w-12" :key="i" shape="circle"/>
      </div>
      <div class="w-full flex flex-col gap-2 px-1">
        <div><PSkeleton class="!h-4 !w-full" /></div>
        <div><PSkeleton class="!h-4 !w-full" /></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.group-members {
  --at-apply: 'card-defaults p-5';
}
</style>
