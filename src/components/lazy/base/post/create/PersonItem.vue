<template>
  <div class="flex items-center">
    <Avatar :src="person.avatar?.path" />
    <div class="ms-2">{{ person.displayName }}</div>
  </div>
</template>
<script setup lang="ts">
import type { IPerson } from '@/data/persons/persons.interface'
import type { PropType } from 'vue'

const props = defineProps({
  person: {
    type: Object as PropType<IPerson>,
    required: true,
  },
})
</script>
