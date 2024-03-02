<template>
  <div :id="id.toString()">
    <div class="font-bold text-lg mb-3">{{ section.title }}</div>
    <div class="text-xs" v-if="section.subtitle" v-html="section.subtitle"></div>
    <div class="text-xs">
      <div
        class="flex space-x-2 px-6 -mx-6 py-4"
        v-for="(item, index) in section.list"
        :key="index"
        :class="index % 2 !== 0 ? 'bg-secondary/1' : ''"
      >
        <div class="w-1/3 italic">{{ item.title }}</div>
        <ul class="space-y-4 w-2/3 ps-6">
          <li class="list-disc" v-for="(i, j) in item.items" :key="j" v-html="i"></li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  section: {
    type: Object as PropType<any>,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
})
</script>
<style scoped>
:deep(ul) {
  --at-apply: 'ps-4';
}
:deep(li) {
  --at-apply: 'list-disc';
}
</style>
