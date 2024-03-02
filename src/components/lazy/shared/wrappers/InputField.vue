<template>
  <div class="p-invalid">
    <h5 v-if="label" class="label">{{ label }}</h5>
    <div v-else-if="align" class="h-8"></div>
    <div class=" " :class="shrinkWrap ? '' : 'my-2 sm:min-h-12'">
      <component
        :is="pComponent"
        v-if="child"
        v-model="value"
        v-bind="{ ...$attrs, ...$lodash.omit(child, 'type') }"
        :class="[child.class, { 'p-invalid': errors && errors.length }]"
      ></component>
      <div
        v-else
        :class="{ invalid: errors && errors.length, 'has-leading': $slots.leading, 'has-trailing': $slots.trailing }"
        class="relative flex items-center"
      >
        <div class="icon start-4">
          <slot name="leading"></slot>
        </div>
        <slot></slot>

        <div class="icon end-4 relative max-h-10">
          <slot name="trailing"></slot>
        </div>
      </div>
      <div v-if="errors && errors.length" class="ps-4">
        <p v-for="error of errors" :key="error.$uid" class="text-error text-start sm:text-xs text-10px">
          {{ error.$message }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { ErrorObject } from '@vuelidate/core'
import type { PropType } from 'vue'

interface IPrimeComponent {
  type: string
  label?: string
  align?: boolean
  placeholder?: string
  class?: string
  init?: any
}
const PRIME_PREFIX = 'p-'

export default defineComponent({
  props: {
    label: {
      type: String,
      default: undefined,
    },
    align: {
      type: Boolean,
      default: false,
    },
    errors: {
      type: Array as PropType<Array<ErrorObject>>,
      default: undefined,
    },
    child: {
      type: Object as PropType<IPrimeComponent>,
      default: undefined,
    },
    shrinkWrap: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['input'],
  setup() {
    return {
      prefix: PRIME_PREFIX,
    }
  },
  data() {
    return {
      value: this.child?.init,
    }
  },
  computed: {
    hasIcons() {
      return !!(this.$slots.leading || this.$slots.trailing)
    },
    pComponent() {
      return this.child ? this.prefix + this.child.type : undefined
    },
  },
  watch: {
    value(newValue) {
      this.$emit('input', newValue)
    },
  },
})
</script>

<style scoped lang="scss">
.label {
  --at-apply: 'sm:h-8 my-auto sm:font-semibold sm:text-xl text-xs sm:ps-4 ps-8';
}
:deep(.p-component) {
  --at-apply: 'w-full';
}
.invalid {
  :deep(.p-component) {
    --at-apply: 'border-error';
  }
}
:deep(.p-inputtext) {
  --at-apply: 'ps-4';
}

.has-leading {
  :deep(.p-inputtext) {
    --at-apply: 'sm:ps-14 ps-10';
  }
}
.has-trailing {
  :deep(.p-inputtext) {
    --at-apply: 'pe-14';
  }
}
.icon {
  --at-apply: 'absolute  z-2 h-full flex items-center inset-y-0 ';
}
</style>
