<template>
  <div
    tabindex="-1"
    ref="content"
    class="dropdownPopup absolute top-full start-0 border border-borderColor rounded-md bg-backgroundColor z-10 w-5"
    @blur="close"
  >
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
const emit = defineEmits(['close'])
const content = ref<HTMLDivElement>()

const close = () => {
  if (content.value) emit('close')
}

onMounted(() => {
  if (content.value) content.value.focus()
})
</script>
<style lang="scss" scoped>
.dropdownPopup {
  --at-apply: 'bg-bg-primary rounded-md border-0';
  box-shadow: 0px 0px 1rem rgba(66, 66, 66, 0.25);
  width: 165px;
  height: auto;
  overflow: hidden;
  outline: none;
}
</style>
