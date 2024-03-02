<template>
  <div class="search">
    <div class="relative">
      <p-input-text :placeholder="placeholder" class="ps-10 w-full" :value="modelValue" @input="onInput" />
      <div class="i-figma:search absolute left-4 inset-y-0 m-auto"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { debounce } from 'lodash'

defineProps({
  modelValue: {
    type: String,
    required: false,
    default: '',
  },
  placeholder: {
    type: String,
    required: true,
  },
})
const emits = defineEmits(['update:modelValue'])
const onInput = debounce(($event) => {
  emits('update:modelValue', $event.target.value)
}, 500)
</script>
<style scoped lang="scss">
.search {
  --at-apply: 'border border-t-0 border-bg-purple-light/50 mx-px md:border-none md:card-defaults px-6 py-4';
}
</style>
