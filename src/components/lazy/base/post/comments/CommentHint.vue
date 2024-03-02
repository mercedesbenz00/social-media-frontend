<template>
  <div class="text-xs cursor-pointer" @click="() => emits('onClick')">
    {{ count > 1 ? $t('comments.show_replies_count', { count }, 0) : $t('comments.show_one_reply') }}
  </div>
</template>
<script setup lang="ts">
defineProps({
  count: {
    type: Number,
    required: true,
  },
})
const emits = defineEmits(['onClick'])
</script>
