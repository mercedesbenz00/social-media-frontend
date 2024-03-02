<template>
  <div class="w-full">
    <div
      class="flex items-center justify-center text-error"
      v-if="selectedCount < props.min || selectedCategories.length == 0"
    >
      {{ t('interests.min', { min: props.min }) }}
    </div>
    <div class="page-level-tab max-w-100%" id="interests-container">
      <PTabView v-model:activeIndex="activeTab" :scrollable="true">
        <PTabPanel :header="`${t('interests.selected')} (${selectedCount})`">
          <OnboardingInterestsTab
            @select="select"
            @unselect="unselect"
            v-if="activeTab == 0"
            :selectedCategories="selectedCategories"
            :name="t('interests.selected')"
          />
        </PTabPanel>
        <PTabPanel v-for="(parentCategory, index) in parentCategories" :key="index" :header="parentCategory.name">
          <OnboardingInterestsTab
            @select="select"
            @unselect="unselect"
            v-if="activeTab == index + 1"
            :id="parentCategory.id"
            :selectedCategories="selectedCategories"
            :name="parentCategory.name"
          />
        </PTabPanel>
      </PTabView>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ICategory } from '@/data/onboarding/onboarding.interface'
import { useOnboardingStore } from '@/data/onboarding/onboarding.store'
import { keyBy } from 'lodash'

const props = defineProps({
  min: {
    type: Number,
    required: false,
    default: 1,
  },
  activeTab: {
    type: Number,
    required: false,
    default: 1,
  },
})

const { t } = useI18n()
const emits = defineEmits(['selected'])
const $onboarding = useOnboardingStore()
const activeTab = ref(props.activeTab)
const parentCategories = ref<ICategory[]>([])
const loading = ref(false)
const fetchParentCaregories = async () => {
  try {
    loading.value = true
    const response = await $onboarding.getCategories()
    if (response) parentCategories.value = response.content
  } finally {
    loading.value = false
  }
}
const selectedCategories = ref<{ [key: string]: ICategory }>({})
const selectedCount = computed(() => Object.keys(selectedCategories.value).length)
const select = (category: ICategory) => {
  selectedCategories.value = {
    ...selectedCategories.value,
    [category.id]: category,
  }
  emits('selected', Object.values(selectedCategories.value))
}
const unselect = (category: ICategory) => {
  const list = selectedCategories.value
  delete list[category.id]
  selectedCategories.value = {
    ...list,
  }
  emits('selected', Object.values(selectedCategories.value))
}

const fetchSelectedCategories = async () => {
  try {
    loading.value = true
    const response = await $onboarding.getCategoriesByPersonId()
    selectedCategories.value = keyBy(response.content, 'id')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchParentCaregories()
  fetchSelectedCategories()
})
</script>
<style scoped lang="scss">
:deep(.page-level-tab) {
  .p-tabview-nav-content {
    --at-apply: 'shadow-none';

    .p-tabview-nav {
      --at-apply: 'justify-start';
    }
  }
}
</style>
