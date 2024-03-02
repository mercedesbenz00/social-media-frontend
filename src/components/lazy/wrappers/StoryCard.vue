<template>
  <div
    @click="openStory"
    class="rounded-xl story-card relative cursor-pointer"
    :style="`background-image: url(${story.file.path})`"
  >
    <div class="absolute -bottom-8 inset-x-0 mx-auto flex flex-col items-center justify-center">
      <div class="mb-4 text-white text-sm font-bold">{{ story.author.displayName }}</div>
      <div
        class="avatar w-16 h-16 border-4 border-white rounded-full bg-black bg-cover"
        :style="`background-image: url(${avatar})`"
      ></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue'

const props = defineProps({
  story: {
    type: Object as PropType<any>,
    required: true,
  },
})

const emit = defineEmits(['openStory'])

const openStory = () => {
  emit('openStory', props.story)
}

const avatar = computed(() => {
  return props.story.author?.avatar?.path ?? null
})
</script>
<style scoped lang="scss">
.story {
  &-card {
    height: 18rem;
    min-width: 200px;
    --at-apply: 'bg-cover bg-center bg-no-repeat relative';

    &::before {
      border-radius: 0.75rem;
      content: '';
      bottom: 0;
      right: 0;
      left: 0;
      display: block;
      position: absolute;
      width: 100%;
      height: 50%;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 1) 100%);
    }
  }
}
</style>
