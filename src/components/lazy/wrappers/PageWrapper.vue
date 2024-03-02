<template>
  <div class="md:px-4 h-full w-full max-w-720px">
    <div v-if="title" class="h-28 flex flex-1 justify-between items-center">
      <div>
        <h1 v-if="title && typeof title === 'string'" class="font-bold text-3xl">{{ title }}</h1>
        <div v-else-if="title && $lodash.isArray(title)" class="flex items-center">
          <component
            :is="val.to ? 'RouterLink' : 'div'"
            v-for="(val, i) in title"
            :key="val.title + i"
            :to="val.to"
            class="flex flex-none items-center"
          >
            <span
              v-if="i !== 0"
              class="ltr:i-heroicons-solid:chevron-right rtl:i-heroicons-solid:chevron-left text-2xl mx-2 text-text-primary-light"
            ></span>
            <h3 class="font-bold text-3xl hover:text-primary">{{ val.title }}</h3>
          </component>
        </div>
        <h2 v-if="subtitle">{{ subtitle }}</h2>
      </div>
      <slot name="trailing">
        <!-- <PButton
          v-if="notifications && notifications.length"
          class="bell-btn"
          icon="i-heroicons-outline:bell text-2xl"
          :badge="`${notifications.length}`"
          aria-haspopup="true"
          aria-controls="overlay_menu"
          @click="toggle"
        ></PButton>
        <PMenu id="overlay_menu" ref="menu" :model="notifications" :popup="true"></PMenu> -->
      </slot>
    </div>

    <div class="">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

interface TitleItem {
  title: string
  to?: string
}

defineProps({
  title: {
    type: Object as PropType<string | TitleItem[]>,
    default: undefined,
  },
  subtitle: {
    type: String,
    default: undefined,
  },
  // notifications: {
  //   type: [] as PropType<MenuItem[]>,
  //   default: () => [],
  // },
})
// const menu = ref<any>(null)
const vm = getCurrentInstance()

const menu = computed<any>(() => vm?.refs.menu)

const toggle = (val) => {
  menu.value.toggle(val)
}
defineExpose({
  toggle,
})
</script>

<style lang="scss" scoped>
:deep(.bell-btn) {
  --at-apply: 'btn-flat-primary !rounded-full  !bg-bg-secondary-dark relative overflow-visible';

  .p-badge {
    --at-apply: ' bg-error text-white';
  }
}
</style>
