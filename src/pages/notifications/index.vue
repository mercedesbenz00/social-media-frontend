<template>
  <div class="mx-auto max-w-720px w-full px-4">
    <div class="flex items-center justify-between mb-4 mt-6 ms-4">
      <router-link :to="'/'" class="font-bold text-lg flex items-center">
        <i class="i-figma:arrow-left me-2"></i>
        <div>
          {{ $t('notifications.title') }}
        </div>
      </router-link>
      <PButton
        class="btn-primary text-xs lg:text-base"
        icon="i-figma:check-circle"
        :label="$t('notifications.mark_all')"
        @click="readAll"
        :loading="loading"
      />
    </div>
    <NotificationsList :loading="loading" @is-loading="loading = $event" />
  </div>
</template>
<script setup lang="ts">
import { useNotificationsStore } from '@/data/notifications/notifications.store'
const $notifications = useNotificationsStore()
const loading = ref(false)
const readAll = async () => {
  try {
    loading.value = true
    const ids = $notifications.notifications.map((notification) => notification.id)
    await $notifications.allNotificationsRead(ids)
    $notifications.totalNewNotifications = 0
  } finally {
    loading.value = false
  }
}
</script>
