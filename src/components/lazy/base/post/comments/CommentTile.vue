<template>
  <div v-if="sanitizedHtml || content.length == 0" class="relative" :class="isSmall ? 'isSmall' : ''">
    <div v-if="!isSpecificComment" class="w-90% h-px bg-text-primary/20 mx-auto"></div>
    <div
      v-if="isSmall"
      class="ltr:rounded-bl-xl rtl:rounded-br-xl ltr:left-0 rtl:right-0 border-1 ltr:border-r-none rtl:border-l-none border-t-none border-text-primary/20 w-2 h-full top-0 bottom-0 z-2 absolute transform -translate-y-40% !h-[60%]"
    ></div>
    <div class="flex flex-1 justify-between">
      <div :class="isSmall ? 'ps-4' : ''" class="py-3 flex-1 w-full">
        <UserAvatarTile
          class="w-full"
          v-if="comment.authorId"
          :user-id="comment.authorId"
          :size="isSmall ? 'small' : 'x-small'"
          :is-edit="isEdit"
        >
          <template #note>
            <div
              :class="{ 'font-plex': isRtl }"
              :dir="isRtl ? 'rtl' : 'ltr'"
              class="comment text-xs md:text-sm"
              v-if="!isEdit"
              v-html="sanitizedHtml"
            ></div>
            <div v-if="file" class="mt-2 flex flex-1 justify-between">
              <CommentMedia :data="file" />
              <div class="w-1/12 flex justify-center" v-if="isEdit">
                <PButton class="btn-flat-primary w-6 h-6" icon="i-figma:x" @click="resetMedia" />
              </div>
            </div>
            <CommentHeader
              ref="commentHeader"
              @close="isEdit = false"
              @refresh="refresh"
              class="my-2"
              :comment="comment"
              :post="post"
              v-if="isEdit"
              :is-edit="true"
              :is-details="isDetails"
            />
          </template>
        </UserAvatarTile>
        <CommentFooter
          v-if="post"
          class="ps-16"
          :comment="comment"
          :no-comments="isSmall"
          @message-clicked="toggleReplies"
          @edit="edit"
          :is-small="isSmall"
          :post-id="post.id"
          :group-id="post.userGroupId"
          :comments-allowed="post.commentsAllowed"
          :replies-on="repliesOn"
          :is-details="isDetails"
          :created-at="comment.createdAt"
        />
        <Comments :post="post" :comment="comment" :is-small="true" :is-details="isDetails" v-if="repliesOn" />
      </div>
      <CommentActionMenu v-if="comment" :comment="comment" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IComment, IPost } from '@/data/posts/posts.interface.js'
import type { PropType } from 'vue'
import { get } from 'lodash'
import DOMPurify from 'dompurify'

const props = defineProps({
  comment: {
    type: Object as PropType<IComment>,
    required: true,
  },
  isSmall: {
    type: Boolean,
    required: false,
    dafault: false,
  },
  post: {
    type: Object as PropType<IPost>,
  },
  isSpecificComment: {
    type: Boolean,
    required: false,
    default: false,
  },
  isDetails: {
    type: Boolean,
    required: false,
    default: false,
  },
})
const arabicTextRegex = /[\u0600-\u06FF]/g
const isRtl = computed(() => arabicTextRegex.test(props.comment.content))
const file = ref<any>(undefined)
const commentHeader = ref()
const sanitizedHtml = computed(() => DOMPurify.sanitize(content.value, { ALLOWED_TAGS: ['a', 'br'] }))
const resetMedia = () => {
  commentHeader.value.file = undefined
  file.value = undefined
}
const patternLink = /https?:\/\/\S+/gi
// eslint-disable-next-line no-useless-escape
const patternEmail = /\b[\w\.-]+@[\w\.-]+\.\w{2,}\b/
const content = computed(() => {
  let content = props.comment.content.replaceAll('\n', '<br>')
  content = content.replace(/(https?:\/\/[^\s<]+)(?![^<]*>)/g, '<a class="cursor-pointer text-info" href="$1">$1</a>')
  content = content.replace(
    /\b[\w\.-]+@[\w\.-]+\.\w+\b/g,
    '<a class="cursor-pointer text-info" href="mailto:$&">$&</a>'
  )
  return content
})

const edit = async () => {
  isEdit.value = true
}
const route = useRoute()
const emit = defineEmits(['refresh', 'resetMedia'])

const refresh = () => {
  isEdit.value = false
  if (props.post) emit('refresh', props.post)
}

const isEdit = ref(false)
const repliesOn = ref(false)

const toggleReplies = () => {
  repliesOn.value = !repliesOn.value
}
const handleNotificationComment = () => {
  if (route.query.comment && route.query.comment == props.comment.commentUuid) repliesOn.value = true
}
onMounted(() => {
  handleNotificationComment()
  file.value = props.comment.file
})
onUpdated(() => {
  file.value = props.comment.file
})
watch(
  route,
  () => {
    handleNotificationComment()
  },
  { deep: true }
)
</script>

<style scoped lang="scss">
.tile-avatar {
  --at-apply: 'w-12 h-12 me-4';
}
.border-bottom {
  border-bottom: 1px solid rgb(var(--bg-border-light));
}
.reply {
  &-write {
    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 3rem;
      left: -10px;
      top: -10px;
      border-left: 1px solid rgba(var(--bg-border-light));
      border-bottom: 1px solid transparent;
      border-bottom-left-radius: 0.75rem;
    }
    &::after {
      content: '';
      position: absolute;
      left: -10px;
      top: calc(100% - 1rem);
      height: calc(100% - 2.5rem);
      border-left: 1px solid rgba(var(--bg-border-light));
    }
    &-avatar {
      --at-apply: 'w-8 h-8';
    }
    &-input {
      height: 2rem;
    }
  }
  &:last-child {
    &::after {
      display: none;
    }
  }

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 4rem;
    left: -10px;
    top: -10px;
    border-left: 1px solid rgba(var(--bg-border-light));
    border-bottom: 1px solid transparent;
    border-bottom-left-radius: 0.75rem;
  }
  &::after {
    content: '';
    position: absolute;
    left: -10px;
    top: calc(100% - 1rem);
    height: calc(100% - 2.5rem);
    border-left: 1px solid rgba(var(-bg-border-light));
  }
}
.btn {
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
}

.comment {
  word-break: break-word;
}
</style>
