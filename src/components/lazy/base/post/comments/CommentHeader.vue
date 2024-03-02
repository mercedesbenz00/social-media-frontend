<template>
  <div class="relative">
    <div
      v-if="isSmall"
      class="ltr:rounded-bl-xl rtl:rounded-br-xl border-1 ltr:border-r-none rtl:border-l-none border-t-none border-text-primary/20 w-2 h-full ltr:left-0 rtl:right-0 top-0 bottom-0 z-2 absolute transform -translate-y-60%"
    ></div>
    <div
      class="relative flex items-center"
      :class="[isSmall ? 'ps-4 mt-2' : '', isEdit ? 'flex flex-col md:flex-row items-center' : ' ']"
    >
      <Avatar v-if="!isEdit" class="me-1 avatar w-8 h-8" :person-id="myId" />
      <Mentionable
        class="flex-1 relative w-full"
        :keys="['@']"
        :items="persons"
        insert-space
        @search="fetchPersons($event)"
        @open="fetchPersons()"
        @apply="mentionedPersons.push($event)"
      >
        <template #no-result>
          <div class="p-2">{{ $t('search_result.no_result') }}</div>
        </template>
        <template #item-@="{ item }">
          <PersonItem class="py-2 px-4" :person="item" />
        </template>
        <p-textarea
          @keyup.delete="remove"
          @keyup.enter.exact="inputData.trim().length > 0 ? onPost() : ''"
          :disabled="disabled"
          class="w-full block input rounded-3xl input-textarea"
          :class="[
            isSmall ? 'text-xs ps-2 pe-24 max-h-[32px]' : 'ps-4 pe-28 max-h-12',
            isEdit ? 'text-xs pe-0 md:pe-56' : '',
          ]"
          v-model="inputData"
          :placeholder="$t('comments.write_placeholder')"
          :autoResize="true"
        />
      </Mentionable>
      <div
        class="input-actions"
        :class="isEdit ? '!relative inset-x-0 !justify-end w-full md:w-auto mt-1 md:!absolute md:mt-0' : ''"
      >
        <div class="relative">
          <p-button
            class="btn-flat-primary text-xs min-w-4 w-auto text-primary md:min-w-auto md:w-auto md:text-2xl"
            :class="{ '!min-h-5 !min-w-5 text-1xl': isSmall }"
            icon="i-far:face-smile"
            @click="showEmojiStickerPicker = !showEmojiStickerPicker"
          />
          <div v-if="showEmojiStickerPicker" ref="emoji_rect" class="w-320px z-50 position-absolute right-0 top-10">
            <EmojiStickerWrapper
              :disable-skin-tones="true"
              @close="showEmojiStickerPicker = false"
              @input:emoji="onSelectEmoji"
              @input:sticker="onSelectMedia"
              @input:gif="onSelectMedia"
            />
          </div>
        </div>
        <PButton
          :disabled="isDisabledUpload"
          class="btn-flat-primary min-h-5 min-w-5"
          icon="i-figma:paperclip"
          @click="onUploadMedia"
        />
        <PButton
          v-if="isSmall && !isEdit"
          :disabled="isDisabledPost"
          :loading="isPosting"
          @click="onPost"
          v-tooltip.bottom="disabled ? $t('comments.disabled_comment') : $t('comments.post_comment')"
          class="btn-flat-primary !min-h-5 !min-w-5 text-1xl"
          icon="i-figma:arrow-right-circle"
        />
        <PButton
          :label="device == 'desktop' ? (isDetails ? '' : 'Send') : ''"
          :icon="device == 'desktop' ? (isDetails ? 'i-figma:send' : '') : 'i-figma:send'"
          v-else-if="!isEdit"
          @click="onPost"
          :disabled="isDisabledPost"
          :loading="isPosting"
          class="btn-flat-primary md:btn-primary"
        />
        <div v-else class="flex items-center space-x-4">
          <PButton v-if="!isPosting" @click="cancel" class="btn-flat-primary" :label="$t('comments.cancel')" />
          <PButton
            :label="$t('comments.save')"
            :disabled="isDisabledPost"
            :loading="isPosting"
            @click="onPost"
            class="btn-primary"
          />
        </div>
      </div>
    </div>

    <ImageAndVideoUpload
      :class="files?.length > 0 ? 'w-full' : ''"
      ref="imageAndVideoUpload"
      @changed="attach"
      :isSingleMode="true"
      :files-arr="files"
      :previewImgs="previewImgs"
      accept="image/*"
    />
  </div>
</template>
<script setup lang="ts">
import { useAuthStore } from '@/data/auth/auth.store'
import { useGroupsStore } from '@/data/groups/groups.store'
import { useMainStore } from '@/data/main.store'
import type { IPerson } from '@/data/persons/persons.interface'
import { usePersonsStore } from '@/data/persons/persons.store'
import type { IComment, IPost } from '@/data/posts/posts.interface.js'
import { usePostsStore } from '@/data/posts/posts.store'
import { tryCall } from '@/utils/function.utils'
import type { PropType } from 'vue'
import { Mentionable } from 'vue-mention'
import { debounce } from 'lodash'
import { onBeforeRouteLeave } from 'vue-router'
import { useDeviceDetector } from '@/utils/device-detector.utils'

const { t } = useI18n()
const $auth = useAuthStore()
const $posts = usePostsStore()
const $person = usePersonsStore()
const $groups = useGroupsStore()
const showEmojiStickerPicker = ref(false)

const device = useDeviceDetector()

function onSelectEmoji(emoji) {
  inputData.value = inputData.value + emoji.i
}
function onSelectMedia(media) {
  const url = media.item_media?.tinygif_transparent?.url ?? media?.item_media?.tinygif?.url
  if (url) {
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const newFile = new File([blob], 'image', { type: blob.type })
        tryCall(imageAndVideoUpload.value?.attachFiles([newFile]))
        preview.value = URL.createObjectURL(blob)
      })
  }
}
function onUploadMedia() {
  tryCall(imageAndVideoUpload.value?.append)
}
const props = defineProps({
  isSmall: {
    type: Boolean,
    required: false,
    default: false,
  },
  post: {
    type: Object as PropType<IPost>,
  },
  comment: {
    type: Object as PropType<IComment>,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  isDetails: {
    type: Boolean,
    required: false,
    default: false,
  },
})
const originalText = ref('')
const originalFile = ref()
const putOriginalData = () => {
  originalText.value = props.comment?.content ?? ''
  originalFile.value = props.comment?.file
}
const $main = useMainStore()
const persons = ref()
const inputData = ref('')
const isPosting = ref(false)
const mentionedPersons = ref([] as Array<IPerson>)
const isMember = ref()
const myId = computed(() => $auth.user?.id)
const preview = ref<any>(null)
const file = ref<File | undefined>(undefined)
const imageAndVideoUpload = ref()
const reset = () => {
  tryCall(imageAndVideoUpload.value?.reset)
  preview.value = null
  file.value = undefined
}
const checkData = () => {
  if (file.value?.size !== originalFile.value?.size) return false
  if (inputData.value !== originalText.value) return false
  return true
}
const attach = ($event: FileList) => {
  if ($event.length) {
    file.value = $event[0]
  } else {
    file.value = undefined
  }
}
const files = computed(() => (file.value ? [file.value] : []))
const previewImgs = computed(() => (preview.value ? [preview.value] : []))
const isDisabledPost = computed(() => {
  return (!file.value && !inputData.value?.trim()) || isPosting.value
})

const isDisabledUpload = computed(() => {
  return !!file.value
})

const isGroupMember = async () => {
  const response = await $groups.isMember(props.post?.userGroupId)
  isMember.value = response
}
const emit = defineEmits(['close', 'refresh'])

const cancel = () => {
  emit('close')
}
const handleBeforeUnload = (e: any) => {
  if (!inputData.value || !file.value) return undefined
  if (checkData()) return undefined
  const confirmationMessage = 'It looks like you have been editing something.'
  e.returnValue = confirmationMessage
  return confirmationMessage
}
const removeHtmlTags = (html) => {
  return html.replace(/<[^>]*>/g, '')
}
onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
  isGroupMember()
  if (props.isEdit) {
    inputData.value = removeHtmlTags(props.comment?.content)
    fetch(props.comment?.file?.path)
      .then((res) => res.blob())
      .then((blob) => {
        file.value = new File([blob], 'file', { type: props.comment?.file?.mimeType })
      })
    putOriginalData()
    inputData.value = props.comment?.content
    inputData.value = removeHtmlTags(props.comment?.content)
  }
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

const remove = () => {
  for (const person of mentionedPersons.value) {
    if (!inputData.value.includes(`@${person.displayName}`))
      mentionedPersons.value = mentionedPersons.value.filter((p) => p !== person)
  }
}
const fetchPersons = debounce(async (searchText = null) => {
  const personsData = await $person.getPersons({ query: searchText, followingsFirst: true })
  if (personsData) persons.value = personsData.content
  persons.value.map((person) => {
    person.label = person.displayName
    person.value = person.displayName
    return person
  })
}, 500)
const handlePostAction = async (data) => {
  isPosting.value = true
  try {
    if (props.isEdit && props.comment) {
      await $posts.editComment(
        {
          content: data.content,
          commentId: props.comment.id,
          commentUuid: props.comment.commentUuid,
          mentionedPersonIds: data.mentionedPersonIds,
        },
        props.post!.id,
        file.value
      )
    }
    if (props.post && !props.comment) {
      await $posts.postComment(
        {
          content: data.content,
          postUuid: props.post.postUuid,
          postId: props.post.id,
          mentionedPersonIds: data.mentionedPersonIds,
        },
        file.value
      )
    }
    if (props.comment && !props.isEdit) {
      await $posts.postReply(
        {
          content: `${data.content}`,
          mentionedPersonIds: data.mentionedPersonIds,
          commentUuid: props.comment.commentUuid,
        },
        file.value
      )
    }
  } catch (e) {
    $main.toast({ type: 'error', message: t('toast.error'), detail: e?.response?.data?.message })
  }

  isPosting.value = false
  emit('refresh')
}
defineExpose({ reset, file })
const onPost = async () => {
  if (props.post?.commentsAllowed && isMember.value) {
    let content: any = document.createElement('span')
    content.innerHTML = inputData.value
    mentionedPersons.value.forEach((person) => {
      content.innerHTML = content.innerHTML.replace(
        `@${person.displayName}`,
        `<a class="mentionItem" href="/profile/${person.id}">@${person.displayName}</a>`
      )
    })
    const mentionedPersonIds = Array.from(mentionedPersons.value, (person: IPerson) => person.id)
    await handlePostAction({
      content: `${content.innerHTML}`,
      mentionedPersonIds: mentionedPersonIds,
    })
    inputData.value = ''
    reset()
  } else {
    $main.confirm({
      header: t('confirm_dialog.not_member_header'),
      message: t('confirm_dialog.not_member_message'),
      acceptLabel: t('acceptLabel'),
      rejectLabel: t('rejectLabel'),
      accept: async () => {
        try {
          await $groups.joinGroup(props.post?.userGroupId)
          isMember.value = true
          await onPost()
        } catch (e) {
          $main.toast({ type: 'error', message: t('toast.error'), detail: e?.response?.data?.message })
        }
      },
      reject: () => {
        inputData.value = ''
      },
    })
  }
}
onBeforeRouteLeave((to, from, next) => {
  if (!inputData.value && !file.value && checkData()) return next()
  $main.confirm({
    header: t('unsaved_header'),
    message: t('unsaved_comment'),
    acceptLabel: t('acceptLabel'),
    rejectLabel: t('rejectLabel'),
    icon: 'i-figma:alert-triangle',
    accept: () => next(),
    reject: () => {},
  })
})
</script>
<style scoped lang="scss">
[dir='rtl'] {
  .btn {
    &-post {
      --at-apply: 'left-2';
      right: inherit;
    }
    &-reply {
      --at-apply: 'left-2';
      right: inherit;
    }
  }
}
.btn {
  &-post {
    --at-apply: 'absolute right-2 inset-y-0 my-auto w-20 h-8 flex justify-center';
    &[disabled] {
      --at-apply: 'bg-bg-primary';
    }
  }
  &-reply {
    --at-apply: 'absolute right-2 inset-y-0 my-auto flex justify-center';
    &[disabled] {
      --at-apply: 'bg-transparent';
    }
  }
}
.isSmall {
  .avatar {
    --at-apply: 'w-8 h-8 me-2';
  }
  .input {
    --at-apply: 'h-8';
  }
}
.input-actions {
  --at-apply: 'flex items-center absolute ltr:right-2 rtl:left-2 md:space-x-2 inset-y-0 ';
}
@media screen and (max-width: 575px) {
  .avatar {
    --at-apply: 'hidden md:flex';
  }
  .input {
    &-textarea {
      --at-apply: '!max-h-10 ps-4 pe-32 text-xs';
    }
  }
}
</style>
