<template>
  <div class="my-4 px-4 flex justify-between">
    <span v-if="title" class="text-text-primary font-bold text-xl">{{ title }}</span>
    <div class="flex items-center gap-3 md:ms-auto">
      <div>
        <PTieredMenu
          :model="sortingItems"
          :popup="true"
          class="p-0 rounded-lg overflow-hidden mt-2 w-auto"
          ref="pTiredMenu"
        >
          <template #item="{ item }">
            <a
              class="inline-block px-4 py-2 text-left text-text-primary bg-bg-primary-light w-full cursor-pointer hover:bg-primary hover:text-white"
              :class="selectedSortingItem === item && '!bg-primary !text-white'"
              @click.stop="setSelectedItem(item)"
            >
              {{ $t(item.title) }}
            </a>
          </template>
        </PTieredMenu>
        <div @click="sortMenuToggle" class="text-left cursor-pointer flex items-center">
          <span>{{ $t(selectedSortingItem.title) }}</span>
          <span class="pi px-1" :class="popupIcon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PAGE_SORT_ORDER } from '@/data/main.model'
import { usePostsStore, type TPostSearchBy } from '@/data/posts/posts.store'

const postStore = usePostsStore()

defineProps({
  title: {
    type: String,
  },
})

const sItems = [
  {
    title: 'group.newest_posts',
    sortBy: 'NEWEST',
    sortOrder: PAGE_SORT_ORDER.DESC,
    sort: 'publishedAt',
  },
  {
    title: 'group.top_posts',
    sortBy: 'TOP',
    sortOrder: PAGE_SORT_ORDER.DESC,
    sort: 'createdAt',
  },
  {
    title: 'group.trending_posts',
    sortBy: 'TRENDING',
    sortOrder: PAGE_SORT_ORDER.DESC,
    sort: 'createdAt',
  },
  {
    title: 'group.popular_posts',
    sortBy: 'POPULAR',
    sortOrder: PAGE_SORT_ORDER.DESC,
    sort: 'createdAt',
  },
]

const popupIcon = computed(() => (pTiredMenu?.value?.visible ? 'pi-chevron-up' : 'pi-chevron-down'))

const pTiredMenu = ref()
const sortingItems = ref(sItems)
const selectedSortingItem = ref(sItems[0])

function sortMenuToggle(e) {
  pTiredMenu.value.show(e)
}

function setSelectedItem(val) {
  selectedSortingItem.value = val
  const search: TPostSearchBy = {
    criteria: {
      sortType: selectedSortingItem.value.sortBy,
      sort: `${selectedSortingItem.value.sort}, ${selectedSortingItem.value.sortOrder}`,
    },
    pagination: { sortOrder: selectedSortingItem.value.sortOrder },
  }
  postStore.refreshPostList(search)
  pTiredMenu.value.hide()
}
</script>
