<template>
  <div v-for="(collection, index) in collections" :key="index">
    <div class="flex items-center">
      <label :for="collection.name" class="me-2 gap-x-2 flex grow items-center cursor-pointer">
        <CollectionsImageGrid :posts="collection.posts" :is-small="true" />
        <div class="text-sm">
          <div class="font-bold">
            {{ collection.name.length > 20 ? collection.name.slice(0, 17) + '...' : collection.name }}
          </div>
          <div class="flex items-center">
            <i class="me-1" :class="collection.isPublic ? 'i-figma:globe' : 'i-figma:lock'"></i>
            <div>{{ collection.isPublic ? 'Public' : 'Only me' }}</div>
          </div>
        </div>
      </label>
      <PRadioButton
        class="grow-0"
        @change="select($event, collection)"
        :value="collection"
        :input-id="collection.name"
      />
    </div>
    <PDivider v-if="index !== collections.length - 1" />
  </div>
</template>
<script setup lang="ts">
import type { ICollection } from '@/data/posts/posts.interface'
import type { PropType } from 'vue'

const props = defineProps({
  collections: {
    type: Array as PropType<ICollection[]>,
    required: true,
  },
  modelValue: {
    type: Object as PropType<ICollection | null>,
    required: false,
    default: null,
  },
})
const select = ($event: any, collection: ICollection) => {
  emits('update:modelValue', collection)
}
const emits = defineEmits(['update:modelValue'])
</script>
