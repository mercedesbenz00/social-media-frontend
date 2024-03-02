<template>
  <DynamicScroller
    v-if="posts.length || !initialLoading"
    :loading="initialLoading"
    :page-mode="true"
    :items="posts"
    :min-item-size="10"
    class="scroller"
    :emit-update="true"
    :buffer="2000"
    @update="update"
  >
    <template #default="{ item, index, active }">
      <DynamicScrollerItem :item="item" :active="active" :size-dependencies="[item]" :data-index="index">
        <PostItem
          class="-z-10"
          :post="item"
          :key="item.id"
          @update="(v) => postUpdate(v)"
          @remove="(v) => postRemove(v)"
        />
      </DynamicScrollerItem>
    </template>
    <template #after>
      <LoaderPulse v-show="otherPagesLoading"></LoaderPulse>
    </template>
  </DynamicScroller>
  <PostSkeletonList v-if="initialLoading && !otherPagesLoading"></PostSkeletonList>
  <div v-if="noPosts">
    <slot name="no-posts">
      <NoPostsPlaceholder></NoPostsPlaceholder>
    </slot>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { IPost } from '@/data/posts/posts.interface'
import type { IPagination } from '@/data/main.model'
import { usePostsStore } from '@/data/posts/posts.store'
import type { TPostSearchBy } from '@/data/posts/posts.store'
import { uniqBy } from 'lodash'

const route = useRoute()
const initialLoading = ref(false)
const otherPagesLoading = ref(false)
const defaultData = {
  loading: false,
  first: true,
  last: false,
  totalElements: 1,
  totalPages: -1,
  page: 0,
}
let data = reactive({ ...defaultData })
const posts = ref([] as IPost[])
const emptyResponse = ref(false)
const searchBy = ref<TPostSearchBy>({})

const props = defineProps({
  pagination: {
    type: Object as PropType<IPagination>,
    default: () => ({
      page: 0,
      size: 20,
    }),
  },
  params: {
    type: Object,
    default: undefined,
  },
})

const noPosts = computed(() => {
  return !initialLoading.value && !otherPagesLoading.value && (posts.value.length === 0 || emptyResponse.value)
})
const update = (a, b) => {
  if (
    !otherPagesLoading.value &&
    !initialLoading.value &&
    !emptyResponse.value &&
    posts.value.length < data.totalElements &&
    b === posts.value.length &&
    a !== b
  ) {
    lazyLoadFeeds()
  }
}

async function lazyLoadFeeds() {
  if (
    otherPagesLoading.value ||
    initialLoading.value ||
    data.totalElements <= posts.value.length ||
    (data.totalElements !== -1 && data.totalPages === data.page)
  )
    return
  if (data.page > 0) otherPagesLoading.value = true
  if (data.page === 0) initialLoading.value = true
  data.loading = true
  let response
  try {
    // eslint-disable-next-line no-console
    if (!props.params) {
      response = await usePostsStore().getPostByGroupIds(
        { ...props.pagination, page: data.page, ...searchBy.value?.pagination },
        { ...searchBy.value?.criteria }
      )
    } else {
      response = await usePostsStore().getPosts(
        { ...props.params, ...searchBy.value?.criteria },
        { ...props.pagination, page: data.page, ...searchBy.value?.pagination }
      )
    }
    if (response) {
      posts.value = uniqBy([...posts.value, ...(response.content ?? [])], 'id')
      data.first = response.first
      data.last = response.last
      data.totalElements = response.totalElements
      data.totalPages = response.totalPages
      data.page = data.page <= data.totalPages ? response.number + 1 : data.page
    } else {
      emptyResponse.value = true
    }
  } finally {
    otherPagesLoading.value = false
    initialLoading.value = false
    data.loading = false
  }
}

const refresh = () => {
  data = reactive({ ...defaultData })
  posts.value = []
  lazyLoadFeeds()
}
watch(props, refresh, { immediate: true, deep: true })

const postUpdate = (post: IPost) => {
  const index = posts.value.findIndex((p) => p.id === post.id)
  if (index !== -1) {
    posts.value[index] = post
  }
}
const postRemove = (postId) => {
  if (!postId) return
  const index = posts.value.findIndex((p) => p.id === postId)
  if (index !== -1) {
    posts.value.splice(index, 1)
  }
}
const addPost = (post: IPost) => {
  posts.value = [post, ...posts.value]
}

let sub

onMounted(() => {
  sub = usePostsStore().refresh$.subscribe((sB) => {
    if (sB) searchBy.value = sB
    refresh()
  })
})
onUnmounted(() => {
  sub.unsubscribe()
})
defineExpose({ addPost })
</script>

<style lang="scss" scoped>
.scroller {
  :deep(.vue-recycle-scroller__item-wrapper) {
    --at-apply: '!overflow-visible';
  }
  .vue-recycle-scroller__item-wrapper {
    --at-apply: 'overflow-y-visible overflow-visible';
  }
}
</style>
