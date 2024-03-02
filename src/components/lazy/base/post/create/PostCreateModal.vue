<template>
  <vue-final-modal
    :click-to-close="false"
    classes="flex justify-center items-center z-0"
    content-class="card-defaults relative max-w-95% sm:max-w-3xl"
  >
    <PostCreate
      :rows="6"
      :mode="props.mode"
      :post="post"
      @onSuccess="handleSuccess"
      @onError="props.onError"
      :share="share"
      :original-id="originalId"
      ref="postCreate"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="title text-text-primary">{{ $t(`post.${props.mode}`) }}</h1>
          <PButton class="btn-flat-primary" icon="i-figma:x" @click="handleClose"></PButton>
        </div>
        <PDivider></PDivider>
      </template>
    </PostCreate>
  </vue-final-modal>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { IPost } from '@/data/posts/posts.interface'
import { useGroupsStore } from '@/data/groups/groups.store'
import { useMainStore } from '@/data/main.store'

const { t } = useI18n()
const emit = defineEmits(['onSuccess'])
const groupStore = useGroupsStore()
const props = defineProps({
  mode: {
    type: String as PropType<'create' | 'edit'>,
    default: 'create',
  },
  post: {
    type: Object as PropType<IPost>,
  },
  onSuccess: {
    type: Object as PropType<(v?: IPost) => void>,
    default: () => {},
  },
  onError: {
    type: Object as PropType<() => void>,
    default: () => {},
  },
  share: {
    type: Boolean,
    default: false,
  },
  originalId: {
    type: Number,
    required: false,
    default: undefined,
  },
})
const postCreate = ref()
const fetchGroups = async () => {
  await Promise.all([groupStore.getRecentlyJoinedGroups(), groupStore.getSuggestedGroups()])
}
const checkFiles = () => {
  if (postCreate.value?.files?.length !== !originalFiles.value?.length) return false
  return originalFiles.value?.every((i, index) => {
    if (i.size !== (postCreate.value?.files[index]?.size ?? 0)) return false
    return true
  })
}
const isDataEqual = () => {
  return (
    (postCreate.value.postText.length == 0 && postCreate.value.files.length == 0) ||
    (props.mode == 'edit' && originalText.value == postCreate.value.postText && checkFiles())
  )
}
const handleClose = (event?: any) => {
  isDataEqual() ? handleSuccess() : confirmClose(event)
}
const confirmClose = (event?: any) => {
  useMainStore().confirm({
    header: t('unsaved_header'),
    message: t('unsaved_post'),
    acceptLabel: t('acceptLabel'),
    rejectLabel: t('rejectLabel'),
    icon: 'i-figma:alert-triangle',
    accept: () => {
      handleSuccess()
    },
    reject: () => {},
  })
}
function handleSuccess(v?: IPost) {
  emit('onSuccess', v)
}
const originalText = ref()
const originalFiles = ref([] as any)
const putOriginalData = () => {
  originalText.value = props.post?.content
  originalFiles.value = props.post?.files
}
onMounted(() => {
  if (props.mode == 'edit') putOriginalData()
  fetchGroups()
})
</script>

<style lang="scss" scoped>
.modal-container {
  width: 720px;
}

.title {
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
}
:deep(.post-textarea) {
  --at-apply: '!h-[288px] !overflow-auto';
}
:deep(.icon) {
  --at-apply: 'flex items-start';
}
</style>
