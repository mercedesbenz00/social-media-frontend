<template>
  <div class="flex flex-col gap-y-2 lg:gap-y-4 mt-4 lg:mt-10 items-center justify-center">
    <i class="icon"></i>
    <div class="title">{{ t('collections.empty_state_title') }}</div>
    <PButton :label="t('collections.create')" class="btn-primary" @click="emits('create')" />
  </div>
</template>
<script setup lang="ts">
const { t } = useI18n()
const emits = defineEmits(['create'])
</script>
<style scoped lang="scss">
.icon {
  --at-apply: 'i-figma:interests w-60px h-50px lg:w-[122px] lg:h-[108px] bg-primary-light/25 lg:mb-6';
}
.title {
  --at-apply: 'font-bold text-xl lg:text-4xl';
}
</style>
