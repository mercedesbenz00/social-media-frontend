<template>
  <div class="relative">
    <div @click="toggle" class="text-left cursor-pointer flex items-center">
      <span>{{ $t(selected ? selected.title : '') }}</span>
      <span class="pi pi-chevron-down px-1" />
    </div>
    <PopupMenu :items="menuItemList" ref="menu" />
  </div>
</template>

<script setup lang="ts">
import { PostStates } from '@/data/posts/posts.interface'
import type { PropType } from 'vue'
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => {
      return {
        title: 'group.all_posts',
        type: null,
      }
    },
  },
  menuItems: {
    type: Array as PropType<Record<any, any>>,
    default: () => [
      {
        title: 'group.all_posts',
        type: null,
      },
      {
        title: 'group.pending_posts',
        type: PostStates.WAITING_TO_BE_PUBLISHED,
      },
      {
        title: 'group.published_posts',
        type: PostStates.PUBLISHED,
      },
      {
        title: 'group.rejected_posts',
        type: PostStates.REJECTED,
      },
      {
        title: 'group.draft_posts',
        type: PostStates.DRAFT,
      },
      {
        title: 'group.deleted_posts',
        type: PostStates.DELETED,
      },
    ],
  },
})
const emit = defineEmits(['update:modelValue'])
const selected = ref(props.modelValue) // default selected

const onSelect = ($event, item) => {
  toggle($event)
  selected.value = item
  emit('update:modelValue', selected.value)
}

const menu = ref()
const toggle = (event) => {
  menu.value.toggle(event)
}

const menuItemList = computed(() => {
  return props.menuItems.map((item) => {
    return {
      title: item.title,
      action: ($event) => {
        onSelect($event, item)
      },
    }
  })
})
</script>

<style scoped></style>
