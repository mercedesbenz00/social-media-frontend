<template>
  <div class="scroller">
    <PostSkeleton v-for="i in 5" :key="i"></PostSkeleton>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped lang="scss"></style>
