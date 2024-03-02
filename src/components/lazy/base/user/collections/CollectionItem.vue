<template>
  <div @click="openCollection">
    <CollectionsImageGrid :posts="posts" />
    <div class="flex items-center justify-between">
      <div class="flex items-center" v-if="!isEdit">
        <i class="me-2 w-4 h-4 bg-primary" :class="collection.isPublic ? 'i-figma:globe' : 'i-figma:lock'"></i>
        <div class="text-xs font-bold">
          {{ collection.name.length > 20 ? collection.name.slice(0, 17) + '...' : collection.name }}
        </div>
      </div>
      <div v-else class="flex items-center gap-x-1 collection-input w-full mt-1" @click.prevent.stop>
        <p-dropdown v-model="newCollection.isPublic" :options="accessOptions" optionLabel="name" optionValue="value">
          <template #value="slotProps">
            <div class="flex items-center">
              <i :class="slotProps.value ? 'i-figma:globe' : 'i-figma:lock'" class="me-1 w-4 h-4"></i>
            </div>
          </template>
          <template #option="slotProps">
            <div class="flex items-center">
              <i :class="slotProps.option.icon" class="me-1"></i>
            </div>
          </template>
        </p-dropdown>
        <p-input-text class="w-full" v-model="newCollection.name" />
      </div>
      <div class="flex items-center" v-if="!isEdit">
        <PButton class="btn-flat-primary" icon="i-figma:edit" @click.prevent.stop="isEdit = true" />
        <PButton class="btn-flat-primary" icon="i-figma:trash-2" @click.prevent.stop="emits('remove', collection.id)" />
      </div>
    </div>
    <div class="flex items-center mt-2" v-if="isEdit">
      <PButton
        class="btn-primary w-full text-xs"
        size="small"
        :label="t('collections.save')"
        @click.prevent.stop="edit"
      />
      <PButton
        class="btn-flat-primary w-full text-xs"
        size="small"
        :label="t('collections.cancel')"
        @click.prevent.stop="cancel"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useMainStore } from '@/data/main.store'
import type { ICollection } from '@/data/posts/posts.interface'
import { usePostsStore } from '@/data/posts/posts.store'
import type { PropType } from 'vue'

const { t } = useI18n()
const $posts = usePostsStore()
const router = useRouter()
const emits = defineEmits(['remove', 'updated', 'open-posts'])
const props = defineProps({
  collection: {
    type: Object as PropType<ICollection>,
    required: true,
  },
})
const accessOptions = ref([
  {
    icon: 'i-figma:lock',
    value: false,
  },
  {
    icon: 'i-figma:globe',
    value: true,
  },
])
const isEdit = ref(false)
const cancel = () => {
  isEdit.value = false
  newCollection.value = props.collection
}
const posts = computed(() => props.collection.posts)
const newCollection = ref(props.collection)
const edit = async () => {
  const response = await $posts.editCollection(newCollection.value)
  isEdit.value = false
  emits('updated', response)
}
const openCollection = () => {
  if (props.collection.posts && props.collection.posts.length === 0) {
    useMainStore().toast({
      type: 'info',
      message: t('toast.info'),
      detail: t('toast.collection_empty'),
    })
    return
  }
  emits('open-posts', props.collection.id)
}
</script>
<style scoped lang="scss">
.collection {
  &-input {
    & .p-inputtext,
    & .p-dropdown {
      --at-apply: 'text-xs h-7 px-1 py-0.5';
    }
    & .p-dropdown {
      :deep(.p-dropdown-trigger) {
        --at-apply: 'w-2 h-2 m-auto';
      }
      :deep(.p-dropdown-label) {
        --at-apply: 'h-7 p-0.2rem';
      }
    }
  }
}
</style>
