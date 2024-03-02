<template>
  <div class="post-item">
    <div class="post-body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.post {
  &-item {
    --at-apply: 'flex flex-col w-full max-w-720px m-x-auto';
  }
  &-body {
    --at-apply: 'sm:py-4 sm:px-6 p-0 mt-4 rounded-lg bg-bg-primary mx-px border border-bg-purple-light/50 flex flex-col lg:mx-0';
  }
}
</style>
