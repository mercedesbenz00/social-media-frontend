<template>
  <span class="p-input-icon-left w-1/3 min-w-60">
    <i :class="$lodash.isEmpty(data.st) ? 'i-heroicons-solid:search' : 'i-heroicons-solid:x'" @click="data.st = ''" />
    <PInputText v-model="data.st" type="text" :placeholder="$t('sidebar.search')" class="w-full shadow-sm h-9" />
  </span>
</template>

<script setup>
const data = reactive({
  st: '',
})
const emit = defineEmits(['search'])
watch(
  () => data.st,
  (nV) => {
    emit('search', nV)
  }
)
</script>

<style lang="scss" scoped></style>
