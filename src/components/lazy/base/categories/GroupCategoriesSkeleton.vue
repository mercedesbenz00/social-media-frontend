<template>
  <div class="grid grid-cols-3 gap-4">
    <div v-for="(i, index) in 3" :key="index" class="primary-shadow rounded-2xl w-[230px] h-[230px]">
      <PSkeleton width="100%" height="72px" />
      <div class="px-6 py-4 relative flex flex-col">
        <PSkeleton
          class="!absolute w-12 h-12 left-6 -top-6 border-4 border-white"
          width="48px"
          height="48px"
          shape="circle"
        />
        <div class="flex mt-4">
          <PSkeleton width="75%" height="1.2rem" />
          <PSkeleton class="ms-auto" width="15%" height="1.2rem" />
        </div>
        <PSkeleton class="rounded-full mt-5" width="100%" height="42px" />
      </div>
    </div>
  </div>
</template>
