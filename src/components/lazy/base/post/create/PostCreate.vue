<template>
  <div class="post-create">
    <slot name="header"></slot>
    <div class="post-text gap-x-2">
      <div class="w-1/12">
        <Avatar :src="userAvatar" class="!w-full max-w-44px max-h-44px h-auto" />
      </div>
      <PostInputField
        class="w-11/12"
        v-model="postText"
        :files="files"
        @mentioned="handleMentioned"
        @on-preview="linkMeta = $event"
        :preview="linkMeta"
        :placeholder="$t('post.on_mind')"
        :mode="mode"
        :post="post"
      />
    </div>
    <PDivider />
    <div class="flex items-center flex-wrap gap-y-4 sm:gap-y-0">
      <PButton v-if="enableMediaUpload" class="btn-flat-primary text-xs sm:text-base" @click="onUploadMedia">
        <div class="flex items-center">
          <div class="i-figma-image me-1 sm:me-2 w-3 h-3 sm:w-6 sm:h-6"></div>
          <div class="text-xs sm:text-base">{{ $t('upload.media') }}</div>
        </div>
      </PButton>
      <ImageAndVideoUpload
        :class="files?.length > 0 ? 'w-full' : ''"
        ref="imageAndVideoUpload"
        @changed="files = $event"
        :read-only="share"
        :previewImgs="postImages"
        :files-arr="files"
      />
      <PDivider v-if="files.length == 0" layout="vertical" class="vertical-divider" />
      <PButton class="btn-flat-primary text-xs sm:text-base" @click="toggleOp">
        <div class="flex items-center">
          <div v-if="!group" class="i-figma:users me-1 sm:me-2 w-3 h-3 sm:w-6 sm:h-6"></div>
          <Avatar v-else :src="get(group, 'avatar.path')" class="!w-6 !h-6 me-2" />
          <div class="text-xs sm:text-base">{{ get(group, 'name', $t('groups.post')) }}</div>
        </div>
      </PButton>
      <POverlayPanel
        id="overlay_panel"
        ref="op"
        append-to="body"
        style="min-width: 390px; height: 350px; overflow: auto"
      >
        <PostCreateGroups v-if="!rules" @on-click="onSelect($event)" @on-rules="rules = $event" />
        <PostCreateGroupRules v-if="rules" :rules="rules" @close="rules = null" />
      </POverlayPanel>
      <PButton
        icon="i-figma:more-horizontal"
        @click.stop="toggle"
        aria-haspopup="true"
        aria-controls="dropdown_panel"
        class="btn-flat-primary text-2xl text-primary !ms-auto !me-2"
      >
      </PButton>
      <POverlayPanel id="dropdown_panel" ref="dropdown" append-to="body" class="w-180px lg:w-240px">
        <div class="flex items-center justify-between p-2 lg:p-4">
          <div class="text-xs lg:text-sm">{{ commentsAllowed ? t('post.comments_on') : t('post.comments_off') }}</div>
          <PInputSwitch class="input-switch" v-model="commentsAllowed" />
        </div>
      </POverlayPanel>
      <PButton
        class="!ms-auto w-full sm:w-[88px] sm:mt-4"
        @click="createPostOrUpdate"
        :loading="postRequestLoading"
        :label="submitButtonText"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePostsStore } from '@/data/posts/posts.store'
import { useGroupsStore } from '@/data/groups/groups.store'
import type { IGroup } from '@/data/groups/groups.interface'
import type { PropType } from 'vue'
import type { IPost } from '@/data/posts/posts.interface'
import { useAuthStore } from '@/data/auth/auth.store'
import { onClickOutside } from '@vueuse/core'
import type { IMediaFile } from '@/data/main.model'
import { onBeforeRouteLeave } from 'vue-router'
import { useMainStore } from '@/data/main.store'
import { tryCall } from '@/utils/function.utils'
import { get } from 'lodash'
const { t } = useI18n()
const route = useRoute()
const $groups = useGroupsStore()
const props = defineProps({
  mode: {
    type: String as PropType<'create' | 'edit'>,
    default: 'create',
  },
  post: {
    type: Object as PropType<IPost>,
  },
  share: {
    type: Boolean,
    default: false,
  },
  originalId: {
    type: Number,
    default: undefined,
    required: false,
  },
})
const mentioned = ref({} as { [id: number]: string })
const handleMentioned = ($event: { id: number; displayName: string }) => {
  mentioned.value[$event.id] = $event.displayName
}
interface LinkMeta {
  type: 'YOUTUBE' | 'GENERAL'
  mediaId?: string
  title?: string
  description?: string
  thumbnail?: string
  url?: string
}
const rules = ref<string | null>(null)
const op = ref()
const toggleOp = (e) => {
  op.value.toggle(e)
}
const onSelect = ($event: number) => {
  selectedGroup.value = $event
  op.value.hide()
}
function onUploadMedia() {
  tryCall(imageAndVideoUpload.value?.append)
}
const emit = defineEmits(['onSuccess', 'onError'])
const postText = ref<string>(props?.post?.content || '')
const files = ref<File[]>([])
const dropdown = ref()
const toggle = (event) => {
  dropdown.value.toggle(event)
}
const enableMediaUpload = computed(() => {
  return ((!files.value || files.value?.length === 0) && !props.share) ?? false
})
const handleFiles = async (filesData: IMediaFile[]) => {
  for (const file of filesData) {
    const data = await fetch(file.path)
      .then((r) => r.blob())
      .then((f) => {
        return new File([f], 'file', { type: file.mimeType })
      })
    files.value.push(data)
  }
}
const handleBeforeUnload = (e: any) => {
  if (!postText.value || !files.value) return undefined
  const confirmationMessage = 'It looks like you have been editing something.'
  e.returnValue = confirmationMessage
  return confirmationMessage
}
onMounted(async () => {
  await Promise.all([$groups.getRecentlyJoinedGroups(), $groups.getSuggestedGroups()])
  window.addEventListener('beforeunload', handleBeforeUnload)
  if (props.post?.files) handleFiles(props.post.files)
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
const selectedGroup = ref<undefined | number>(props.post?.userGroupId ?? undefined)
const userGroups = computed(() => $groups.userGroups ?? undefined)
const group = computed<undefined | IGroup>(() => {
  if (route.params.id && !selectedGroup.value && route.fullPath.startsWith('/groups')) {
    selectedGroup.value = Number(route.params.id)
    return $groups.group
  }
  const foundGroup: any = userGroups.value?.find((g: any) => {
    const id = g.group.id || g.id
    return id == selectedGroup.value
  })
  return foundGroup?.group || foundGroup
})
const router = useRouter()
const postRequestLoading = ref(false)
const imageAndVideoUpload = ref()
const commentsAllowed = ref(true)

const handleContentWithMentioned = () => {
  const content = document.createElement('span')
  content.innerHTML = postText.value
  for (const [id, displayName] of Object.entries(mentioned.value)) {
    content.innerHTML = content.innerHTML.replace(
      `@${displayName}`,
      `<a class="mentionItem" href="/profile/${id}">@${displayName}</a>`
    )
  }
  return content.innerHTML
}
const linkMeta = ref<LinkMeta | null>(props.post?.linkMeta ?? null)
async function createPostOrUpdate() {
  let content: any = postText.value
  let mentionedPersonIds: number[] = []
  if (!selectedGroup.value || !content) {
    showNotificationModal()
    return
  }
  if (Object.keys(mentioned.value).length > 0) {
    content = handleContentWithMentioned()
    for (const key of Object.keys(mentioned.value)) mentionedPersonIds.push(Number(key))
  }
  postRequestLoading.value = true
  let data
  try {
    if (props.mode === 'edit' && props.post) {
      if (props.post.linkMeta && linkMeta.value == null) {
        const [_, p] = await Promise.all([
          await usePostsStore().removeLinkMeta(props.post.id),
          await usePostsStore().updatePost(
            {
              postId: props.post.id,
              data: { content, mentionedPersonIds, linkMeta: linkMeta.value },
            },
            files.value
          ),
        ])
        router.push('/groups/' + selectedGroup.value)
        emit('onSuccess', p)
      } else {
        const p = await usePostsStore().updatePost(
          {
            postId: props.post.id,
            data: { content, mentionedPersonIds, linkMeta: linkMeta.value },
          },
          files.value
        )
        router.push('/groups/' + selectedGroup.value)
        emit('onSuccess', p)
      }
    } else {
      data = await usePostsStore().createPost(
        {
          content,
          type: 'IMAGE',
          userGroupId: selectedGroup.value,
          commentsAllowed: commentsAllowed.value,
          mentionedPersonIds,
          linkMeta: linkMeta.value,
        },
        files.value
      )
    }
    const { stateDisplayName, authorId } = data
    if (stateDisplayName === 'PENDING') showNotificationModal(authorId)
    else router.push('/groups/' + selectedGroup.value)
    postText.value = ''
    imageAndVideoUpload.value.reset()
    emit('onSuccess', data)
  } catch (e) {
    emit('onError', e)
  } finally {
    postRequestLoading.value = false
  }
}
const showNotificationModal = (authorId?: number) => {
  const { $vfm } = useGlobals()
  const component = resolveComponent('NotificationModal')
  let meta = {}
  if (authorId) {
    meta = {
      title: t('post.pending.title'),
      subtitle: t('post.pending.subtitle'),
      type: 'pending',
      action: {
        label: t('post.pending.action_title'),
        to: '/profile/' + authorId,
      },
    }
  } else {
    meta = {
      title: t('post.validation.title'),
      type: 'warn',
    }
  }
  $vfm.show({
    component,
    bind: {
      drag: false,
      size: 'auto',
      adaptive: false,
      noActions: true,
      meta,
    },
    on: {
      close: () => {
        $vfm.hideAll()
      },
    },
  })
}
defineExpose({ postText, files })
const postImages = computed(() => {
  return props.post?.files?.map((file) => file.path)
})

const userAvatar = computed(() => {
  return useAuthStore().getUserAvatar()
})

const submitButtonText = computed(() => {
  return props.mode === 'create' ? t('post.btn') : t('edit')
})

onBeforeRouteLeave((to, from, next) => {
  if (!postText.value && files.value.length == 0) return next()
  useMainStore().confirm({
    header: t('unsaved_header'),
    message: t('unsaved_post'),
    acceptLabel: t('acceptLabel'),
    rejectLabel: t('rejectLabel'),
    icon: 'i-figma:alert-triangle',
    accept: () => next(),
    reject: () => false,
  })
})
</script>

<style lang="scss" scoped>
.post-create {
  --at-apply: 'border border-bg-purple-light/50 mx-px lg:mx-0 lg:border-none lg:card-defaults px-2 py-2 lg:py-4 lg:px-6';

  .post-text {
    --at-apply: 'flex flex-1 justify-between';

    & .post-box {
      width: 100%;
    }
  }

  .post-upload {
    display: flex;
  }
}
.widget-post__textarea:focus {
  outline: none;
}
</style>

<style scoped lang="scss">
.file-upload {
  background: transparent !important;
  color: var(--primary-color) !important;
}

#dropdown_panel {
  z-index: 999999;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.25s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.avatar {
  --at-apply: 'hidden md:flex me-4 flex-none !bg-transparent';
}
.input-switch {
  --at-apply: 'w-8 h-5 lg:w-12 lg:h-6';
}
@media screen and (max-width: 575px) {
  .p-button {
    --at-apply: 'px-1 py-0.5';
  }
  .vertical-divider {
    --at-apply: '!m-1';
  }
}
</style>
