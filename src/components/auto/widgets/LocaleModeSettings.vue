<template>
  <section class="locale-mode">
    <div class="flex items-center gap-x-4">
      <input type="radio" id="en" name="language" value="en" v-model="lMode">
      <label :class="textSizeClass" for="en">{{ $t('en') }}</label>
    </div>
    <div class="flex items-center gap-x-4">
      <input type="radio" id="ar" name="language" value="ar" v-model="lMode">
      <label :class="textSizeClass" for="ar">{{ $t('ar') }}</label>
    </div>
    <div class="flex items-center gap-x-4">
      <input type="radio" id="kur" name="language" value="kur" v-model="lMode">
      <label :class="textSizeClass" for="kur">{{ $t('kur') }}</label>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps({
  textSize: {
    type: String,
    validator: (value: string) => ['xs', 'sm'].includes(value),
  },
})

const textSizeClass = computed(() => {
  if (!props.textSize) return 'text-xs'
  if (props.textSize === 'xs') return 'text-xs'
  if (props.textSize === 'sm') return 'text-sm'
})
const { locale } = useI18n({ useScope: 'global' })

const lMode = computed({
  get: () => {
    return locale.value ?? 'en'
  },
  set: (value) => {
    locale.value = value
  },
})
</script>

<style scoped lang="scss">
.locale-mode {
  --at-apply: 'flex flex-col gap-y-4';
  & > div {
    --at-apply: 'flex items-center  cursor-pointer';

    & > {
      p {
        --at-apply: 'text-xs';
      }
    }
  }
}

input {
  @apply w-5 h-5 cursor-pointer accent-primary;
}
</style>
