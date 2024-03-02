<template>
  <div class="flex items-center justify-between my-4">
    <PSkeleton v-for="i in 8" :key="i" class="!w-16 !h-16 rounded-full border-4 !border-primary" shape="circle" />
  </div>
</template>
