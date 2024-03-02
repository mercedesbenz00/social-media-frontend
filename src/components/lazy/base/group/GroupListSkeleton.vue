<template>
  <div class="rounded-xl group-list p-4 w-full">
    <h3><PSkeleton class="!w-20 h-4"></PSkeleton></h3>
    <PDivider class="divider"></PDivider>
    <div v-for="i in 3" :key="i">
      <div class="group-item">
        <PSkeleton class="me-2 p-avatar-lg-s !w-12 !h-12" shape="circle" />
        <div>
          <div class="group-item__title mb-4">
            <PSkeleton class="!w-16 !h-4"></PSkeleton>
          </div>
          <div class="group-item__subtitle">
            <PSkeleton class="!w-18 !h-2"></PSkeleton>
          </div>
        </div>
        <PSkeleton class="!ms-auto !w-12 !h-12" shape="circle" />
      </div>
      <PDivider class="divider"></PDivider>
    </div>
    <a href="#" class="see-more">
      <PSkeleton class="!w-20 !h-4"></PSkeleton>
    </a>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.group-list {
  box-shadow: 0 0 16px rgba(66, 66, 66, 0.25);
  min-width: 240px;
  h3 {
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
    color: #000000;
  }
}

.group-item {
  display: flex;
  align-items: center;

  &__item {
    font-weight: 700;
    font-size: 12px;
    line-height: 16px;
    color: #000000;
    margin-bottom: 4px;
  }

  &__title {
    font-weight: 700;
    font-size: 12px;
    line-height: 16px;
    color: #000000;
  }

  &__subtitle {
    font-weight: 400;
    font-size: 10px;
    line-height: 12px;

    color: #757575;
  }
}

.divider {
  margin: 0.5rem 0 !important;
}

.see-more {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;

  color: #231fdb;
}
</style>
