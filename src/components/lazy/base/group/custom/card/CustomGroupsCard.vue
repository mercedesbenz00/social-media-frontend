<template>
  <router-link
    :to="{ path: '/groups/' + group.id }"
    class="flex flex-col rounded-2xl overflow-hidden w-full card-defaults pb-2"
  >
    <custom-groups-card-header :cover="cover" :avatar="group.avatar?.path" />
    <div class="px-4">
      <custom-groups-card-content
        :group="group"
        :show-categories="showCategories"
        @mouseenter="showOp($event, group.id)"
        @mouseleave="hideOp"
      />
      <POverlayPanel ref="op">
        <div class="flex items-center text-xs gap-x-2 p-2">
          <div
            class="px-2 py-1 bg-primary-light/40 rounded-2xl"
            v-for="(category, index) in group.categories"
            :key="index"
          >
            {{ category.name }}
          </div>
        </div>
      </POverlayPanel>
      <PDivider />
      <custom-groups-card-actions :group="group" />
    </div>
  </router-link>
</template>
<script setup lang="ts">
import type { IGroup } from '@/data/groups/groups.interface'
import type { PropType } from 'vue'
import _ from 'lodash'

const props = defineProps({
  group: {
    type: Object as PropType<IGroup>,
    required: true,
  },
  showCategories: {
    type: Boolean,
    required: false,
    default: true,
  },
})
const lastShowed = ref(0)
const op = ref()
const showOp = ($event: any, current: number) => {
  op.value.show($event)
}
const hideOp = ($event) => {
  if (op.value) op.value.hide($event)
}
const cover = computed(() => props.group.cover?.path ?? null)
</script>
