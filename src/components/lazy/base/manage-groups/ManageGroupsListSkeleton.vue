<template>
  <div class="flex flex-col space-y-2">
    <div
      v-for="i in 5"
      :key="i"
      class="flex items-center justify-between py-6 px-4 rounded-2xl bg-bg-primary border border-bg-purple-light/50 text-sm grid grid-cols-6 gap-x-2"
    >
      <PSkeleton width="32px" height="32px" shape="circle" />
      <PSkeleton width="70%" height="1.2rem" />
      <PSkeleton width="10%" height="1.2rem" />
    </div>
  </div>
</template>
<script setup lang="ts"></script>
