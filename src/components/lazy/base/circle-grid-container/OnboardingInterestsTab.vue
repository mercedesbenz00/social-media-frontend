<template>
  <div class="w-full">
    <div v-if="loading" class="flex items-center justify-center">
      <loader-spinner />
    </div>
    <CircleGrid
      v-else-if="!loading && subCategories && subCategories.length > 0"
      :nodes="subCategories"
      :adapter="fromICategoryToCircleNode"
      @selectCircle="emits('select', $event)"
      @unselectCircle="emits('unselect', $event)"
      :height="400"
    />
    <div v-else>
      {{ $t('interests.no_selected_in_category', { categoryName: name }) }}
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ICategory } from '@/data/onboarding/onboarding.interface'
import { useOnboardingStore } from '@/data/onboarding/onboarding.store'
import type { PropType } from 'vue'
import { getRandomPriorityOrLength, type INode } from './d3-circles-with-gravity-and-no-overlap'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: Number || null,
    required: false,
    default: null,
  },
  selectedCategories: {
    type: Object as PropType<{ [key: string]: ICategory }>,
    required: true,
  },
})
const emits = defineEmits(['select', 'unselect'])
const $onboarding = useOnboardingStore()
const loading = ref(false)
const isFetched = ref(false)
const subCategories = ref<ICategory[] | null>(null)
const fetchSubCategories = async () => {
  try {
    loading.value = true
    isFetched.value = true
    const response = await $onboarding.getCategories({ parentCategoryId: props.id })
    subCategories.value = response.content
  } finally {
    loading.value = false
  }
}
const fromICategoryToCircleNode = (data: ICategory[]): INode[] => {
  return data.map((category) => {
    return {
      data: category,
      text: category.name,
      priority: getRandomPriorityOrLength(category.name),
      selected: !!props.selectedCategories[category.id],
    }
  })
}

watch(
  props,
  (newVal) => {
    if (newVal.id) {
      if (!isFetched.value) fetchSubCategories()
      else return
    } else subCategories.value = Object.values(props.selectedCategories)
  },
  { immediate: true }
)
</script>
