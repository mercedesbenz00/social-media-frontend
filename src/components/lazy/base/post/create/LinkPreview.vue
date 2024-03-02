<template>
  <div class="flex items-center justify-center">
    <loader-spinner v-if="loading" />
    <div class="w-full relative" v-else-if="preview && !hidePreview">
      <p-button
        @click="remove"
        v-if="isEdit"
        :class="preview.mediaId ? 'btn-primary' : 'btn-outlined-primary'"
        class="!absolute ltr:right-2 ltr:left-auto rtl:left-2 rtl:right-auto top-2"
        icon="i-figma:x"
      />
      <component
        :is="preview.mediaId ? 'iframe' : 'div'"
        allowfullscreen
        :src="embed"
        :class="
          preview.mediaId
            ? 'min-h-80 w-full'
            : 'flex flex-col gap-y-2 border border-gray-300 rounded-2xl overflow-hidden'
        "
      >
        <template v-if="!preview.mediaId">
          <img
            class="w-full h-full max-w-50% max-h-60 object-cover mx-auto"
            :src="preview?.thumbnail || preview?.image"
            alt=""
          />
          <div class="px-4 py-2 bg-text-primary/10">
            <div class="text-sm font-bold">{{ preview?.title }}</div>
            <div class="text-xs truncate">
              {{ preview?.description }}
            </div>
          </div>
        </template>
      </component>
    </div>
  </div>
</template>
<script setup lang="ts">
import { usePostsStore } from '@/data/posts/posts.store'
import type { PropType } from 'vue'
const $posts = usePostsStore()
const loading = ref(false)
const emits = defineEmits(['on-preview'])
const props = defineProps({
  url: {
    type: String,
    required: false,
    default: '',
  },
  meta: {
    type: Object as PropType<IMeta>,
    required: false,
    default: null,
  },
  isEdit: {
    type: Boolean,
    required: false,
    default: false,
  },
})
interface IMeta {
  url?: string
  mediaId?: string
  type: 'GENERAL' | 'YOUTUBE'
  title?: string
  description?: string
  thumbnail?: string
  image?: string
  embed?: string
}
const hidePreview = ref(false)
const preview = ref<IMeta | null>(props.meta)
const getMediaId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match ? match[2] : '0'
}
const embed = computed(() => 'https://www.youtube.com/embed/' + preview.value?.mediaId)
const getYouTubePreview = () => {
  const id = getMediaId(props.url)
  preview.value = {
    type: 'YOUTUBE',
    mediaId: id,
  }
  emits('on-preview', preview.value)
}
const getPreview = async () => {
  if (props.meta) return
  const isYouTube = /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=)?([\w-]{11})/g.test(props.url)
  if (isYouTube) {
    getYouTubePreview()
    return
  }

  try {
    loading.value = true
    preview.value = await $posts.getLinkPreview(props.url)
    emits('on-preview', {
      url: props.url,
      thumbnail: preview.value?.image,
      type: 'GENERAL',
      ...(preview.value as any),
    } as IMeta)
  } catch (error) {
    preview.value = null
  } finally {
    loading.value = false
  }
}
const remove = () => {
  hidePreview.value = true
  emits('on-preview', null)
}

watch(
  props,
  (newVal, oldVal) => {
    if (newVal.url !== oldVal?.url) {
      getPreview()
    }
  },
  { immediate: true }
)
</script>
