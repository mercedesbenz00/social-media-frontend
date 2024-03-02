<template>
  <div ref="list" :class="isSmall ? 'p-4' : 'rounded-2xl primary-shadow overflow-hidden'">
    <div v-if="isSmall">
      <div v-if="$notifications.newNotifications.length > 0" ref="listNew">
        <div class="flex justify-between items-center text-sm font-bold mb-5">
          <div>{{ $t('notifications.new') }}</div>
          <router-link to="/notifications">{{ $t('notifications.see_all') }}</router-link>
        </div>
        <PDivider class="!m-0" />
        <NotificationItem
          v-for="(notification, index) in $notifications.newNotifications"
          :notification="notification"
          :key="index"
          :is-small="isSmall"
        />
      </div>
      <div v-if="$notifications.oldNotifications.length > 0" ref="listOld">
        <div class="flex justify-between items-center text-sm font-bold mt-4 mb-5">
          <div>{{ $t('notifications.read') }}</div>
        </div>
        <PDivider class="!m-0" />
        <NotificationItem
          v-for="(notification, index) in $notifications.oldNotifications"
          :notification="notification"
          :key="index"
          :is-small="isSmall"
        />
      </div>
      <div
        v-if="!loading && $notifications.newNotifications.length == 0 && $notifications.oldNotifications.length == 0"
        :class="isSmall ? '' : 'p-4'"
      >
        {{ $t('notifications.list_is_empty') }}
      </div>
    </div>
    <div v-else-if="$notifications.notifications.length > 0">
      <NotificationItem
        v-for="(notification, index) in $notifications.notifications"
        :notification="notification"
        :key="index"
        :is-small="isSmall"
      />
    </div>
    <div v-else-if="!loading" :class="isSmall ? '' : 'p-4'">{{ $t('notifications.list_is_empty') }}</div>
    <NotificationSkeleton :class="!props.isSmall ? 'm-4' : ''" v-if="loading" />
  </div>
</template>
<script lang="ts" setup>
import { useNotificationsStore } from '@/data/notifications/notifications.store'

const props = defineProps({
  isSmall: {
    type: Boolean,
    required: false,
    default: false,
  },
})
const $notifications = useNotificationsStore()
const loading = computed(() => $notifications.loading)
const page = ref(0)
const pageNew = ref(0)
const pageOld = ref(0)
const list = ref<HTMLDivElement>()
const listNew = ref<HTMLDivElement>()
const listOld = ref<HTMLDivElement>()
const loadMore = async (params = {}) => {
  if (!loading.value) {
    await $notifications.getNotifications(params)
  }
}
const handleScroll = () => {
  if (list.value) {
    if (props.isSmall) {
      if (
        listNew.value &&
        list.value.scrollTop + 500 >= listNew.value.clientHeight &&
        $notifications.totalNewNotifications > $notifications.newNotifications.length &&
        !loading.value
      ) {
        pageNew.value++
        loadMore({
          page: pageNew.value,
          state: 'NEW',
        })
      } else if (
        !loading.value &&
        $notifications.totalNotifications >
          $notifications.totalNewNotifications + $notifications.oldNotifications.length
      ) {
        pageOld.value++
        loadMore({
          page: pageOld.value,
          state: 'READ',
        })
      }
    } else {
      if (
        list.value.getBoundingClientRect().bottom <= window.innerHeight + 100 &&
        $notifications.totalNotifications > $notifications.notifications.length &&
        !loading.value
      ) {
        page.value++
        loadMore({
          page: page.value,
        })
      }
    }
  }
}

const markAllNewRead = async () => {
  const ids = $notifications.newNotifications.map((notification) => notification.id)
  await $notifications.allNotificationsRead(ids)
  $notifications.totalNewNotifications = 0
}
const getNotifications = async () => {
  if (props.isSmall) {
    const view = document.querySelector('#list')
    view?.addEventListener('scroll', handleScroll)
    if ($notifications.newNotifications.length == 0)
      await $notifications.getNotifications({ state: 'NEW', page: pageNew.value })
    await $notifications.getNotifications({ state: 'READ', page: pageOld.value })
  } else {
    const view = document.querySelector('.router-view')
    view?.addEventListener('scroll', handleScroll)
    $notifications.notifications = []
    await $notifications.getNotifications({ page: page.value })
  }
  markAllNewRead()
}

onMounted(getNotifications)

onUnmounted(async () => {
  let view
  if (props.isSmall) {
    view = document.querySelector('#list')
    await markAllNewRead()
    $notifications.newNotifications = []
    $notifications.oldNotifications = []
  } else {
    view = document.querySelector('.router-view')
    $notifications.notifications = []
  }
  view?.removeEventListener('scroll', handleScroll)
})
</script>
