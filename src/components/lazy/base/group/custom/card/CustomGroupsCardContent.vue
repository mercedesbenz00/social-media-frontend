<template>
  <div
    class="grid gap-y-2"
    :class="categories && categories.length > 0 ? 'grid-with-categories' : 'grid-without-categories'"
  >
    <div class="font-bold text-sm name h-10 break-words">
      {{ group.name.length > 40 ? group.name.slice(0, 37) + '...' : group.name }}
    </div>
    <div
      v-if="categories && categories.length > 0 && showCategories"
      class="flex items-center text-xs gap-x-2 me-2 categories"
    >
      <div class="px-2 py-1 bg-primary-light/40 rounded-2xl" v-for="(category, index) in categories" :key="index">
        {{ category }}
      </div>
    </div>
    <div class="flex items-center justify-end members">
      <i class="i-figma:users w-4 h-4 bg-primary me-1"></i>
      <div class="text-xs">{{ group.stats.membersCount }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { IGroup } from '@/data/groups/groups.interface'
import type { PropType } from 'vue'

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
const categories = computed(() =>
  props.group.categories?.map((c) => (c.name.length > 8 ? c.name.slice(0, 5) + '...' : c.name)).splice(0, 2)
)
</script>
<style scoped lang="scss">
.grid-with-categories {
  grid-template-areas:
    'n n'
    'c m';
}
.grid-without-categories {
  grid-template-areas: 'n m';
}
.grid {
  & .name {
    grid-area: n;
  }
  & .categories {
    grid-area: c;
  }
  & .members {
    grid-area: m;
  }
}
</style>
