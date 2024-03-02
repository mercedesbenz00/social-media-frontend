<template>
  <div class="grid-container">
    <group-small
      v-for="(group, index) in groups"
      :disable-routing="true"
      :key="index"
      :group="group"
      @update="emits('refresh')"
      :onboarding="onboarding"
    />
  </div>
</template>
<script setup lang="ts">
import type { IGroup } from '@/data/groups/groups.interface'
import type { PropType } from 'vue'

defineProps({
  type: {
    type: String,
    required: false,
    default: undefined,
  },
  onboarding: {
    type: Boolean,
    required: false,
    default: undefined,
  },
  groups: {
    type: Array as PropType<IGroup[]>,
    required: false,
  },
})

const emits = defineEmits(['refresh'])
</script>
<style scoped lang="scss">
:deep(.group-card) {
  --at-apply: '!min-w-0';
}
.box {
  &::before {
    content: '';
    --at-apply: 'absolute w-full h-8 bg-gradient-to-b from-white to-transparent top-0 z-10';
  }
}

.grid-container {
  --at-apply: 'grid grid-cols-3 gap-4 max-h-[406px] overflow-scroll overflow-x-hidden';
}

@media (max-width: 575px) {
  .grid-container {
    --at-apply: 'flex flex-col';
  }
}
</style>
