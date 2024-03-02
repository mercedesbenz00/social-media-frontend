<template>
  <div>
    <PButton
      v-if="!(type == 'person' && !isFollower)"
      :loading="loading"
      class="btn-flat-primary w-6 h-6"
      icon="i-figma:more-horizontal"
      @click.stop="toggle"
    />
    <PopupMenu :items="actions" ref="popup" />
  </div>
</template>
<script setup lang="ts">
import { useAuthStore } from '@/data/auth/auth.store'
import { useGroupsStore } from '@/data/groups/groups.store'
import type { IPopupMenuItem } from '@/data/main.interface'
import { usePersonsStore } from '@/data/persons/persons.store'
import { usePostsStore } from '@/data/posts/posts.store'
import { set } from '@vueuse/core'

const props = defineProps({
  postId: {
    type: Number,
    required: false,
    default: undefined,
  },
  authorId: {
    type: Number,
    required: false,
    default: undefined,
  },
  groupId: {
    type: Number,
    required: false,
    default: undefined,
  },
  routeTo: {
    type: String,
    required: true,
  },
})
const $posts = usePostsStore()
const $groups = useGroupsStore()
const $persons = usePersonsStore()
const $auth = useAuthStore()
const loading = ref<boolean>(false)
const { t } = useI18n()
const popup = ref()
const toggle = async (event: any) => {
  try {
    loading.value = true
    await fetchSettings()
  } finally {
    loading.value = false
    popup.value.toggle(event)
  }
}
const settings = ref<any>([])
const items = ref<IPopupMenuItem[]>([])
const isFollower = computed(() => $auth.following.find((i) => i.subscribedTo.id === props.authorId))
const type = computed<'group' | 'person' | 'post' | ''>(() => {
  if (props.routeTo == 'POST' && props.groupId) return 'group'
  else if (props.routeTo == 'POST_COMMENT' && props.postId) return 'post'
  else return 'person'
})
const actions = computed(() => {
  if (type.value == 'post') {
    return [
      {
        title: settings.value ? t('post.unmute_post') : t('post.mute_post'),
        icon: 'i-figma:image',
        action: () => {
          if (props.postId) $posts.setPostNotificationSettings(props.postId, !settings.value)
        },
      },
    ]
  }
  if (type.value == 'person')
    return [
      {
        title: settings.value ? t('post.unmute_person') : t('post.mute_person'),
        icon: 'i-figma:bell',
        action: () => {
          if (props.authorId) $persons.setFollowerNotificationSettingsById(props.authorId, !settings.value)
        },
      },
    ]
  if (type.value == 'group')
    return [
      {
        title: settings.value ? t('post.unmute_group') : t('post.mute_group'),
        icon: 'i-figma:users',
        action: () => {
          if (props.groupId) $groups.setGroupNotificationSettings(props.groupId, !settings.value)
        },
      },
    ]
})
const fetchSettings = async () => {
  if (type.value == 'post') settings.value = await $posts.getPostNotificationSettingsById(props.postId as number)
  if (type.value == 'person')
    settings.value = await $persons.getFollowingNotificationSettingsById(props.authorId as number)
  if (type.value == 'group') settings.value = await $groups.getGroupNotificationSettingsById(props.groupId as number)
}
</script>
