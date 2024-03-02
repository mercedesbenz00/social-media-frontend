<template>
  <PToast position="bottom-left">
    <template #message="slotProps">
      <div class="flex items-start me-auto">
        <div class="flex items-center justify-center bg-primary-light/20 rounded-2xl p-3">
          <i class="w-10 h-10" :class="getClass(slotProps.message.severity, slotProps.message.additionalType)"></i>
        </div>
        <div class="mx-4 flex-1">
          <div class="font-bold text-sm mb-2">{{ slotProps.message.summary }}</div>
          <div class="text-sm">{{ slotProps.message.detail }}</div>
          <div v-if="slotProps.message.retryFunc" class="mt-2">
            <PButton class="bg-primary" :label="t('toast.retry')" @click="slotProps.message.retryFunc" />
          </div>
        </div>
      </div>
    </template>
  </PToast>
</template>
<script setup lang="ts">
import { useMainStore } from '@/data/main.store'
const { t } = useI18n()
const $main = useMainStore()
const router = useRouter()
const getClass = (severity: string, additionalType?: 'wifi' | 'member' | 'message' | 'comment') => {
  const iconMap = {
    wifi: 'i-figma:wifi-off',
    member: 'i-figma:user-x',
    message: 'i-figma:send',
    comment: 'i-figma:frown',
    success: 'i-figma:check-circle',
    error: 'i-figma:alert-octagon',
    warn: 'i-figma:alert-triangle',
  }

  return iconMap[additionalType || severity] || 'i-figma:info'
}

const showOfflineToast = () => {
  $main.toast({
    type: 'error',
    additionalType: 'wifi',
    message: t('toast.wifi_title_error'),
    detail: t('toast.wifi_desc_error'),
    life: 10000,
    retryFunc: () => {
      router.go(0)
    },
  })
}

onMounted(() => {
  window.addEventListener('offline', showOfflineToast)
})

onUnmounted(() => {
  window.removeEventListener('offline', showOfflineToast)
})
</script>
