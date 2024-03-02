<template>
  <div v-for="i in 3" :key="i" class="flex items-center border-bottom py-4">
    <PSkeleton width="48px" height="48px" shape="circle" />
    <div class="flex flex-col flex-1 ms-4">
      <PSkeleton width="20%" class="mb-2" height="1.2rem" />
      <PSkeleton width="40%" height="1.2rem" />
    </div>
    <div class="flex items-center">
      <PSkeleton width="5%" height="1.2rem" />
      <PSkeleton width="5%" height="1.2rem" class="mx-4" />
      <PSkeleton width="5%" height="1.2rem" />
    </div>
    <PSkeleton class="ms-auto flex self-end" width="10%" height="1.2rem" />
  </div>
</template>
<style scoped lang="scss">
.border-bottom {
  border-bottom: 1px solid rgb(var(--bg-border-light));
  &:last-child {
    border-bottom: none;
  }
}
</style>
