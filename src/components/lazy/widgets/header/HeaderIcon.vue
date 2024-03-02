<template>
  <RouterLink to="/" class="flex-none">
    <img class="w-[100px] logo-dark" src="@/assets/images/logo-dark.png" />
    <img class="w-[100px] logo-light" src="@/assets/images/logo-light.png" />
  </RouterLink>
</template>

<script setup></script>

<style lang="scss" scoped>
.dark-mode {
  & .logo-dark {
    display: none;
  }
}

.light-mode {
  & .logo-light {
    display: none;
  }
}
</style>
