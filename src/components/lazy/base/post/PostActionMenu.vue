<template>
  <div class="relative">
    <PButton
      icon="i-figma:more-horizontal"
      type="button"
      @click.prevent.stop="toggle"
      :aria-controls="uuid"
      aria-haspopup="true"
      class="btn-flat-primary text-xl text-primary"
      :loading="loading"
    >
    </PButton>

    <PopupMenu :items="items" ref="pTiredMenu"></PopupMenu>
  </div>
</template>

<script setup lang="ts">
import type { ICollection, IPost } from '@/data/posts/posts.interface'
import type { PropType } from 'vue'
import { PostStates } from '@/data/posts/posts.interface'
import { useAuthStore } from '@/data/auth/auth.store'
import { useMainStore } from '@/data/main.store'
import { usePersonsStore } from '@/data/persons/persons.store'
import { usePostsStore } from '@/data/posts/posts.store'
import { useGroupsStore } from '@/data/groups/groups.store'
import { useChatStore } from '@/data/chat/chat.store'
import type { IPerson } from '@/data/persons/persons.interface'
import PostCreateModal from '@/components/lazy/base/post/create/PostCreateModal.vue'
import Complaints from '@/components/auto/modals/Complaints.vue'
import { COMPLAINT_TYPE } from '@/data/main.model'
import { v4 } from 'uuid'
import type { IPopupMenuItem } from '@/data/main.interface'
import { find } from 'lodash'
const uuid = v4()

const { t } = useI18n()
const $auth = useAuthStore()
const $person = usePersonsStore()
const $main = useMainStore()
const $chat = useChatStore()
const $posts = usePostsStore()
const $post = usePostsStore()
const $group = useGroupsStore()
const items = ref<IPopupMenuItem[]>([])
const route = useRoute()
const props = defineProps({
  post: {
    type: Object as PropType<IPost>,
    required: true,
  },
  permission: {
    type: String as PropType<'ALL' | 'WITH_APPROVAL' | 'ADMIN_ONLY'>,
    required: true,
  },
  id: {
    type: String,
  },
})

const loading = ref<boolean>(false)
const pTiredMenu = ref()
async function toggle(e) {
  try {
    loading.value = true
    await Promise.all([fetchSettings(), fetchIsSavedToCollection()])
    items.value = postDropdownItems()
  } finally {
    loading.value = false
    pTiredMenu.value?.toggle(e)
  }
}
function hide() {
  pTiredMenu.value?.hide()
}
const fetchIsSavedToCollection = async () => {
  try {
    const response = await $posts.getPostInCollection(props.post.id)
    if (response) collection.value = response
  } catch (error) {
    collection.value = null
  }
}
const fetchSettings = async () => {
  const [postSettings, groupSettings, followerSettings] = await Promise.all([
    $posts.getPostsNotificationSettings({ postIds: [props.post.id] }),
    $group.getGroupsNotificationSettings({ groupIds: [props.post.userGroupId] }),
    $person.getFollowersNotificationSettings({ followerIds: [props.post.authorId] }),
  ])
  postNotificationSettings.value = postSettings[0]?.isMuted ?? false
  groupNotificationSettings.value = groupSettings[0]?.isMuted ?? false
  followerNotificationSettings.value = followerSettings[0]?.isMuted ?? false
}
const collection = ref<null | any>(null)
const isPending = computed(() => props.post.state === PostStates.WAITING_TO_BE_PUBLISHED)
const isPublished = computed(() => props.post.state === PostStates.PUBLISHED)
const isFollower = computed(() => $auth.following.find((i) => i.subscribedTo.id === props.post.authorId))
const isMyPost = computed(() => props.post.authorId == $auth.user?.id)
const isAdmin = computed(() => $group.isAdminByGroupId(props.post.userGroupId))
const isModerator = computed(() => $group.isModeratorbyGroupId(props.post.userGroupId))
const followerNotificationSettings = ref<boolean>(false)
const groupNotificationSettings = ref<boolean>(false)
const postNotificationSettings = ref<boolean>(false)
const emit = defineEmits(['refresh', 'update', 'remove'])
const PostActions = computed(() => {
  return {
    MUTE_PERSON: {
      title: followerNotificationSettings.value ? t('post.unmute_person') : t('post.mute_person'),
      icon: 'i-figma:bell',
      action: () => {
        $person.setFollowerNotificationSettingsById(props.post.authorId, !followerNotificationSettings.value)
        hide()
      },
    } as IPopupMenuItem,
    MUTE_GROUP: {
      title: groupNotificationSettings.value ? t('post.unmute_group') : t('post.mute_group'),
      icon: 'i-figma:users',
      action: () => {
        $group.setGroupNotificationSettings(props.post.userGroupId, !groupNotificationSettings.value)
        hide()
      },
    } as IPopupMenuItem,
    MUTE_POST: {
      title: postNotificationSettings.value ? t('post.unmute_post') : t('post.mute_post'),
      icon: 'i-figma:image',
      action: () => {
        $posts.setPostNotificationSettings(props.post.id, !postNotificationSettings.value)
        hide()
      },
    } as IPopupMenuItem,
    EDIT: {
      title: t('post.edit'),
      icon: 'i-figma:edit',
      action: () => {
        onPostEdit()
        hide()
      },
    } as IPopupMenuItem,
    REMOVE: {
      title: t('post.remove'),
      icon: 'i-figma:trash',
      action: () => {
        const confirm = {
          header: t('post.remove_confirm_header'),
          message: t('post.remove_confirm_message'),
        }
        deleteHandler(confirm)
        hide()
      },
    } as IPopupMenuItem,
    ADD_TO_COLLECTION: {
      title: t('post.add_post_to_a_collection'),
      action: () => {
        onGroupCollection()
        hide()
      },
    } as IPopupMenuItem,
    APPROVE: {
      title: t('post.approve'),
      action: () => {
        const confirm = {
          header: t('post.approve_confirm_header'),
          message: t('post.approve_confirm_message'),
        }
        updateHandler(confirm, { state: PostStates.PUBLISHED })
        hide()
      },
    } as IPopupMenuItem,
    REJECT: {
      title: t('post.reject'),
      action: () => {
        const confirm = {
          header: t('post.reject_confirm_header'),
          message: t('post.reject_confirm_message'),
        }
        updateHandler(confirm, { state: PostStates.REJECTED })
        hide()
      },
    } as IPopupMenuItem,
    ALLOW_DISALLOW_COMMENTS: {
      title: props.post.commentsAllowed ? t('post.turn_off_comments') : t('post.turn_on_comments'),
      icon: props.post.commentsAllowed ? 'i-figma:comment-disabled' : 'i-figma:comment-enabled',
      action: () => {
        const confirm = {
          header: props.post.commentsAllowed
            ? t('post.comments_disallowed_confirm_header')
            : t('post.comments_allowed_confirm_header'),
          message: props.post.commentsAllowed
            ? t('post.comments_disallowed_confirm_message')
            : t('post.comments_allowed_confirm_message'),
        }
        updateHandler(confirm, { commentsAllowed: !props.post.commentsAllowed })
      },
    } as IPopupMenuItem,
    UN_PUBLISH: {
      title: t('post.un_publish'),
      icon: 'i-figma:unpublish',
      action: () => {
        const confirm = {
          header: t('post.un_publish_confirm_header'),
          message: t('post.un_publish_confirm_message'),
        }
        updateHandler(confirm, { state: PostStates.WAITING_TO_BE_PUBLISHED })
        hide()
      },
    } as IPopupMenuItem,
    FOLLOW_UNFOLLOW: {
      title: isFollower.value ? t('post.unfollow_user') : t('post.follow_user'),
      icon: 'i-figma:divide-square',
      action: () => {
        const header = isFollower.value ? t('post.unfollow_user_confirm_header') : t('post.follow_user_confirm_header')

        const message = isFollower.value
          ? t('post.unfollow_user_confirm_message')
          : t('post.follow_user_confirm_message')

        useMainStore().confirm({
          message,
          header,
          acceptLabel: t('acceptLabel'),
          rejectLabel: t('rejectLabel'),
          accept: async () => {
            if (isFollower.value) {
              await $person.unFollowUser(props.post.authorId)
            } else {
              await $person.followUser(props.post.authorId)
            }
          },
          reject: () => {},
        })
      },
    } as IPopupMenuItem,
    BAN_UN_BAN: {
      title: authorIsBanned.value ? t('post.unban_user_from_group') : t('post.ban_user_from_group'),
      action: () => {
        authorIsBanned.value ? onRemoveBan() : onBanConfirm()
        hide()
      },
    } as IPopupMenuItem,
    SEND_MESSAGE: {
      title: t('post.send_message', [user.value?.displayName]),
      icon: 'i-figma:mail',
      action: () => {
        $chat.initRoom(props.post.authorId)
        hide()
      },
    } as IPopupMenuItem,
    POST_COMPLAINT: {
      title: t('post.report_post'),
      icon: 'i-figma:spam bg-error',
      action: () => {
        onOpenComplaints(COMPLAINT_TYPE.POST)
        hide()
      },
    } as IPopupMenuItem,
    PERSON_COMPLAINT: {
      title: t('post.report_person', [user.value?.displayName]),
      icon: 'i-figma:user bg-error',
      action: () => {
        onOpenComplaints(COMPLAINT_TYPE.PERSON)
        hide()
      },
    } as IPopupMenuItem,
    PIN: {
      title: props.post.pinned ? t('post.unpin') : t('post.pin'),
      icon: 'i-figma-thumbtack',
      action: async () => {
        const confirm = {
          header: props.post.pinned ? t('post.unpin_confirm_header') : t('post.pin_confirm_header'),
          message: props.post.pinned ? t('post.unpin_confirm_message') : t('post.pin_confirm_message'),
        }
        updateHandler(confirm, { shouldPin: !props.post.pinned })
        hide()
      },
    },
    COPY_LINK: {
      title: t('post.copy_link'),
      icon: 'i-figma:copy',
      action: () => {
        const href = window.location.origin
        navigator.clipboard.writeText(href + '/posts/' + props.post.id)
        $main.toast({
          type: 'success',
          message: t('toast.success'),
          detail: t('post.link_copied'),
        })
      },
    },
    SAVE_TO_COLLECCTION: {
      title: collection.value ? t('collections.remove_from_collection') : t('collections.add_to_collection'),
      icon: collection.value ? 'i-heroicons-outline:bookmark-slash' : 'i-heroicons-outline:bookmark',
      action: async () => {
        if (collection.value) {
          await $posts.removePostFromCollection(collection.value.id, props.post.id)
          emit('refresh')
        } else {
          const { $vfm } = useGlobals()
          const component = resolveComponent('CollectionsModal')
          $vfm.show({
            component,
            bind: {
              drag: false,
              size: 'small',
              adaptive: false,
              noActions: true,
            },
            on: {
              close: () => {
                $vfm.hideAll()
              },
              save: async (collection: ICollection) => {
                await $posts.saveToCollection(props.post.id, collection)
                $vfm.hideAll()
              },
            },
          })
        }
      },
    },
  }
})
const authorIsBanned = computed(() => {
  return banStatus.value?.content?.length > 0 ?? false
})

const postDropdownItems: () => IPopupMenuItem[] = () => {
  const ACTIONS = PostActions.value
  // admin post actions
  if (isAdmin.value) {
    if (isPending.value) {
      return [ACTIONS.APPROVE, ACTIONS.REJECT, ACTIONS.EDIT, ACTIONS.COPY_LINK]
    }
    if (isPublished.value) {
      return [
        ACTIONS.ALLOW_DISALLOW_COMMENTS,
        ACTIONS.EDIT,
        ACTIONS.REMOVE,
        ACTIONS.UN_PUBLISH,
        ACTIONS.PIN,
        ACTIONS.COPY_LINK,
        ACTIONS.SAVE_TO_COLLECCTION,
      ]
    }
  }
  // moderator post actions
  if (isModerator.value) {
    if (isPending.value) {
      return [ACTIONS.APPROVE, ACTIONS.REJECT, ACTIONS.COPY_LINK]
    }
    if (isPublished.value) {
      return [
        ACTIONS.ALLOW_DISALLOW_COMMENTS,
        ACTIONS.REMOVE,
        ACTIONS.UN_PUBLISH,
        ACTIONS.PIN,
        ACTIONS.COPY_LINK,
        ACTIONS.SAVE_TO_COLLECCTION,
      ]
    }
  }

  //followers
  if (isFollower.value) {
    return [
      ACTIONS.SEND_MESSAGE,
      ACTIONS.FOLLOW_UNFOLLOW,
      ACTIONS.MUTE_PERSON,
      ACTIONS.MUTE_GROUP,
      ACTIONS.MUTE_POST,
      ACTIONS.POST_COMPLAINT,
      ACTIONS.PERSON_COMPLAINT,
      ACTIONS.COPY_LINK,
      ACTIONS.SAVE_TO_COLLECCTION,
    ]
  }
  // my post actions
  if (isMyPost.value) {
    if (isPending.value) return [ACTIONS.ALLOW_DISALLOW_COMMENTS, ACTIONS.EDIT, ACTIONS.REMOVE, ACTIONS.COPY_LINK]
    if (isPublished.value && props.permission === 'ALL')
      return [
        ACTIONS.ALLOW_DISALLOW_COMMENTS,
        ACTIONS.EDIT,
        ACTIONS.REMOVE,
        ACTIONS.COPY_LINK,
        ACTIONS.SAVE_TO_COLLECCTION,
      ]
    return [ACTIONS.ALLOW_DISALLOW_COMMENTS, ACTIONS.COPY_LINK, ACTIONS.SAVE_TO_COLLECCTION]
  }
  // other user post actions

  return [
    ACTIONS.SEND_MESSAGE,
    ACTIONS.FOLLOW_UNFOLLOW,
    ACTIONS.MUTE_GROUP,
    ACTIONS.MUTE_POST,
    ACTIONS.POST_COMPLAINT,
    ACTIONS.PERSON_COMPLAINT,
    ACTIONS.COPY_LINK,
    ACTIONS.SAVE_TO_COLLECCTION,
  ]
}

const user = computed<IPerson>(() => {
  return $person.users[props.post.authorId]
})

// BAN STATUS
const banStatus = ref()

// const getPostUserBan = async () => {
//   const params = {
//     groupIds: props.post.userGroupId,
//     personId: props.post.authorId,
//   }
//   banStatus.value = await $person.getGroupBans(params)
// }
const onRemoveBan = () => {
  const header = t('post.unban_user_confirm_header')
  const message = t('post.unban_user_confirm_message')
  $main.confirm({
    message,
    header,
    acceptLabel: t('acceptLabel'),
    rejectLabel: t('rejectLabel'),
    accept: async () => {
      banStatus.value = await $person.deleteGroupBan(banStatus.value?.content[0]?.id)
    },
    reject: () => {},
  })
}
const onBanConfirm = () => {
  const { $vfm } = useGlobals()
  $vfm.show({
    component: 'PostBanModal',
    bind: {
      drag: false,
      size: 'auto',
      adaptive: false,
      noActions: true,
    },
    on: {
      close: () => {
        $vfm.hideAll()
      },
      confirmed: async (days: number) => {
        const payload = {
          days,
          groupIds: [props.post.userGroupId as number],
          personId: props.post.authorId as number,
          reason: 'ban for ...',
        }
        banStatus.value = { content: await $person.createGroupBan(payload) }
        $vfm.hideAll()
      },
    },
  })
}
const updateHandler = (confirm, data = {}) => {
  if (confirm) {
    const { message, header } = confirm
    $main.confirm({
      message,
      header,
      acceptLabel: t('acceptLabel'),
      rejectLabel: t('rejectLabel'),
      accept: async () => {
        const d = await $post.updatePost({ postId: props.post.id, data })
        emit('update', d)
      },
      reject: () => {},
    })
  }
}
const deleteHandler = (confirm) => {
  if (confirm) {
    const { message, header } = confirm
    $main.confirm({
      message,
      header,
      acceptLabel: t('acceptLabel'),
      rejectLabel: t('rejectLabel'),
      accept: async () => {
        await $post.removePost(props.post.id)
        emit('remove', props.post.id)
      },
      reject: () => {},
    })
  }
}
const onGroupCollection = () => {
  const { $vfm } = useGlobals()
  $vfm.show({
    component: 'GroupPostCollectionModal',
    bind: {
      drag: false,
      size: 'auto',
      adaptive: false,
      noActions: true,
      groupId: props.post.userGroupId,
      postId: props.post.id,
    },
    on: {
      close: () => {
        $vfm.hideAll()
      },
      refresh: async () => {
        $post.refreshPostList()
        emit('refresh')
        $vfm.hideAll()
      },
    },
  })
}
const onPostEdit = () => {
  const { $vfm } = useGlobals()
  $vfm.show({
    component: PostCreateModal,
    bind: {
      post: props.post,
      mode: 'edit',
    },
    on: {
      onSuccess: (v?: IPost) => {
        $vfm.hideAll()
        if (v) emit('update', v)
      },
    },
  })
}
const onOpenComplaints = (complaintType) => {
  const { $vfm } = useGlobals()
  $vfm.show({
    component: Complaints,
    bind: {
      complaintType,
      post: props.post,
      title: complaintType == COMPLAINT_TYPE.POST ? t('post.report_post_title') : t('post.report_post_user_title'),
      size: 'small',
    },
    on: {
      close: () => {
        $vfm.hideAll()
      },
    },
  })
}
</script>
<style lang="scss">
.popup-action-menu-wrapper {
  --at-apply: 'p-0 rounded-lg overflow-hidden mt-2 w-max z-99 absolute top-8 end-0';
  .p-menuitem {
    .item {
      --at-apply: 'flex items-center px-4 py-2 text-left text-text-primary bg-bg-primary-light w-full cursor-pointer hover:bg-primary hover:text-white';
    }
  }
}
</style>
