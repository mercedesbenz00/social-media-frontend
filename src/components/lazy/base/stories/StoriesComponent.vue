<template>
  <div class="overlay">
    <div class="stories_wrapper relative">
      <PButton
        class="btn-primary bg-text-secondary z-100 text-text-primary hover:bg-primary hover:text-text-secondary !absolute !w-[48px] !h-[48px] inset-y-0 -left-16 !m-auto"
        icon="i-figma:chevron-left"
        @click="prevSlide"
      ></PButton>
      <Stories
        :duration="10000"
        :stories="stories"
        ref="stories_component"
        @ended="endedEvent"
        @slide_changed="slideChangedEvent"
      >
        <template #slide="{ slide }">
          <div class="relative w-full h-full" :id="slide.id" :ref="(el) => current_slide.push(el)">
            <StoryHeader :person-id="slide.ownerId" :createdAt="slide.createdAt" @close="stopStory"></StoryHeader>
            <img :src="slide.path" class="w-full h-full object-contain" />
          </div>
        </template>
      </Stories>
      <PButton
        class="btn-primary bg-text-secondary z-100 text-text-primary hover:bg-primary hover:text-text-secondary !absolute !w-[48px] !h-[48px] inset-y-0 -right-16 !m-auto"
        icon="i-figma:chevron-right"
        @click="nextSlide"
      ></PButton>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { IStory } from '@/data/stories/stories.interface'
import { useStoriesStore } from '@/data/stories/stories.store'
import type { PropType } from 'vue'
import Stories from 'vue3-insta-stories'

const emit = defineEmits(['close'])
const $stories = useStoriesStore()
const stories_component = ref()
const current_slide = ref([] as any)
const props = defineProps({
  stories: {
    type: Object as PropType<IStory>,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
})
const endedEvent = () => {
  stopStory()
}

const slideChangedEvent = async () => {
  const { currentStoryIndex } = stories_component.value
  const currentStory = stories_component.value.stories[currentStoryIndex]
  const slide = currentStory.slides.find((slide: any) => slide.id === Number(current_slide.value[currentStoryIndex].id))
  await $stories.seenStories(slide.storyId)
}

const stopStory = () => {
  stories_component.value.stopStory()
  emit('close')
}

const prevSlide = () => {
  stories_component.value.prevSlide()
}

const nextSlide = () => {
  stories_component.value.nextSlide()
}

onMounted(() => {
  stories_component.value.recalculateDimensions()
  stories_component.value.playStory(props.index)
})
</script>
<style scoped lang="scss">
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.8);

  .stories_wrapper {
    width: 446px;
    height: 100%;
    max-height: calc(100% - 3rem);
    margin: 1.5rem auto;
    left: 0;
    right: 0;
    .slide {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
