<template>
  <div class="sticker-picker">
    <div class="header">
      <span class="p-input-icon-left w-full min-w-60">
        <i :class="$lodash.isEmpty(query) ? 'i-heroicons-solid:search' : 'i-heroicons-solid:x'" @click="query = ''" />
        <PInputText
          :value="query"
          @input="onSearch"
          type="text"
          :placeholder="$t('emoji_sticker.search')"
          class="w-full shadow-sm h-7 text-xs focus-visible:outline-none"
        />
      </span>
      <div v-if="trendingCategories && !stickers.results.length && !query.length" class="trends mt-2.5">
        <div
          class="font-bold px-2 cursor-pointer rounded-2xl bg-bg-primary-extra-light text-12px"
          v-for="(tag, tIndex) in trendingCategories"
          :key="tIndex"
          @click="onSelectTrending(tag.name)"
        >
          {{ tag.name.substring(1) }}
        </div>
      </div>
    </div>
    <div :class="'grid grid-cols-3 h-[87%] overflow-auto filter-content'" ref="content">
      <div v-for="(item, i) in stickers.results" :key="i" class="flex items-center justify-center">
        <img
          class="cursor-pointer w-full h-full object-cover"
          :src="item.media_formats.tinygif.url"
          @click="$emit('select', { item_media: item.media_formats, content_description: item.content_description })"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStickerStore } from '@/data/stickers/stickers.store'
import { get, debounce } from 'lodash'
import type { ISearchResults, ISticker } from '@/data/stickers/stickers.interface'
import type { IPagination } from '@/data/main.model'

defineEmits(['select'])
const props = defineProps({
  filter: {
    type: String,
    required: false,
    default: '',
  },
})
const query = ref('')
const stickers = ref({ results: [] as Array<ISticker>, next: 0 })
const searchSticker = async (nextPage = 0) => {
  if (loading.value) return

  const pagination = {
    page: nextPage,
    size: 10,
  } as IPagination

  const response = (await useStickerStore().searchStickers(query.value, pagination, props.filter)) as ISearchResults

  if (nextPage) {
    stickers.value = {
      next: Number(response.next),
      results: [...stickers.value.results, ...response.results],
    }
  } else {
    stickers.value = response as any
    content.value.scrollTo({ top: 0 } as any)
  }
}
const onSearch = debounce((q) => {
  query.value = q.target.value
  if (query.value.length) {
    searchSticker()
  }
}, 500)

const onSelectTrending = (t) => {
  query.value = t.replace('#', '')
  searchSticker()
}
const reset = () => {
  stickers.value = { results: [] as Array<ISticker>, next: 0 }
  useStickerStore().searchCategories()
}
const trendingCategories = computed(() => {
  const trendingCategories = useStickerStore().categories
  if (get(trendingCategories, 'tags')) {
    const tags = get(trendingCategories, 'tags', [])
    tags.sort((a, b) => a.name.length - b.name.length || a.name.localeCompare(b.name))
    return tags.length > 20 ? tags.slice(0, 20) : tags
  }
  return []
})
const loading = computed(() => useStickerStore().loading)

const content = ref()

watch(query, (newValue) => {
  if (!newValue.length) {
    reset()
  }
})

onMounted(async () => {
  await useStickerStore().searchCategories() // trending categories
  query.value = trendingCategories.value[0].searchterm
  searchSticker()
  content.value.addEventListener('scroll', () => {
    if (content.value.scrollTop + content.value.clientHeight >= content.value.scrollHeight - 10) {
      searchSticker(stickers.value.next)
    }
  })
})
</script>

<style scoped lang="scss">
.trends {
  --at-apply: 'max-w-100% overflow-x-scroll flex items-center space-x-2 whitespace-nowrap';
  scrollbar-width: thin;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}
.filter-content {
  scrollbar-width: thin;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}
.sticker-picker {
  --at-apply: 'h-372px flex-wrap';
  .header {
    --at-apply: 'px-2 py-3';

    .trending {
      --at-apply: 'flex flex-wrap gap-1 items-center py-4 border-b border-gray-300';
      a {
        --at-apply: 'rounded-full p-1 border-1 text-xs text-text-primary cursor-pointer hover:bg-purple-100';
      }
      span {
        --at-apply: 'text-xs font-bold mx-1';
      }
    }
  }

  .content {
    --at-apply: '';
  }
}
</style>
