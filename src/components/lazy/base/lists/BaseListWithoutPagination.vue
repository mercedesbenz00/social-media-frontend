<template>
  <div>
    <div class="base-list">
      <Loading v-if="props.loading || !data" class="p-8" />
      <template v-else>
        <div v-for="(item, index) in data.content" :key="keyGenerator(item, index)" class="item">
          <GroupListItem
            v-if="keyGenerator(item, index).startsWith('group') && !md"
            class="cursor-pointer p-3"
            @click="goToDetail(item)"
            v-bind="props.adapter(item)"
          >
            <template #button>
              <slot name="action" :item="item"></slot>
            </template>
          </GroupListItem>
          <UserListItem v-else class="cursor-pointer p-3" @click="goToDetail(item)" v-bind="props.adapter(item)">
            <template #button>
              <slot name="action" :item="item"></slot>
            </template>
          </UserListItem>
        </div>
        <div class="card-defaults min-h-16 flex-center-1" v-if="!totalRecords">{{ noDataText }}</div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { IPage } from '@/data/main.model'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
const md = useBreakpoints(breakpointsTailwind).smaller('md')
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object as PropType<IPage<any>>,
  },
  noDataText: {
    type: String,
    default: 'No Data',
  },
  adapter: {
    type: Function as PropType<(any) => { displayText?: string; assiveText?: string; avatar?: string }>,
    required: true,
  },
  goToDetail: {
    type: Function as PropType<any>,
    required: true,
  },
  keyGenerator: {
    type: Function as PropType<any>,
    default: (_, i) => i,
  },
})

const totalRecords = computed(() => props.data?.totalElements ?? 0)
</script>

<style lang="scss" scoped>
.base-list {
  --at-apply: 'card-defaults';
  .item {
    --at-apply: 'border-b-1 border-gray-200';
  }
}

.pagination {
  --at-apply: 'rounded-xl p-0 mt-4 primary-shadow';
}
</style>
