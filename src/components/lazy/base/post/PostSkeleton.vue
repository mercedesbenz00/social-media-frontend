<template>
  <div class="flex flex-col w-full post">
    <div class="post-body py-4 px-6 mt-4 rounded-2xl">
      <div class="flex items-start mb-4">
        <PSkeleton class="me-2" shape="circle" size="60px" />
        <div>
          <PSkeleton class="mb-4" width="200px" height="1.2rem"></PSkeleton>
          <PSkeleton width="100px" height="0.8rem"></PSkeleton>
        </div>
      </div>
      <PSkeleton class="mb-4" height="400px"></PSkeleton>
      <PSkeleton class="mb-4" width="30%" height="1rem"></PSkeleton>
      <div class="flex items-center space-x-5 mt-4">
        <div class="flex items-center">
          <PSkeleton height="20px" width="40px"></PSkeleton>
        </div>
        <div class="flex items-center">
          <PSkeleton height="20px" width="40px"></PSkeleton>
        </div>
        <div class="flex items-center">
          <PSkeleton height="20px" width="40px"></PSkeleton>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped lang="scss">
.post {
  max-width: 720px;
  width: 100%;
  height: max-content;
  margin-left: auto;
  margin-right: auto;

  &-media {
    width: 100%;
    height: 400px;
  }

  &-body {
    box-shadow: 0px 0px 1rem rgba(66, 66, 66, 0.25);
  }

  &-content {
    border-bottom: 1px solid rgb(var(--bg-border-light));
  }
}

.text-13 {
  font-size: 0.8125rem;
  line-height: 0.9375rem;
}
</style>
