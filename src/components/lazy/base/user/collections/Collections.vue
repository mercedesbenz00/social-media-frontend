<template>
  <div class="my-4" v-if="collectionId">
    <a @click="collectionId = null" class="text-text-primary hover:text-gray-600 font-bold text-xl cursor-pointer">
      <span class="pi pi-arrow-left text-sm font-bold px-2"></span>
      {{ collection?.name || t('go_back') }}
    </a>
  </div>
  <CollectionsSkeleton v-if="loading" />
  <div
    class="grid gap-2 md:grid-cols-3 px-2 mt-4 cursor-pointer"
    v-else-if="!collectionId && collections && collections.length > 0"
  >
    <CollectionItem
      v-for="collection in collections"
      :key="collection.id"
      :collection="collection"
      @remove="remove"
      @open-posts="collectionId = $event"
      @updated="updateCollection"
    />
  </div>
  <CollectionsEmptyState v-else-if="!collections || !collections.length" @create="createCollection" />
  <CollectionsFeed v-if="collectionId" :collection-id="collectionId" />
</template>
<script setup lang="ts">
import { useMainStore } from '@/data/main.store'
import type { ICollection } from '@/data/posts/posts.interface'
import { usePostsStore } from '@/data/posts/posts.store'
const $posts = usePostsStore()
const $main = useMainStore()
const { t } = useI18n()
const route = useRoute()
const loading = ref(false)
const collections = computed(() => $posts.collections.content ?? [])
const showPosts = ref(false)
const collectionId = ref<number | undefined>(undefined)
const collection = computed(() => collections.value.find((c) => c.id == collectionId.value) || undefined)
const remove = (collectionId: number) => {
  $main.confirm({
    header: t('collections.delete_header'),
    message: t('collections.delete_message'),
    acceptLabel: t('acceptLabel'),
    rejectLabel: t('rejectLabel'),
    accept: async () => {
      await $posts.removeCollection(collectionId)
      $posts.collections.content = collections.value?.filter(
        (collection: ICollection) => collection.id !== collectionId
      )
    },
    reject: () => {},
  })
}
const fetchCollections = async () => {
  try {
    loading.value = true
    await $posts.getCollections()
  } finally {
    loading.value = false
  }
}
const updateCollection = (collection: ICollection) => {
  const index = $posts.collections.content.findIndex((c) => c.id === collection.id)
  if (index !== -1) {
    $posts.collections.content[index].name = collection.name
    $posts.collections.content[index].isPublic = collection.isPublic
  }
}

const createCollection = () => {
  const { $vfm } = useGlobals()
  const component = resolveComponent('CollectionsModal')
  $vfm.show({
    component,
    bind: {
      drag: false,
      size: 'small',
      adaptive: true,
      noActions: true,
      mode: 'create',
    },
    on: {
      close: () => {
        $vfm.hideAll()
      },
      save: () => {
        $vfm.hideAll()
      },
    },
  })
}
onMounted(fetchCollections)
</script>
