<template>
  <VueFinalModal
    v-bind="$attrs"
    ref="modal"
    :drag="drag"
    :resize="true"
    :max-width="Infinity"
    :max-height="Infinity"
    :esc-to-close="escToClose"
    classes="modal-container"
    :content-class="'modal-content-' + size"
  >
    <div class="modal-wrapper">
      <div v-if="!noTitle">
        <slot name="title">
          <div class="flex flex-col flex-none items-start" :class="{ 'mb-2': title || subtitle }">
            <div class="modal-title">
              <div>
                <i v-if="icon" :class="icon" class="w-6 h-6 me-2"></i>
                <h2 v-if="title" v-html="title"></h2>
              </div>

              <div>
                <PButton class="btn-flat-primary modal-close" @click="close">
                  <span :class="closeIcon"></span>
                </PButton>
              </div>
            </div>
            <h4 v-if="subtitle" class="modal-subtitle">{{ subtitle }}</h4>
          </div>
        </slot>
      </div>
      <div class="flex flex-1">
        <div class="w-full base-modal">
          <slot>
            <div>MODAL CONTENT</div>
          </slot>
        </div>
      </div>

      <div v-if="!noActions" class="modal-actions">
        <slot name="actions" :close="close"> </slot>
      </div>
    </div>
  </VueFinalModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    noTitle: {
      type: Boolean,
      default: false,
    },
    noActions: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Modal Title',
    },
    subtitle: {
      type: String,
      default: undefined,
    },
    drag: {
      type: Boolean,
      default: false,
    },
    closeIcon: {
      type: String,
      default: 'i-heroicons-solid:x',
    },
    size: {
      type: String,
      default: 'large',
      validator(value: string) {
        return ['small', 'large', 'auto'].includes(value)
      },
    },
    escToClose: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: String,
      required: false,
      default: '',
    },
  },
  emits: ['close'],

  setup() {
    return {}
  },
  methods: {
    close() {
      const m = this.$refs.modal as any
      if (m) {
        m.$emit('update:modelValue', false)
      }
      this.$emit('close')
    },
  },
})
</script>

<style scoped lang="scss">
:deep(.modal-container) {
  --at-apply: 'flex justify-center items-center z-0';
}
:deep(.vfm__content) {
  --at-apply: 'card-defaults';
}
:deep(.modal-content-large) {
  --at-apply: 'md:w-2/3 min-h-[350px] md:max-h-[75%] max-h-[90%] w-11/12 max-w-[90vw] flex flex-col flex-none';
}
:deep(.modal-content-small) {
  min-height: 250px;
  max-height: 50%;
  min-width: 250px;
  max-width: 50%;
  --at-apply: 'flex flex-col flex-none  w-1/2 relative';
}
:deep(.modal-content-auto) {
  width: auto;
  height: auto;
}

:deep(.modal-wrapper) {
  --at-apply: 'w-full h-full relative px-6 py-4 max-h-75vh overflow-auto';

  .modal-close {
    --at-apply: 'flex';
  }
  .modal-title {
    --at-apply: 'flex items-center justify-between text-lg font-bold w-full';
  }
  .modal-subtitle {
    --at-apply: 'text-base font-normal text-text-primary-light';
  }

  .modal-actions {
    --at-apply: 'h-12 flex flex-none items-center justify-evenly';
  }
}

.modal-main {
  --at-apply: 'flex-1 flex-col flex py-4 px-4 text-lg items-center justify-center overflow-y-auto';
}
</style>
