<template>
  <section class="relative">
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
  </section>
</template>

<script setup lang="ts">
import type { IComment } from '@/data/posts/posts.interface'
import type { PropType } from 'vue'
import { useAuthStore } from '@/data/auth/auth.store'
import { usePersonsStore } from '@/data/persons/persons.store'
import { usePostsStore } from '@/data/posts/posts.store'
import { useGroupsStore } from '@/data/groups/groups.store'
import type { IPerson } from '@/data/persons/persons.interface'
import Complaints from '@/components/auto/modals/Complaints.vue'
import { COMPLAINT_TYPE } from '@/data/main.model'
import { v4 } from 'uuid'
import type { IPopupMenuItem } from '@/data/main.interface'
const uuid = v4()

const { t } = useI18n()
const $auth = useAuthStore()
const $person = usePersonsStore()
const $posts = usePostsStore()
const $group = useGroupsStore()
const items = ref<IPopupMenuItem[]>([])

const props = defineProps({
  comment: {
    type: Object as PropType<IComment>,
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
    items.value = postDropdownItems()
  } finally {
    loading.value = false
    pTiredMenu.value?.toggle(e)
  }
}
function hide() {
  pTiredMenu.value?.hide()
}

const isMyComment = computed(() => props.comment.authorId == $auth.user?.id)

const CommentActions = computed(() => {
  return {
    POST_COMPLAINT: {
      title: t('post.report_comment'),
      icon: 'i-figma:flag',
      action: () => {
        onOpenComplaints(COMPLAINT_TYPE.COMMENT)
        hide()
      },
    } as IPopupMenuItem,
  }
})

const postDropdownItems: () => IPopupMenuItem[] = () => {
  const ACTIONS = CommentActions.value
  // my post actions
  if (isMyComment.value) {
    return []
  }
  // other user post actions
  return [ACTIONS.POST_COMPLAINT]
}

const user = computed<IPerson | undefined>(() => {
  if (props.comment?.authorId) return $person.users[props.comment?.authorId]
})

const onOpenComplaints = (complaintType) => {
  const { $vfm } = useGlobals()
  $vfm.show({
    component: Complaints,
    bind: {
      complaintType,
      comment: props.comment,
      title:
        complaintType == COMPLAINT_TYPE.COMMENT ? t('post.report_comment_title') : t('post.report_post_user_title'),
      subtitle:
        complaintType == COMPLAINT_TYPE.COMMENT
          ? t('post.report_comment_sub_title')
          : t('post.report_post_user_sub_title'),
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
