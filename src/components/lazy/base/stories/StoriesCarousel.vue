<template>
  <div class="px-2 py-4" v-if="dataSet && dataSet.length > 0">
    <div v-if="dataSet.length <= 8" class="flex items-center space-x-6">
      <div v-for="(item, index) in dataSet" :key="index">
        <Avatar
          @open="openStory(index)"
          :person-id="item?.authorId"
          class="w-16 h-16 border-4 !border-primary"
          :disallow-link="true"
        />
      </div>
    </div>
    <PCarousel v-else :value="dataSet" :numVisible="8" :numScroll="4" :showNavigators="false" :showIndicators="false">
      <template #item="slotProps">
        <Avatar
          @open="openStory(slotProps.index)"
          :person-id="slotProps.data.authorId"
          class="w-16 h-16 border-4 !border-primary"
          :disallow-link="true"
        />
      </template>
    </PCarousel>
  </div>
  <StoriesComponent v-if="showStories" :stories="stories" :index="storyIndex" @close="showStories = false">
  </StoriesComponent>
</template>
<script lang="ts" setup>
import { useStoriesStore } from '@/data/stories/stories.store'

const $stories = useStoriesStore()
const storyIndex = ref(0)
const showStories = ref(false)
const data = computed(() => $stories.stories)
const loading = ref(false)

const openStory = (index: number) => {
  showStories.value = true
  storyIndex.value = index
}

const stories = computed(() => {
  const values = data.value?.reduce((acc, obj) => {
    const property = obj['authorId']
    acc[property] = acc[property] || []
    obj.file.storyId = obj.id
    acc[property].push(obj.file)
    return acc
  }, {})
  const storiesData = [] as any
  Object.values(values).forEach((item: any) => {
    storiesData.push({
      slides: item,
    })
  })
  storiesData[0].slides.reverse()
  return storiesData
})
const dataSet = computed(() => {
  return Array.from(new Set(data.value?.map((item) => item.authorId))).map((id) => {
    return data.value.find((i) => i.authorId === id)
  })
})

onMounted(async () => {
  loading.value = true
  await $stories.getStories()
  loading.value = false
})
</script>
<style scoped lang="scss">
:deep(.p-carousel) {
  .p-carousel-indicators {
    display: none !important;
  }
  .p-carousel-next.p-disabled,
  .p-carousel-prev.p-disabled {
    opacity: 0;
    transition: 0.3s ease-in-out;
  }
}
</style>
