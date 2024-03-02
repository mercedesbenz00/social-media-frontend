<template>
  <div class="mt-8">
    <div>
      <div class="title-and-action mb-4">
        <div class="font-bold text-2xl md:text-xl">
          {{ title }}<span class="font-medium text-sm hidden md:inline" v-if="subtitle">: {{ subtitle }}</span>
        </div>
        <a class="cursor-pointer hidden md:inline" @click="emit('seeAll')">{{ linkText }}</a>
        <PButton class="btn-primary md:!hidden w-50" @click="emit('seeAll')" :label="t('notifications.see_all')" />
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  linkText: {
    type: String,
    default: undefined,
  },
  title: {
    type: String,
  },
  subtitle: {
    type: String,
  },
})
const { t } = useI18n()
const emit = defineEmits(['seeAll'])
</script>

<style lang="scss" scoped>
.title-and-action {
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    font-weight: 700;
    font-size: 18px;
    line-height: 24px;
  }

  a {
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    --at-apply: 'text-info';
  }
}
</style>
