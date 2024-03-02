<template>
  <div class="group-card mt-4">
    <div class="cover">
      <PSkeleton class="!w-full !h-full !rounded-none" />
    </div>
    <div class="content">
      <div class="flex justify-between flex-col sm:flex-row">
        <div class="flex flex-col sm:flex-row">
          <div class="avatar border-4 border-white">
            <PSkeleton class="!w-full !h-full" shape="circle" />
          </div>
          <div class="px-3">
            <div class="name"><PSkeleton class="!h-6 !w-80" /></div>
            <div class="members"><PSkeleton class="!h-3 !w-40" /></div>
          </div>
        </div>
        <div class="text-center sm:text-right !my-3 !sm:my-0 position-relative">
          <PSkeleton class="!h-10 !w-36 rounded-full" />
        </div>
      </div>
      <PSkeleton class="!h-4 !w-8/12 mt-2" />
    </div>
  </div>
  <div class="group-card mt-4 !h-12 flex items-center justify-center">
    <PSkeleton width="90%" height="1rem" />
  </div>
  <div class="group-card mt-4 !h-12 flex items-center justify-center">
    <PSkeleton width="90%" height="1rem" />
  </div>
  <div class="group-card mt-4 !h-12 flex items-center justify-center">
    <PSkeleton width="90%" height="1rem" />
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.group-card {
  --at-apply: 'w-auto max-w-180 min-w-61 overflow-hidden card-defaults';
  .cover {
    --at-apply: 'h-50 bg-gray-500 flex justify-center items-center overflow-hidden';
  }
  .content {
    --at-apply: 'position-relative h-auto p-5';

    .avatar {
      --at-apply: 'position-relative mx-auto h-30 w-30 -mt-16 flex justify-center items-center';
      --at-apply: 'rounded-full overflow-hidden';

      .user-avatar {
        --at-apply: 'border-2 border-white';
      }

      span {
        --at-apply: 'hidden position-absolute';
      }

      &:hover {
        span {
          --at-apply: 'inline-flex text-white';
        }
      }
    }

    .name {
      --at-apply: 'font-bold text-2xl  text-center sm:text-left';
    }
    .members {
      --at-apply: 'text-xs font-normal py-1 text-text-primary-light/60 text-center flex items-center justify-center';
      --at-apply: 'sm:ltr:text-left sm:rtl:text-right sm:justify-start';
    }
  }
}
</style>
