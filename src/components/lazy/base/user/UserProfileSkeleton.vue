<template>
  <div class="rounded-xl w-full mb-8 user overflow-hidden">
    <PSkeleton class="user__cover mb-20"></PSkeleton>
    <PSkeleton class="user__avatar !w-20 !h-20" shape="circle" />
    <div class="user__text">
      <h3><PSkeleton class="!m-auto !w-20 !h-4"></PSkeleton></h3>
      <p><PSkeleton class="!m-auto !w-14 !h-2"></PSkeleton></p>
    </div>
    <div class="px-4">
      <PDivider></PDivider>
    </div>
    <div class="px-4">
      <div class="user__info">
        <PSkeleton class="!w-8 !h-8 me-4" shape="circle" />
        <p><PSkeleton class="!w-12 !h-3"></PSkeleton></p>
        <span><PSkeleton class="!w-2 !h-4"></PSkeleton></span>
      </div>
      <div class="user__info">
        <PSkeleton class="!w-8 !h-8 me-4" shape="circle" />
        <p><PSkeleton class="!m-auto !w-12 !h-3"></PSkeleton></p>
        <span><PSkeleton class="!m-auto !w-2 !h-4"></PSkeleton></span>
      </div>
      <div class="user__info">
        <PSkeleton class="!w-8 !h-8 me-4" shape="circle" />
        <p><PSkeleton class="!m-auto !w-12 !h-3"></PSkeleton></p>
        <span><PSkeleton class="!m-auto !w-2 !h-4"></PSkeleton></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.user {
  box-shadow: 0 0 16px rgb(66 66 66 / 25%);
  position: relative;

  &__cover {
    height: 20%;
    background-color: rgba(2, 2, 2, 0.5);
    min-height: 72px;
    background-repeat: no-repeat;
    background-position: 50%;
  }

  &__avatar {
    position: absolute !important;
    top: 40px;
    left: 50%;
    transform: translateX(-50%);
    border: 2px solid white;
  }

  &__text {
    text-align: center;

    h3 {
      font-weight: 700;
      font-size: 14px;
      line-height: 18px;
      color: #000000;
      margin-bottom: 8px;
    }

    p {
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;

      color: #757575;
    }
  }

  &__info {
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    margin-bottom: 16px;
    div {
      color: #62528f;
      font-size: 18px;
    }

    p {
      color: #757575;
    }

    span {
      color: #352466;
      margin-inline-start: auto;
    }
  }
}
</style>
