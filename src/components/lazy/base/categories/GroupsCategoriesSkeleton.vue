<template>
  <div class="max-w-[720px] mx-auto">
    <div class="text-2xl font-bold mb-4">{{ $t('group.suggested_for_you') }}</div>
    <div class="mb-6" v-for="(i, index) in 2" :key="index">
      <div class="mb-6 flex justify-between">
        <PSkeleton width="20%" height="1.2rem" />
        <PSkeleton width="10%" height="1.2rem" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
