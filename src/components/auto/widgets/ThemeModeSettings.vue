<template>
  <section class="theme-mode">
    <div class="flex items-center gap-x-4">
      <input type="radio" id="light" name="themeMode" value="light" v-model="tMode">
      <label :class="textSizeClass" for="light">{{ $t('settings.light') }}</label>
    </div>
    <div class="flex items-center gap-x-4">
      <input type="radio" id="dark" name="themeMode" value="dark" v-model="tMode">
      <label :class="textSizeClass" for="dark">{{ $t('settings.dark') }}</label>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
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

const { change, mode } = toRefs(useTheme())

const tMode = computed({
  get: () => {
    return mode.value ?? 'light'
  },
  set: (value) => {
    change.value(value)
  },
})
</script>

<style scoped lang="scss">
.theme-mode {
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
