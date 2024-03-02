<template>
  <div>
    <div class="flex justify-between items-center" v-if="data">
      <div class="flex items-center gap-x-4">
        <vote-wrapper :data="data" class="vote-wrapper" @update="updateVote" />
        <div v-if="!noComments" class="flex items-center flex-none me-2" @click="commentsAllowed ? reply() : ''">
          <i class="bg-primary/60 w-4 h-4 i-figma:message-circle" :class="commentsAllowed ? 'cursor-pointer' : ''"></i>
          <div class="text-xs">{{ data.replyCommentsCount }}</div>
        </div>
        <div class="flex items-center lg:mx-2 cursor-pointer space-x-2">
          <PButton
            v-if="isOwnComment"
            size="small"
            class="btn-flat-primary text-xs !p-0 lg:!p-2"
            icon="i-figma:edit"
            :label="isDetails ? '' : $t('edit')"
            @click="edit"
          />
          <PButton
            v-if="isOwnComment || isAdmin || isModerator"
            size="small"
            class="btn-flat-primary text-xs !p-0 lg:!p-2"
            icon="i-figma:trash-2"
            :label="isDetails ? '' : $t('remove')"
            @click="remove"
          />
        </div>
      </div>
      <div class="text-xs ms-2 text-end">
        {{ moment(createdAt).locale(locale).fromNow() }}
      </div>
    </div>
    <CommentHint v-if="data.replyCommentsCount > 0 && !repliesOn" :count="data.replyCommentsCount" @on-click="reply" />
  </div>
</template>

<script setup lang="ts">
import type { IComment } from '@/data/posts/posts.interface.js'
import { usePostsStore } from '@/data/posts/posts.store'
import type { PropType } from 'vue'
import moment from 'moment-with-locales-es6'
import { useAuthStore } from '@/data/auth/auth.store'
import { useMainStore } from '@/data/main.store'
import { useGroupsStore } from '@/data/groups/groups.store'
import _ from 'lodash'

const $posts = usePostsStore()
const $groups = useGroupsStore()
const $auth = useAuthStore()
const $main = useMainStore()
const { locale, t } = useI18n()

const isAdmin = computed(() => $groups.isAdminByGroupId(props.groupId))
const isModerator = computed(() => $groups.isModeratorbyGroupId(props.groupId))
const isOwnComment = computed(() => $auth.isOwnComment(props.comment.authorId))
const props = defineProps({
  postId: {
    type: Number,
    required: false,
    default: undefined,
  },
  comment: {
    type: Object as PropType<IComment>,
    required: true,
  },
  noComments: {
    type: Boolean,
    default: false,
  },
  isSmall: {
    type: Boolean,
    default: false,
  },
  groupId: {
    type: Number,
    required: true,
  },
  commentsAllowed: {
    type: Boolean,
    required: false,
    default: true,
  },
  repliesOn: {
    type: Boolean,
    required: false,
    default: true,
  },
  isDetails: {
    type: Boolean,
    required: false,
    default: false,
  },
  createdAt: {
    type: Number,
    required: true
  }
})
const edit = () => {
  emit('edit', props.comment.commentUuid)
}
const remove = () => {
  $main.confirm({
    header: t('comments.remove_header'),
    message: '',
    acceptLabel: t('acceptLabel'),
    rejectLabel: t('rejectLabel'),
    accept: async () => {
      if (props.postId && !props.isSmall)
        await $posts.removeComment({ uuid: props.comment.commentUuid, postId: props.postId })
      if (props.isSmall) await $posts.removeComment({ uuid: props.comment.commentUuid, replyTo: props.comment.replyTo })
    },
    reject: () => {},
  })
}
const data = computed(() => $posts.commentFooters[props.comment.commentUuid].totalVotes)
const updateVote = async (voteType: 'UPVOTE' | 'DOWNVOTE') => {
  await $posts.updateVoteForComment(props.comment.commentUuid, voteType)
}

const reply = () => {
  emit('messageClicked')
}
const emit = defineEmits(['messageClicked', 'edit'])
</script>

<style scoped lang="scss">
:deep(.vote-wrapper) {
  i {
    --at-apply: 'w-4 h-4';
  }
}
</style>
