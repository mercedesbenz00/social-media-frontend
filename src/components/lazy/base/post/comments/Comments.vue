<template>
  <div class="flex comments">
    <div class="flex flex-col flex-1 w-full">
      <div v-if="isSpecificComment && !comment">
        <div @click="handleViewAll" class="flex items-center font-bold text-lg cursor-pointer">
          <div class="i-figma:arrow-left w-6 h-6 me-1"></div>
          <div>{{ $t('comments.view_all') }}</div>
        </div>
      </div>
      <CommentHeader
        :class="comment ? 'order-last' : ''"
        v-else-if="!disabled && post?.commentsAllowed && !isSpecificComment"
        :isSmall="isSmall"
        :post="post"
        :comment="comment"
        :disabled="disabled"
        @refresh="refresh"
        :is-details="isDetails"
      />
      <div v-else-if="!isSpecificComment" class="mt-4 pb-10 flex flex-col items-center justify-center w-full">
        <img class="mb-2 w-20 h-20" :src="assetImage('no-comments.svg')" alt="" />
        <div class="text-xl text-primary font-bold">{{ $t('comments.not_allowed') }}</div>
      </div>
      <div
        class="border-top"
        :class="isSpecificComment ? '' : 'pt-4'"
        v-if="comments && Object.keys(comments).length > 0"
      >
        <CommentTile
          :is-details="isDetails"
          :post="post"
          v-for="c in comments"
          :key="c.id"
          :comment="c"
          :isSmall="isSmall"
          :id="c.commentUuid"
          @refresh="refresh"
          :is-specific-comment="isSpecificComment"
        />
        <CommentsSkeleton v-if="showSkeletonLoading || loading" />
        <div
          v-if="!loading && !showSkeletonLoading && hasMore && !isSpecificComment"
          class="text-primary text-sm cursor-pointer"
          @click="loadMore"
        >
          {{ $t('post.load_more') }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { usePostsStore } from '@/data/posts/posts.store'
import type { IComment, IPost } from '@/data/posts/posts.interface'
import type { PropType } from 'vue'
import { useAssets } from '@/composables/useAssets'
const $posts = usePostsStore()
const loading = ref(false)
const showSkeletonLoading = ref(false)
const props = defineProps({
  post: {
    type: Object as PropType<IPost>,
  },
  comment: {
    type: Object as PropType<IComment>,
  },
  isDetails: {
    type: Boolean,
    required: false,
    default: false,
  },
})
const isSmall = computed(() => {
  return !!props.comment
})
const assetImage = useAssets
const route = useRoute()
const router = useRouter()
const isSpecificComment = ref(false)
defineEmits(['refresh'])
const totalComments = computed(() => $posts.totalComments[props.post?.id ?? 0])
const totalReplies = computed(() => $posts.totalReplies[props.comment?.commentUuid ?? 0])
const handleViewAll = () => {
  isSpecificComment.value = false
  router.push(route.path)
}
const refresh = async () => {
  if (props.post && !props.comment) {
    $posts.getComments(props.post, true).finally(() => {
      loading.value = false
    })
  }
  if (props.comment) {
    $posts.getReplies(props.comment, true).finally(() => {
      loading.value = false
    })
  }
}

const disabled = computed(() => {
  if (props.post) return props.post.state !== 'PUBLISHED'
  return false
})
const loadMore = () => {
  showSkeletonLoading.value = true
  if (props.post && !props.comment)
    $posts.getMoreComments(props.post).finally(() => {
      loading.value = false
      showSkeletonLoading.value = false
    })
  if (props.comment) {
    $posts.getMoreReplies(props.comment).finally(() => {
      loading.value = false
      showSkeletonLoading.value = false
    })
  }
}
const comments = computed(() => {
  if (props.post && !props.comment) return $posts.comments[props.post.id]
  if (props.comment) return $posts.replies[props.comment.commentUuid]
})
const hasMore = computed(() => {
  if (!comments.value) return
  if (props.post && !props.comment && totalComments.value) return comments.value.length < totalComments.value
  if (props.comment) return comments.value.length < props.comment.replyCommentsCount
})
const fetchData = async (forceRequest = false) => {
  if (props.post && !props.comment) {
    try {
      if (route.query.comment) {
        $posts.getCommentById({ uuid: route.query.comment as string, post: props.post })
        isSpecificComment.value = true
      } else $posts.getComments(props.post, forceRequest)
    } finally {
      loading.value = false
      showSkeletonLoading.value = false
    }
  }
  if (props.comment) {
    try {
      if (route.query.reply) {
        $posts.getCommentById({ uuid: route.query.reply as string, comment: props.comment })
        isSpecificComment.value = true
      } else $posts.getReplies(props.comment, forceRequest)
    } finally {
      loading.value = false
      showSkeletonLoading.value = false
    }
  }
}
watch(
  route,
  () => {
    fetchData(true)
  },
  { deep: true, immediate: true }
)
const scrollToBottom = async () => {
  const view = document.querySelector('.router-view')
  view?.scrollTo({
    top: view.scrollHeight,
    behavior: 'smooth',
  })
}
onMounted(() => {
  fetchData()
  if (route.query.comment) scrollToBottom()
})
</script>
<style scoped lang="scss">
.border-top {
  border-top: 1px solid rgba(var(--bg-primary-color));
}
.comments {
  --at-apply: 'w-full';
}
</style>
