<template>
  <div class="flex items-center justify-center lg:justify-end space-x-4 order-3 lg:order-0 mb-2">
    <PButton
      class="!h-[32px] !min-h-[32px]"
      v-for="(button, index) in buttons"
      :key="index"
      :label="button.label"
      :icon="button.icon"
      @click="button.action"
      :class="button.class"
      :loading="loading"
    />
  </div>
</template>
<script setup lang="ts">
import { useMainStore } from '@/data/main.store'
import { usePostsStore } from '@/data/posts/posts.store'
const props = defineProps({
  postId: {
    type: Number,
    required: true,
  },
  removeButton: {
    type: Boolean,
    required: false,
    default: true,
  },
})
const $main = useMainStore()
const { t } = useI18n()
const loading = ref(false)
const emits = defineEmits(['update'])
const $posts = usePostsStore()
const showConfirm = (header: string, acceptFunc: Function, message?: string) => {
  $main.confirm({
    header,
    message: message ?? '',
    acceptLabel: t('acceptLabel'),
    rejectLabel: t('rejectLabel'),
    accept: async () => acceptFunc(),
    reject: () => {},
  })
}
const buttons = computed(() => {
  if (props.removeButton) {
    return [
      {
        label: t('moderation.approve'),
        class: 'btn-outlined-primary',
        action: async () => {
          try {
            loading.value = true
            await $posts.updatePost({ postId: props.postId, data: { state: 'PUBLISHED' } })
            emits('update', props.postId)
          } finally {
            loading.value = false
          }
        },
      },
      {
        label: t('moderation.reject'),
        class: 'btn-primary',
        action: async () => {
          try {
            loading.value = true
            await $posts.updatePost({ postId: props.postId, data: { state: 'REJECTED' } })
            emits('update', props.postId)
          } finally {
            loading.value = false
          }
        },
      },
      {
        icon: 'i-figma:trash',
        class: 'btn-flat-primary',
        action: async () => {
          try {
            showConfirm(t('moderation.remove_post_header'), async () => {
              loading.value = true
              await $posts.removePost(props.postId)
              emits('update', props.postId)
            })
          } finally {
            loading.value = false
          }
        },
      },
    ]
  } else {
    return [
      {
        label: t('moderation.approve'),
        class: 'btn-outlined-primary',
        action: async () => {
          try {
            loading.value = true
            await $posts.updatePost({ postId: props.postId, data: { state: 'PUBLISHED' } })
            emits('update', props.postId)
          } finally {
            loading.value = false
          }
        },
      },
      {
        icon: 'i-figma:trash',
        class: 'btn-flat-primary',
        action: async () => {
          try {
            showConfirm(t('moderation.remove_post_header'), async () => {
              loading.value = true
              await $posts.removePost(props.postId)
              emits('update', props.postId)
            })
          } finally {
            loading.value = false
          }
        },
      },
    ]
  }
})
</script>
