<template>
  <div class="sm:text-sm text-xs">
    {{ props.description }}
    <RouterLink :to="props.to">
      <span :class="props.bold ? 'font-bold text-info-dark' : ''">{{ props.actionText }}</span>
    </RouterLink>
  </div>
</template>

<script setup>
const props = defineProps({
  description: {
    type: String,
    default: undefined,
  },
  actionText: {
    type: String,
    default: undefined,
  },
  to: {
    type: String,
    default: undefined,
  },
  bold: {
    type: Boolean,
    default: undefined,
  },
})
</script>

<style scoped></style>
