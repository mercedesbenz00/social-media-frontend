<template>
  <OnClickOutside @trigger="hide">
    <POverlayPanel @click.prevent.self ref="overlay">
      <PMenu :model="items" class="popup-menu-wrapper">
        <template #item="{ item }">
          <a class="item" :class="item.class" @click.stop.prevent="item.action">
            <div v-if="item.icon" class="me-2 w-6 h-6" :class="`${item.icon}`"></div>
            <div>{{ $t(item.title) }}</div>
          </a>
        </template>
      </PMenu>
    </POverlayPanel>
  </OnClickOutside>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { IPopupMenuItem } from '@/data/main.interface'
import { OnClickOutside } from '@vueuse/components'
defineProps({
  items: {
    type: Array as PropType<IPopupMenuItem[]>,
    required: true,
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
})
const overlay = ref()
const hide = () => {
  overlay.value?.hide()
}

const toggle = (e, t) => {
  const element: HTMLElement = overlay.value?.$parent?.$el
  if (element) {
    const prev = element.previousElementSibling
    overlay.value?.toggle(e, t ?? element ?? prev)
  } else {
    overlay.value?.toggle(e, t)
  }
}

defineExpose({
  toggle,
  hide,
})
</script>

<style lang="scss">
.p-overlaypanel {
  --at-apply: 'mt-4';
}
.popup-menu-wrapper {
  --at-apply: 'p-0 rounded-lg overflow-hidden border-none w-max z-99';
  .p-menuitem {
    .item {
      --at-apply: 'flex items-center px-4 py-2 text-left text-text-primary bg-bg-primary-light w-full cursor-pointer hover:bg-primary hover:text-white';
    }
  }
}
</style>
