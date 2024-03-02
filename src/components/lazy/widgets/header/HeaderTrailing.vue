<template>
  <div class="flex flex-none items-center" :class="md ? 'gap-x-2' : 'gap-x-4'">
    <component
      class="relative"
      v-for="(action, index) in actions"
      :key="index"
      :to="action.to"
      :is="action.to ? 'router-link' : 'div'"
    >
      <p-button
        v-if="action.isVisible"
        class="btn-flat-primary text-2xl"
        :class="action.class"
        :icon="action.icon"
        @click="action.onClick ? action.onClick($event) : null"
      />
      <div
        v-if="totalNewNotifications > 0 && action.onClick"
        class="absolute bg-error text-10px text-white rounded-full w-4 h-4 top-0 right-0 flex items-center justify-center"
      >
        {{ totalNewNotifications > 99 ? '99+' : totalNewNotifications }}
      </div>
    </component>
    <POverlayPanel id="overlay_panel" ref="op" append-to="body" style="width: 363px">
      <NotificationsList id="list" class="max-h-[500px] overflow-auto" :is-small="true" />
    </POverlayPanel>
    <ProfileSettingsDropdown />
  </div>
</template>

<script setup lang="ts">
import { useNotificationsStore } from '@/data/notifications/notifications.store'
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
const router = useRouter()
const route = useRoute()
const $notifications = useNotificationsStore()
const op = ref()
const actions = computed(() => {
  return [
    {
      to: '/search',
      icon: 'i-figma:search',
      isVisible: md.value && !route.path.startsWith('/search'),
    },
    {
      to: md.value ? '/notifications' : null,
      icon: 'i-figma:bell',
      isVisible: true,
      onClick: ($event) => {
        if (!md.value) op.value.toggle($event)
      },
    },
    {
      to: '/chat',
      icon: 'i-figma:chat',
      isVisible: md.value,
    },
  ]
})

const md = useBreakpoints(breakpointsTailwind).smaller('md')
const totalNewNotifications = computed(() => $notifications.totalNewNotifications)
const handleSwMessages = () => {
  $notifications.totalNewNotifications += 1
}
onMounted(async () => {
  await $notifications.getNotifications({ state: 'NEW' })
  const channel = new window.BroadcastChannel('sw-messages')
  channel.addEventListener('message', handleSwMessages)
})

onUnmounted(() => {
  const channel = new window.BroadcastChannel('sw-messages')
  channel.removeEventListener('message', handleSwMessages)
})
</script>
<style scoped lang="scss">
.border-bottom {
  border-bottom: 1px solid rgb(var(--bg-border-light));
}

.icon-button {
  --at-apply: 'btn-flat-primary text-2xl text-primary overflow-visible';
  .p-button {
    overflow: visible !important;
    :deep(.p-badge) {
      --at-apply: 'end-2 top-2';
    }
  }
}
</style>
