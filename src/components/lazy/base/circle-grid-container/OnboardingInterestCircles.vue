<template>
  <div class="interest-container">
    <div class="interest-error py-4">
      <template v-if="selectedCategoriesCount < props.min && !isEmpty(selectedCategories)">
        {{ $t('interests.min', { min: props.min }) }}
      </template>
      <template v-if="selectedCategoriesCount > props.max && !isEmpty(selectedCategories)">
        {{ $t('interests.max', { max: props.max }) }}
      </template>
    </div>
    <span class="p-input-icon-left w-full">
      <i class="i-heroicons-solid:search search-categories-icon" v-if="bigScreen" />
      <p-dropdown
        class="search-categories me-4 w-full"
        :loading="loading"
        v-model="selectedParentCategory"
        @change="selectParentCategoriesFromEvent($event)"
        :options="parentCategories"
        optionLabel="name"
        panel-class="group-dropdown"
        :placeholder="$t('interests.search_categories')"
        :filter="true"
        :filterPlaceholder="$t('interests.find_category')"
        :emptyFilterMessage="$t('interests.no_category')"
        :emptyMessage="$t('interests.no_category')"
      />
    </span>
    <PCarousel :value="parentCategoriesMapped" :numVisible="props.numVisible" :numScroll="1" class="mt-8">
      <template #item="{ data }">
        <div
          v-if="data.label !== 'Selected'"
          @click="selectParentCategory(data.data)"
          class="menu-item"
          :class="{ selected: selectedParentCategory === data.data && !showSelectedElements }"
        >
          {{ data.label }}
        </div>
        <div v-else @click="showSelectedElements = true" class="menu-item" :class="{ selected: showSelectedElements }">
          {{ $t('interests.selected') }} ({{ selectedCategoriesCount }})
        </div>
      </template>
    </PCarousel>
    <CircleGrid
      v-if="!loading && nodes"
      :nodes="nodes"
      :adapter="fromICategoryToCircleNode"
      @selectCircle="selectCircle"
      @unselectCircle="unselectCircle"
      :height="props.height"
      :width="props.width"
    />
    <div v-if="!loading && !showSelectedElements && !subCategories?.length" class="absolute-center">
      {{ $t('interests.no_selected_in_category', { categoryName: selectedParentCategory?.name }) }}
    </div>
    <div v-if="!loading && !selectedCategoriesCount && showSelectedElements" class="absolute-center">
      {{ $t('interests.no_selected') }}
    </div>
    <Loading v-if="loading" class="px-8 absolute-center" />
  </div>
</template>
<script setup lang="ts">
import { useOnboardingStore } from '@/data/onboarding/onboarding.store'
import type { ICategory } from '@/data/onboarding/onboarding.interface'
import type { INode } from '@/components/lazy/base/circle-grid-container/d3-circles-with-gravity-and-no-overlap'
import { getRandomPriorityOrLength } from '@/components/lazy/base/circle-grid-container/d3-circles-with-gravity-and-no-overlap'
import { keyBy, isEmpty } from 'lodash'
const $onboarding = useOnboardingStore()

const props = defineProps({
  max: {
    type: Number,
    default: Infinity,
  },
  min: {
    type: Number,
    default: 5,
  },
  numVisible: {
    type: Number,
    default: 6,
  },
  height: {
    type: Number,
  },
  width: {
    type: Number,
  },
})
const emit = defineEmits(['selectedCircles'])
const parentCategories = ref<ICategory[]>()
const selectedParentCategory = ref<ICategory>()

const parentCategoriesMapped = ref<{ label: string; data: ICategory | null }[]>()

const showSelectedElements = ref(true)

const loading = ref(false)

const fromICategoryToCircleNode = (data: ICategory[]): INode[] => {
  return data.map((category) => {
    return {
      data: category,
      text: category.name,
      priority: getRandomPriorityOrLength(category.name),
      selected: !!selectedCategories.value[category.id],
    }
  })
}

const subCategories = ref<ICategory[] | null>(null)

const selectedCategories = ref<{ [key: string]: ICategory }>({})

const selectedCategoriesCount = computed(() => Object.keys(selectedCategories.value)?.length)

const nodes = computed(() =>
  showSelectedElements.value ? Object.values(selectedCategories.value) : subCategories.value
)

function selectCircle(selectedNode: ICategory) {
  selectedCategories.value = {
    ...selectedCategories.value,
    [selectedNode.id]: selectedNode,
  }
  emit('selectedCircles', Object.values(selectedCategories.value))
}

function unselectCircle(unselectedNode: ICategory) {
  const list = selectedCategories.value
  delete list[unselectedNode.id]
  selectedCategories.value = {
    ...list,
  }
  emit('selectedCircles', Object.values(selectedCategories.value))
}

const fetchCategories = async () => {
  loading.value = true
  parentCategories.value = (await $onboarding.getCategories()).content
  parentCategoriesMapped.value = parentCategories.value.map((data) => ({ label: data.name, data }))
  parentCategoriesMapped.value.unshift({ label: 'Selected', data: null })
  loading.value = false
}

async function fetchSubCategories() {
  if (selectedParentCategory.value && selectedParentCategory.value.id) {
    try {
      loading.value = true
      const res = await $onboarding.getCategories({ parentCategoryId: selectedParentCategory.value.id })
      subCategories.value = res.content
    } finally {
      loading.value = false
    }
  }
}

function selectParentCategoriesFromEvent(event: any) {
  selectParentCategory(event.value)
}

async function selectParentCategory(category: ICategory) {
  showSelectedElements.value = false
  selectedParentCategory.value = category
  await fetchSubCategories()
}

async function fetchUserSelectedCategories() {
  loading.value = true
  const ca = await $onboarding.getCategoriesByPersonId()
  selectedCategories.value = keyBy(ca.content, 'id')
  loading.value = false
}

onMounted(async () => {
  await fetchCategories()
  await fetchUserSelectedCategories()
})

const bigScreen = computed(() => {
  return window?.innerWidth > 575
})
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  margin: auto;

  h1 {
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 32px;
    color: rgba(var(--primary-color));
    margin-top: 56px;
  }

  p {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: rgba(var(--secondary-color));
  }
}

.menu-item {
  padding: 7px 12px;
  cursor: pointer;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  white-space: nowrap;

  &.selected {
    background: #d7c9ff;
    color: rgba(var(--primary-color));
    border-radius: 16px;
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
  }
}

.interest-container {
  position: relative;
  --at-apply: 'mx-auto max-w-90%';
  & .absolute-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .interest-error {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #e10505;
    margin-bottom: 16px;
    width: 100%;
    text-align: center;
    height: 20px;
  }
}

.search-categories {
  border: 1px solid #e0e0e0;
  border-radius: 24px;
  width: 100%;
}

.search-categories-icon {
  width: 24px;
  height: 24px;
}
</style>

<style lang="scss">
.p-carousel-container {
  padding-left: 75px;
  padding-right: 75px;
}

.p-carousel .p-carousel-indicators {
  display: none !important;
}

.p-carousel-prev.p-link {
  background-color: inherit !important;
  box-shadow: none !important;
}

.p-carousel-next.p-link {
  background-color: inherit !important;
  box-shadow: none !important;
}

.p-carousel-prev.p-link {
  color: #62528f !important;
}

.p-carousel-next.p-link {
  color: #62528f !important;
}

.p-carousel-prev.p-link.p-disabled {
  color: #d7c9ff !important;
}

.p-carousel-next.p-link.p-disabled {
  color: #d7c9ff !important;
}

@media (max-width: 575px) {
  .interest-container {
    & .p-carousel-container {
      --at-apply: 'p-0';
      & .p-carousel-items-container {
        --at-apply: 'w-full';

        & .p-carousel-item {
          visibility: visible;
        }
      }
    }
    & .p-carousel-next,
    & .p-carousel-prev {
      --at-apply: 'hidden';
    }
  }
}
</style>
