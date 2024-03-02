<template>
  <div>
    <BaseListWithoutPagination v-bind="props" :loading="loading" :data="data">
      <template #action="{ item }">
        <slot name="action" :item="item"></slot>
      </template>
    </BaseListWithoutPagination>
    <div class="pagination" v-if="!loading && showPagination">
      <PPaginator
        ref="paginator"
        v-model:first="first"
        :rows="pageSize"
        :totalRecords="totalRecords"
        @page="onPage($event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IPage } from '@/data/main.model'
import type { PropType } from 'vue'

const data = ref<IPage<any>>()
const first = ref(0)
const loading = ref(false)

const totalRecords = computed(() => {
  return data.value?.totalElements ?? 0
})

const pageSize = computed(() => {
  return data.value?.pageable?.pageSize ?? 0
})

const currentPage = ref(0)

const props = defineProps({
  data: {
    type: Object as PropType<IPage<any>>,
  },
  request: {
    type: Function as PropType<any>,
    required: true,
  },
  params: {
    type: Object as PropType<any>,
    required: true,
  },
  adapter: {
    type: Function as PropType<(any) => { displayText?: string; assiveText?: string; avatar?: string }>,
    required: true,
  },
  goToDetail: {
    type: Function as PropType<any>,
    required: true,
  },
  keyGenerator: {
    type: Function as PropType<any>,
    default: (_, i) => i,
  },
  showPagination: {
    type: Boolean as PropType<any>,
    default: true,
  },
})

const onPage = ($event) => {
  const { page } = $event
  currentPage.value = page
}

const fetch = async (showLoader = true) => {
  if (showLoader) {
    loading.value = true
  }
  data.value = await props.request({ page: currentPage.value, ...props.params })
  loading.value = false
}

watch(currentPage, () => {
  if (!props.data) fetch()
})

onMounted(() => {
  if (!props.data) {
    fetch()
  } else {
    data.value = props.data
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.base-list {
  --at-apply: 'rounded-xl p-5 primary-shadow';
  .item {
    --at-apply: 'border-b-1 border-gray-200 pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0';
  }
}

.pagination {
  --at-apply: 'rounded-xl p-0 mt-4 primary-shadow';
}
</style>
