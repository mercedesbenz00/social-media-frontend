<template>
  <BaseRenderlessModal
    :title="mode == 'create' || showAdd ? t('collections.create_collection') : t('collections.save_to')"
  >
    <CollectionsSkeleton v-if="loading" :is-grid="false" />
    <div v-else-if="(collections && collections.length > 0) || showAdd" class="flex flex-col mt-6 w-full">
      <CollectionsSave
        v-if="collections && collections.length > 0"
        :collections="collections"
        v-model="currentCollection"
      />
      <div class="pb-4 sticky -bottom-6 bg-bg-primary">
        <PDivider v-if="collections && collections.length > 0" />
        <CollectionsCreate
          v-model="showAdd"
          :loading="loading"
          :access-options="accessOptions"
          :show-cancel="mode !== 'create' && collections && collections.length !== 0"
          @create="createCollection($event)"
        >
          <template #leading>
            <div class="flex items-center" @click="showAdd = true" v-if="!showAdd">
              <div class="rounded-2xl w-64px h-64px bg-gray-300 flex items-center justify-center me-2 cursor-pointer">
                <i class="i-figma:plus w-32px h-32px"></i>
              </div>
              <div>{{ t('collections.new_collection') }}</div>
            </div>
          </template>
        </CollectionsCreate>
      </div>
    </div>
    <CollectionsEmptyState v-else-if="mode !== 'create'" @create="showAdd = true" class="empty-state" />
  </BaseRenderlessModal>
</template>
<script setup lang="ts">
import type { ICollection } from '@/data/posts/posts.interface'
import { usePostsStore } from '@/data/posts/posts.store'
import type { PropType } from 'vue'
const { t } = useI18n()
const emits = defineEmits(['save'])
const props = defineProps({
  mode: {
    type: String as PropType<'save' | 'create'>,
    required: false,
    default: 'save',
  },
})
const $posts = usePostsStore()
const collections = computed<ICollection[]>(() => $posts.collections.content)
const currentCollection = ref<ICollection>()
const showAdd = ref(props.mode === 'create' || false)
const loading = ref(false)
watch(currentCollection, () => {
  emits('save', currentCollection.value)
})
const fetchCollections = async () => {
  try {
    loading.value = true
    await $posts.getCollections()
  } finally {
    loading.value = false
  }
}

const accessOptions = ref([
  {
    name: t('collections.only_me'),
    icon: 'i-figma:lock',
    value: false,
  },
  {
    name: t('collections.global'),
    icon: 'i-figma:globe',
    value: true,
  },
])

const createCollection = async ($event: { name: string; isPublic: boolean }) => {
  try {
    loading.value = true
    const collection = await $posts.createCollection($event)
    if (collection) {
      $posts.collections.content.push(collection)
      emits('save', collection)
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (props.mode === 'create') return
  fetchCollections()
})
</script>
<style scoped lang="scss">
:deep(.empty-state) {
  .icon {
    --at-apply: 'w-30 h-20 mb-0';
  }
  .title {
    --at-apply: 'text-xl';
  }
}
</style>
