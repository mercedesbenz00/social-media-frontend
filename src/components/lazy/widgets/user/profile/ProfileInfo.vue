<template>
  <div class="profile-info items-center">
    <div class="ltr:mr-1 rtl:ml-1 text-primary" :class="icon"></div>
    <div
      class="w-full text-xs text-text-primary/80 flex justify-content-between"
      :class="isRowItem ? 'flex-row-reverse' : 'flex-row'"
    >
      <div class="px-1" :class="isRowItem ? 'text-primary' : 'text-text-primary/80'">
        {{ value }}<span v-if="value === null || value === undefined" class="pi pi-spinner pi-spin"></span>
      </div>
      <div class="flex-1">{{ title }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  title: {
    type: [String],
    default: '',
  },
  value: {
    type: [String, Number],
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  isRowItem: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
})
</script>

<style lang="scss" scoped>
.profile-info {
  --at-apply: 'flex';
}
</style>
