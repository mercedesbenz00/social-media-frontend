<template>
  <div
    @click="handleClick"
    class="grid-wrapper items-center text-sm cursor-pointer transition-250 easy-out"
    :class="[
      { 'bg-primary-light/30': notification.state == 'NEW' && !isSmall },
      { 'p-6 hover:bg-primary-light/35': !isSmall },
      { isSmall: isSmall },
    ]"
  >
    <Avatar :src="avatar" class="avatar" />
    <div v-html="content" class="content"></div>
    <div class="time">
      {{ moment(new Date(notification.createdDate), 'YYYYMMDD').locale(locale).fromNow() }}
    </div>
    <NotificationActions
      v-if="showButtons"
      @hide="showButtons = false"
      :notification="notification"
      :isSmall="isSmall"
      class="buttons"
    />
    <NotificationPopup
      class="popup"
      v-if="notification.metadata.routeTo || (notification.metadata.routeTo == 'PERSON' && isFollowing)"
      :route-to="notification.metadata.routeTo"
      :post-id="Number(notification.metadata.postId)"
      :author-id="notification.eventAuthor.id"
      :group-id="notification.metadata.groupId"
    />
    <div v-if="notification.state === 'NEW'" class="bg-primary min-w-3 min-h-3 w-3 h-3 rounded-full dot"></div>
  </div>
</template>
<script lang="ts" setup>
import type { INotification } from '@/data/notifications/notifications.interface'
import type { PropType } from 'vue'
import moment from 'moment-with-locales-es6'
import type { RouteParams } from 'vue-router'
import { useNotificationsStore } from '@/data/notifications/notifications.store'
import _ from 'lodash'
import { usePersonsStore } from '@/data/persons/persons.store'
const { locale } = useI18n()
const router = useRouter()
const route = useRoute()
const $notifications = useNotificationsStore()
const $persons = usePersonsStore()

const showButtons = ref(true)
const props = defineProps({
  notification: {
    type: Object as PropType<INotification>,
    required: true,
  },
  isSmall: {
    type: Boolean,
    required: false,
    default: false,
  },
})
const isFollowing = computed(() => $persons.isFollowing(props.notification.eventAuthor.id))
const link = computed(() => {
  const meta = props.notification.metadata
  switch (props.notification.metadata.routeTo) {
    case 'POST':
      return '/posts/' + _.get(meta, 'postId', '0')
    case 'POST_COMMENT':
      if (props.notification.metadata.replyUuid) query.value = { reply: _.get(meta, 'replyUuid', '0') }
      query.value = { ...query.value, ...{ comment: _.get(meta, 'commentUuid', '0') } }
      return '/posts/' + _.get(meta, 'postId', '0')
    case 'STORY':
      return ''
    case 'GROUP':
      return '/groups/' + _.get(meta, 'groupId', '0')
    case 'PERSON':
      return '/profile/' + _.get(props.notification.eventAuthor, 'id', '0')
    default:
      return ''
  }
})
const query = ref({} as RouteParams)
const avatar = computed(() => props.notification.eventAuthor?.avatar?.path ?? null)
const content = computed(() => {
  return props.notification.body
    .replace('#authorName', `<b>${_.get(props.notification.eventAuthor, 'displayName', '')}</b>`)
    .replace('#invitingUser', `<b>${_.get(props.notification.eventAuthor, 'displayName', '')}</b>`)
    .replace('#follower', `<b>${_.get(props.notification.eventAuthor, 'displayName', '')}</b>`)
    .replace('#groupName', `<b>${_.get(props.notification.metadata, 'groupName', '')}</b>`)
    .replace('#postText', `<b>${_.get(props.notification.metadata, 'postText', '')}</b>`)
    .replace('#commentText', `<b>${_.get(props.notification.metadata, 'commentText', '')}</b>`)
})
const handleClick = async () => {
  if (props.notification.state == 'NEW') {
    await $notifications.updateNotifications([props.notification.id], 'READ')
    $notifications.totalNewNotifications -= 1
  }
  if (route.fullPath == link.value) router.go(0)
  else router.push({ path: link.value, query: query.value, replace: true })
}
</script>
<style scoped lang="scss">
.grid-wrapper {
  --at-apply: 'grid gap-2';
  grid-template-columns: 48px 1fr 120px 40px 24px;
  grid-template-areas:
    'a c t p d'
    'a b t p d';
  .avatar {
    --at-apply: 'w-10 h-10';
    grid-area: a;
  }
  .content {
    --at-apply: 'text-sm'
    grid-area: c;
  }
  .time {
    --at-apply: 'text-text-secondary-light text-sm';
    grid-area: t;
    justify-self: flex-end;
  }
  .dot {
    grid-area: d;
    align-self: center;
  }
  .buttons {
    grid-area: b;
  }
  .popup {
    grid-area: p;
    align-self: center;
  }

  &.isSmall {
    --at-apply: 'gap-x-2 gap-y-1 pt-2 pb-1';
    align-items: flex-start;
    grid-template-columns: 40px 1fr 40px 24px;
    grid-template-areas:
      'a c p d'
      'a t p d'
      'a b p d';
    border-bottom: 1px solid rgb(var(--bg-border-light));
    .time {
      justify-self: flex-start;
      font-size: 0.625rem;
    }
    .content {
      font-size: 0.625rem;
    }
  }
}
</style>
