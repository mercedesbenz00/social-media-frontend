<template>
  <div>
    <div class="px-4 flex justify-between">
      <span class="text-text-primary font-bold text-xl">{{ $t('group.post_and_activities') }}</span>
      <div class="flex items-center gap-3">
        <PostSortingMenu
          :post-state="stateType.type !== null ? stateType.type : undefined"
          v-model="sortingType"
          :key="stateType.title"
        />
      </div>
    </div>
  </div>
  <PostList :params="postParams.params" :pagination="postParams.pagination" />
</template>
<script setup lang="ts">
import { PAGE_SORT_ORDER } from '@/data/main.model'
import { PostStates } from '@/data/posts/posts.interface'
import type { IGroup } from '@/data/groups/groups.interface'
import type { PostSearchCriteria } from '@/data/posts/posts.interface'
import type { PropType } from 'vue'

const props = defineProps({
  group: {
    type: Object as PropType<IGroup>,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
  query: {
    type: String,
    required: false,
    default: '',
  },
})

const limit = 20
const sortingType = ref({
  title: 'group.newest_posts',
  sortBy: 'publishedAt',
  sortOrder: PAGE_SORT_ORDER.DESC,
  sortType: 'NEWEST',
})

const stateType = ref({
  title: 'group.all_posts',
  type: PostStates.PUBLISHED,
})

watch(
  () => stateType.value,
  () => {
    sortingType.value = {
      title: 'group.newest_posts',
      sortBy: 'publishedAt',
      sortOrder: PAGE_SORT_ORDER.DESC,
      sortType: 'NEWEST',
    }
  },
  { deep: true }
)

const postParams = computed(() => {
  const params = {
    query: props.query ? props.query : null,
    groupIds: [props.group.id],
    states: stateType.value && stateType.value.type !== null ? [stateType.value.type] : null,
    sortType: sortingType.value.sortType,
  } as PostSearchCriteria
  const pagination = {
    size: limit,
    page: 0,
    sortBy: sortingType.value.sortBy,
    sortOrder: sortingType.value.sortOrder,
  }

  return {
    params,
    pagination,
  }
})
</script>
