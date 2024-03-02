<template>
  <slot name="leading"></slot>
  <div class="w-full" v-if="modelValue">
    <div class="relative flex items-center">
      <i class="i-figma:edit absolute left-4 inset-y-0 m-auto"></i>
      <p-input-text
        v-model="newCollection.name"
        class="w-full ps-10"
        :placeholder="t('collections.give_collection_name')"
      />
    </div>
    <p-dropdown
      class="mt-2"
      v-model="newCollection.isPublic"
      :options="accessOptions"
      optionLabel="name"
      optionValue="value"
    >
      <template #value="slotProps">
        <div class="flex items-center">
          <i :class="slotProps.value ? 'i-figma:globe' : 'i-figma:lock'" class="me-1"></i>
          <div>{{ slotProps.value ? t('collections.global') : t('collections.only_me') }}</div>
        </div>
      </template>
      <template #option="slotProps">
        <div class="flex items-center">
          <i :class="slotProps.option.icon" class="me-1"></i>
          <div>{{ slotProps.option.name }}</div>
        </div>
      </template>
    </p-dropdown>
  </div>
  <div class="flex justify-end gap-x-4 items-center" v-if="modelValue">
    <PButton
      v-if="showCancel"
      :disabled="loading"
      class="btn-outlined-primary"
      :label="t('collections.cancel')"
      @click="emits('update:modelValue', false)"
    />
    <PButton
      :loading="loading"
      class="btn-primary"
      :label="t('collections.create')"
      @click="createCollection"
      :disabled="!newCollection.name && !newCollection.name.length > 0"
    />
  </div>
</template>
<script setup lang="ts">
import type { PropType } from 'vue'

const { t } = useI18n()
const loading = ref(false)
const emits = defineEmits(['create', 'update:modelValue'])
const props = defineProps({
  accessOptions: {
    type: Array as PropType<IOptions[]>,
    required: true,
  },
  modelValue: {
    type: Boolean,
    required: false,
    default: true,
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
  showCancel: {
    type: Boolean,
    required: false,
    default: true,
  },
})

interface IOptions {
  name: string
  icon: string
  value: boolean
}

const newCollection = ref({
  name: '',
  isPublic: props.accessOptions[0].value,
})
const createCollection = () => {
  const payload = {
    name: newCollection.value.name,
    isPublic: newCollection.value.isPublic,
  }
  emits('update:modelValue', false)
  emits('create', payload)
}
</script>
