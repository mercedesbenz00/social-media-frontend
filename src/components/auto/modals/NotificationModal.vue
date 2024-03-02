<template>
  <BaseRenderlessModal title="">
    <div class="flex flex-col items-center justify-center p-4">
      <div v-if="meta.type" class="mb-6">
        <div :class="iconClass" class="w-20 h-20"></div>
      </div>
      <div class="flex flex-col items-center justify-center space-y-4">
        <div class="text-lg font-bold">{{ meta.title }}</div>
        <div class="text-sm" v-if="meta.subtitle">{{ meta.subtitle }}</div>
        <div class="text-sm text-link cursor-pointer" v-if="meta.action" @click="go">{{ meta.action.label }}</div>
      </div>
    </div>
  </BaseRenderlessModal>
</template>
<script setup lang="ts">
import type { PropType } from 'vue'
import type { INotificationMeta } from '@/data/main.model'
const props = defineProps({
  meta: {
    type: Object as PropType<INotificationMeta>,
    required: true,
  },
})
const emits = defineEmits(['close'])
const router = useRouter()
const iconClass = computed(() => {
  switch (props.meta.type) {
    case 'pending':
      return 'i-figma:clock'
    case 'success':
      return 'i-figma:check-circle'
    case 'warn':
      return 'i-figma:alert-triangle'
  }
})
const go = () => {
  if (props.meta.action?.to) router.push({ path: props.meta.action?.to, query: { pending: 'true' } })
  emits('close')
}
</script>
