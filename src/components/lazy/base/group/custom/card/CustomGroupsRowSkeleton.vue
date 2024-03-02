<template>
  <div class="">
    <div class="flex items-center justify-between mb-4">
      <PSkeleton width="75%" height="1.2rem" />
      <PSkeleton width="15%" height="1.2rem" />
    </div>
    <div class="flex flex-col md:flex-row items-center gap-4 justify-between">
      <div class="rounded-2xl primary-shadow overflow-hidden w-full" v-for="i in 3" :key="i">
        <div class="bg-gray-500 relative h-20 mb-8">
          <PSkeleton
            shape="circle"
            class="!w-16 !h-16 !absolute inset-x-0 border-white border-4 mx-auto -bottom-6 md:-bottom-4 md:left-4 md:rtl:right-4 md:mx-0 md:!w-12 md:!h-12"
          />
        </div>
        <div class="px-4 flex items-center justify-between">
          <PSkeleton width="75%" height="1.2rem" />
          <PSkeleton width="15%" height="1.2rem" />
        </div>
        <PDivider />
        <div class="px-4 mb-2"><PSkeleton class="px-4" width="100%" height="1.2rem" /></div>
      </div>
    </div>
  </div>
</template>
