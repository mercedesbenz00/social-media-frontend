<template>
  <div @click="toggle" class="text-left cursor-pointer flex items-center">
    <span>{{ $t(selected ? selected.title : '') }}</span>
    <span class="pi pi-chevron-down px-1" />
  </div>
  <PopupMenu :items="menuItems" ref="menu" />
</template>

<script setup lang="ts">
import { PostStates, type PostState } from '@/data/posts/posts.interface'
import { PAGE_SORT_ORDER } from '@/data/main.model'
import { useGroupsStore } from '@/data/groups/groups.store'
import type { PropType } from 'vue'
const { t } = useI18n()
const groupStore = computed(() => useGroupsStore())

const props = defineProps({
  postState: {
    type: String as PropType<PostState>,
    default: PostStates.WAITING_TO_BE_PUBLISHED,
  },
  modelValue: {
    type: Object,
    default: () => {
      return {
        title: 'group.newest_posts',
        sortBy: 'publishedAt',
        sortOrder: PAGE_SORT_ORDER.DESC,
        sortType: 'NEWEST',
      }
    },
  },
})

const emit = defineEmits(['update:modelValue'])

const publishedPostSortingItems = ref([
  {
    title: t('group.newest_posts'),
    sortBy: 'publishedAt',
    sortOrder: PAGE_SORT_ORDER.DESC,
    sortType: 'NEWEST',
  },
  {
    title: t('group.top_posts'),
    sortBy: 'createdAt',
    sortOrder: PAGE_SORT_ORDER.DESC,
    sortType: 'TOP',
  },
  {
    title: t('group.trending_posts'),
    sortBy: 'createdAt',
    sortOrder: PAGE_SORT_ORDER.DESC,
    sortType: 'TRENDING',
  },
  {
    title: t('group.popular_posts'),
    sortBy: 'publishedAt',
    sortOrder: PAGE_SORT_ORDER.DESC,
    sortType: 'POPULAR',
  },
])
const pendingPostSortingItems = ref([
  {
    title: t('group.newest_posts'),
    sortBy: 'createdAt',
    sortOrder: PAGE_SORT_ORDER.DESC,
    sortType: '',
  },
  {
    title: t('group.oldest_posts'),
    sortBy: 'createdAt',
    sortOrder: PAGE_SORT_ORDER.ASC,
    sortType: '',
  },
])
const menuItems = computed<any>(() => {
  let itemsArr = [...publishedPostSortingItems.value] // published items
  if (
    (groupStore.value.isAdmin || groupStore.value.isModerator) &&
    props.postState === PostStates.WAITING_TO_BE_PUBLISHED
  ) {
    itemsArr = [...pendingPostSortingItems.value] // pending items
  }
  return itemsArr.map((item) => {
    return {
      title: item.title,
      action: ($event) => {
        sortOrder($event, item)
      },
    }
  })
})
const selected = ref(props.modelValue) // default selected

const sortOrder = ($event, item) => {
  toggle($event)
  selected.value = item
  emit('update:modelValue', selected.value)
}

const menu = ref()
const toggle = (event) => {
  menu.value.toggle(event)
}
</script>

<style scoped></style>
