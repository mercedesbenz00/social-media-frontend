<template>
  <div class="text-sm gap-y-4 flex flex-col" :class="options.center ? ' items-center' : 'w-full items-start'">
    <PButton
      v-if="options.onNext"
      icon-pos="right"
      :icon="'ltr:i-heroicons-solid:arrow-narrow-right rtl:i-heroicons-solid:arrow-narrow-left  text-xl'"
      class="text-sm font-bold btn-next"
      :class="data.center ? 'w-auto' : 'w-full'"
      v-bind="{ ...data.nextOptions }"
      @click="handleClick('next')"
      :loading="loading"
    ></PButton>
    <PButton
      v-if="options.onPrevious"
      :icon="'ltr:i-heroicons-solid:arrow-narrow-left rtl:i-heroicons-solid:arrow-narrow-right text-xl '"
      class="text-sm font-bold btn-flat-primary btn-back"
      v-bind="{ ...data.previousOptions }"
      @click="handleClick('previous')"
    ></PButton>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
const router = useRouter()
const { t } = useI18n()

interface Options {
  center?: boolean
  onNext?: string | (() => any)
  onPrevious?: string | (() => any)
  nextOptions?: {
    label?: string
    icon?: string
    class?: string
    disabled?: boolean
  }
  previousOptions?: {
    label?: string
    icon?: string
    class?: string
    disabled?: boolean
  }
}
const defaultOptions = computed(() => ({
  first: false,
  onNext: undefined,
  onPrevious: undefined,
  nextOptions: {
    label: t('setup.next'),
  },
  previousOptions: {
    label: t('setup.back'),
  },
}))
const props = defineProps({
  options: {
    type: Object as PropType<Options>,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const data = computed<Options>(() => {
  return useLodash().defaultsDeep(props.options, defaultOptions.value)
}, {})

const handleClick = (type: 'next' | 'previous') => {
  const _ = useLodash()
  const { onNext, onPrevious } = data.value
  if (type === 'next') {
    if (_.isString(onNext)) {
      router.push(onNext)
    } else if (_.isFunction(onNext)) {
      onNext()
    }
  } else {
    if (_.isString(onPrevious)) {
      router.push(onPrevious)
    } else if (_.isFunction(onPrevious)) {
      onPrevious()
    }
  }
}
</script>

<style lang="scss" scoped></style>
