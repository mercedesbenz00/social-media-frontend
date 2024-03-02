<template>
  <BaseRenderlessModal title="" subtitle="">
    <div class="text-center p-4">
      <div class="text-text-primary text-xl font-bold">{{ $t('post.add_post_to_a_collection') }}</div>
      <div class="py-4" v-html="$t('post.add_post_to_a_collection_message')"></div>
      <div class="w-100 mx-auto">
        <div v-for="collection in currentCollections" :key="collection.id" class="py-1 flex justify-start items-center">
          <PCheckbox :id="collection.id" name="category" :value="collection" v-model="selectedCollections" />
          <label :for="collection.id" class="px-2">{{ collection.name }}</label>
        </div>
        <div class="py-1 flex justify-start items-center">
          <PCheckbox id="create" :binary="true" v-model="createNewCollection" />
          <label class="px-2" for="create">{{ $t('post.create_a_new_collection') }}</label>
        </div>
      </div>
      <div class="w-6/12 mx-auto">
        <PInputText
          v-model="newCollectionName"
          class="w-full"
          :disabled="!createNewCollection"
          :placeholder="$t('post.enter_a_collection_name')"
        />
      </div>
      <div class="py-6 flex justify-end gap-3">
        <p-button @click="close" class="p-button-outlined" :label="$t('post.collection_button_label_cancel')" />
        <p-button @click="addToCollection" class="p-button-primary" :label="$t('post.collection_button_label_save')" />
      </div>
    </div>
  </BaseRenderlessModal>
</template>
<script setup lang="ts">
import { useGroupPostCollectionsStore } from '@/data/groupPostCollections/groupPostCollections.store'

const props = defineProps({
  groupId: {
    type: Number,
    required: true,
  },
  postId: {
    type: Number,
    required: true,
  },
})

const collections = ref()
const currentCollections = computed(() => {
  return collections.value?.content ?? []
})

const emit = defineEmits(['refresh', 'close'])
const selectedCollections = ref()
const createNewCollection = ref(false)
const newCollectionName = ref()

const addToCollection = async () => {
  // currents
  if (selectedCollections.value && selectedCollections.value.length) {
    selectedCollections.value.forEach((c) => {
      useGroupPostCollectionsStore().addPostToGroupCollection(c.id, props.postId)
    })
  }

  //create a new collection
  if (createNewCollection.value) {
    const newCollection = await useGroupPostCollectionsStore().createGroupPostCollections({
      defaultCollection: false,
      groupId: props.groupId,
      name: newCollectionName.value,
    })

    // add post to new collection
    if (newCollection) {
      await useGroupPostCollectionsStore().addPostToGroupCollection(newCollection.id, props.postId)
    }

    emit('refresh')
  }
}

const close = () => {
  emit('close')
}

onMounted(async () => {
  collections.value = await useGroupPostCollectionsStore().getGroupPostCollections({ groupId: props.groupId })
})
</script>
<style scoped lang="scss"></style>
