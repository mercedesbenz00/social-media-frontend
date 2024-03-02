<template>
  <div class="max-w-180 gap-y-4 w-full mx-auto px-2 md:px-0 py-6">
    <div class="flex flex-col md:items-center md:flex-row gap-2">
      <router-link :to="{ path: `/` }" class="text-text-primary hover:text-gray-900 font-bold text-xl min-w-50">
        <span class="pi pi-arrow-left text-sm font-bold px-2"></span>
        {{ $t('search_result.title') }}:
      </router-link>
      <span class="p-input-icon-left">
        <i class="cursor-pointer" :class="query ? 'i-figma:x' : 'i-figma:search'" @click="query ? (query = '') : ''" />
        <p-input-text class="w-full h-9" :placeholder="$t('sidebar.search')" v-model="query" />
      </span>
    </div>
    <div class="max-w-180 w-full px-2 md:px-0 mx-auto mt-6">
      <div class="page-level-tab">
        <PTabView v-if="!loading && !noResult" ref="tabview" v-model:activeIndex="activeTab" @tab-change="onTabChanged">
          <PTabPanel>
            <template #header>
              <i class="i-figma:interests w-6 h-6 md:hidden bg-primary/60"></i>
              <div class="hidden md:block">{{ t('search_result.all') }}</div>
            </template>
            <template v-if="activeTab === 0">
              <SearchResultItem
                v-for="(result, index) in searchResultMapped"
                :title="result.title"
                :linkText="result.linkText"
                :subtitle="result.subtitle"
                @seeAll="result.seeAll"
                :key="index"
              >
                <component :is="result.components[0]" v-bind="result"></component>
              </SearchResultItem>
            </template>
          </PTabPanel>
          <PTabPanel v-for="(item, index) in searchResultMapped" :key="index">
            <template #header>
              <i class="w-6 h-6 md:hidden bg-primary/60" :class="item.icon"></i>
              <div class="hidden md:block">{{ item.title }}</div>
            </template>
            <div class="text-2xl my-8 font-bold md:hidden">
              {{ item.title }}
            </div>
            <component
              :is="item.components[1]"
              v-if="item.index === activeTab"
              :params="item.params"
              :showPagination="true"
            ></component>
          </PTabPanel>
        </PTabView>
        <Loading v-if="loading" class="px-8" />
        <div v-if="!loading && noResult" class="text-center">{{ $t('search_result.no_result') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { IPage } from '@/data/main.model'
import type { IGroup } from '@/data/groups/groups.interface'
import type { IPost } from '@/data/posts/posts.interface'
import { useSearchStore } from '@/data/search/search.store'
import type { TResult, TResultMapped } from '@/data/search/search.store'
import type { IPerson } from '@/data/persons/persons.interface'
import PostListWithoutPagination from '@/components/lazy/base/post/PostListWithoutPagination.vue'
import PersonListGeneric from '@/components/lazy/base/lists/PersonListGeneric.vue'
import GroupListGeneric from '@/components/lazy/base/lists/GroupListGeneric.vue'
import PostList from '@/components/lazy/base/post/PostList.vue'
import { firstValueFrom } from 'rxjs'
import { PostStates } from '@/data/posts/posts.interface'
import { debounce } from 'lodash'
import type { Nullable } from 'primevue/ts-helpers'

const { t } = useI18n()
const router = useRouter()
interface MappedResult {
  title: string
  subtitle: string
  linkText: string
  index: number
  seeAll: () => void
  data: IPage<IPerson | IGroup | IPost> | null | undefined
  components: [any, any]
  icon?: string
  params?: any
}

const route = useRoute()
const searchResult = computed<TResult>(() => useSearchStore().pageResult)
const searchResultWithNames = computed<Partial<TResultMapped>>(() => useSearchStore().pageResultMapped)
const componentNames = {
  posts: [PostListWithoutPagination, PostList],
  groups: [GroupListGeneric, GroupListGeneric],
  people: [PersonListGeneric, PersonListGeneric],
}
const icons = {
  people: 'i-figma:users',
  posts: 'i-figma:image',
  groups: 'i-figma:list',
}
const searchResultMapped = computed(() => {
  if (!searchResultWithNames.value) return []
  const mapOrder = ['posts', 'people', 'groups'].filter(
    (n) => searchResultWithNames.value && searchResultWithNames.value[n]
  )
  return mapOrder.map((name, index) => {
    const item = searchResultWithNames.value && searchResultWithNames.value[name]
    const cmps = componentNames[name]
    const mappedResult: MappedResult = {
      icon: icons[name],
      title: t(`search_result.${name}`),
      linkText: `${t('search_result.see_all')} ` + t(`search_result.${name}`),
      subtitle: `${item.totalElements} ${t('search_result.in_total')}`,
      seeAll: () => {
        activeTab.value = index + 1
      },
      index: index + 1,
      data: item,
      components: cmps,
      params: { query: query.value },
    }
    if (name === 'posts') mappedResult.params.states = [PostStates.PUBLISHED]
    return mappedResult
  }) as MappedResult[]
})

const noResult = computed(() => useSearchStore().noPageResult)

const loading = ref(false)
const activeTab = ref(0)
const query = ref<Nullable<string>>(route.query.query?.toString() ?? '')

const onTabChanged = (e) => {
  activeTab.value = e.index
}
const search = debounce(async () => {
  loading.value = true
  await firstValueFrom(useSearchStore().searchQuery(query.value))
  useSearchStore().setPageResult(false)
  loading.value = false
}, 250)
onMounted(async () => {
  if (searchResult.value === null) await search()
})
watch(route, () => {
  query.value = route.query.query as string
})
watch(query, async () => {
  activeTab.value = 0
  router.push({ query: { query: query.value } })
  await search()
})
</script>

<style lang="scss" scoped>
:deep(.page-level-tab) {
  .p-tabview-panels {
    --at-apply: 'md:mt-4';
  }
}
.group-members {
  --at-apply: 'rounded-xl p-5';
  -webkit-box-shadow: 0px 1px 10px 5px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0px 1px 10px 5px rgba(0, 0, 0, 0.15);
  box-shadow: 0px 1px 10px 5px rgba(0, 0, 0, 0.15);

  .item {
    --at-apply: 'border-b-1 border-gray-200 pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0';
  }
}

.pagination {
  --at-apply: 'rounded-xl p-0 mt-4';
  -webkit-box-shadow: 0px 1px 10px 5px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0px 1px 10px 5px rgba(0, 0, 0, 0.15);
  box-shadow: 0px 1px 10px 5px rgba(0, 0, 0, 0.15);
}

.group-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: 16px;
}
@media screen and (max-width: 769px) {
  :deep(.page-level-tab) {
    .p-highlight {
      --at-apply: '!border-b-2 !border-primary';
      i {
        --at-apply: 'bg-primary';
      }
      .p-tabview-nav-link {
        --at-apply: '!bg-transparent';
      }
    }
  }
}
</style>
