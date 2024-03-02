<template>
  <span class="p-input-icon-left w-full min-w-60 w-2/3 lg:w-1/3">
    <i :class="$lodash.isEmpty(currentVal) ? 'i-figma:search' : 'i-figma:x'" @click="reset()" />
    <input
      v-model="currentVal"
      :placeholder="$t('sidebar.search')"
      :class="['p-inputtext p-component w-full shadow-sm h-9', { 'p-filled': filled }]"
      @input="onChange"
      @blur="emit('blur')"
      @focus="emit('focus', $event)"
    />
  </span>
</template>

<script lang="ts" setup>
import { debounce } from 'lodash'

const currentVal = ref('')
const prevVal = ref(currentVal.value)

const props = defineProps({
  trim: {
    type: Boolean,
    default: true,
  },
  lowerCase: {
    type: Boolean,
    default: true,
  },
  debounce: {
    type: Number,
    default: 200,
  },
  distinctUntilChanged: {
    type: Boolean,
    default: true,
  },
  minChars: {
    type: Number,
    default: 2,
  },
})

const emit = defineEmits(['query', 'reset', 'update:modelValue', 'focus', 'hide', 'blur'])

defineExpose({ reset })

const filled = computed(() => currentVal.value != null && currentVal.value.toString().length > 0)

const onChange = debounce((e) => {
  const val = e.target.value
  let nV = val
  let pV = prevVal.value
  if (props.lowerCase) {
    nV = nV.toLowerCase()
    pV = pV.toLowerCase()
  }

  if (props.trim) {
    nV = nV.trim()
    pV = pV.trim()
  }

  if (props.distinctUntilChanged) {
    if (pV === nV) return
  }

  if (nV.length < props.minChars) {
    emit('reset')
    return
  }

  prevVal.value = val
  emit('query', nV, e)
}, props.debounce)

function reset() {
  currentVal.value = ''
  prevVal.value = ''
  emit('reset')
}

function hide() {
  reset()
  emit('hide')
}
</script>
