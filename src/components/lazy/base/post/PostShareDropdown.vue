<template>
  <div class="flex">
    <PButton class="btn-flat-primary" @click="toggle" icon="i-figma:share-2" />
    <PopupMenu :items="items" ref="dropdown" />
  </div>
</template>
<script setup lang="ts">
import { useMainStore } from '@/data/main.store'
import type { IPost } from '@/data/posts/posts.interface'
import type { PropType } from 'vue'

const props = defineProps({
  post: {
    type: Object as PropType<IPost>,
    required: true,
  },
})
const $main = useMainStore()
const dropdown = ref()
const toggle = (e) => {
  dropdown.value?.toggle(e)
}
const { t } = useI18n()

const shareUrl = () => {
  const href = window.location.origin
  navigator?.clipboard.writeText(href + '/posts/' + props.post.id)
  $main.toast({
    type: 'success',
    message: t('toast.success'),
    detail: t('post.link_copied'),
  })
}

const items = ref([{ title: t('post.copy_link'), icon: 'i-figma:link', action: shareUrl }])
</script>
