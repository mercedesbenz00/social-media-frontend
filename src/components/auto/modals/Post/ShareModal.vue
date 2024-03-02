<template>
  <vue-final-modal
    v-if="shareModal"
    v-slot="{ close }"
    classes="flex justify-center items-center z-0"
    content-class="card-defaults relative max-w-3xl p-6"
  >
    <img v-if="loading" class="mx-auto w-20" src="@/assets/images/loading.gif" alt="loading" />
    <div class="w-[312px] min-h-[396px] flex flex-col space-y-6" v-else-if="!sendDirect">
      <div class="flex items-center justify-between">
        <div class="font-bold text-sm">{{ $t('sending.title') }}</div>
        <div class="i-figma:x w-6 h-6 cursor-pointer" @click="close"></div>
      </div>
      <div>
        <div class="flex flex-col space-y-4" v-if="recentUsers.length > 0">
          <div
            class="flex items-center space-x-2 cursor-pointer"
            @click="send(user.id)"
            v-for="(user, index) in recentUsers"
            :key="index"
          >
            <Avatar :person-id="user.id?.split('.')[1].slice(0, -7)" />
            <div class="flex flex-col space-y-1">
              <div class="text-xs font-bold">{{ user.profile.displayName }}</div>
              <div class="text-xs text-text-secondary-light">{{ $t('sending.via_direct') }}</div>
            </div>
          </div>
        </div>
        <div v-else class="flex items-center space-x-2 text-center">
          <div class="i-figma:corner-left-down w-5 h-5"></div>
          <div>
            <div class="font-semibold text-xs">{{ $t('post.share.empty.title') }}</div>
            <div class="text-xs">{{ $t('post.share.empty.description') }}</div>
          </div>
        </div>
        <div class="flex items-center mt-4 cursor-pointer" @click="sendDirect = true">
          <div class="i-figma:mail bg-primary w-5 h-5 me-2"></div>
          <div class="text-xs">{{ $t('sending.send_via_direct') }}</div>
        </div>
      </div>
      <div class="flex items-center">
        <div class="me-6" v-for="(button, index) in buttons" :key="index">
          <PButton
            :icon="button.icon"
            class="btn-outlined-primary rounded-2xl !w-16 !h-16 btn-actions"
            @click="button.action()"
          ></PButton>
          <div class="mt-2 text-xs text-center">{{ button.title }}</div>
        </div>
      </div>
    </div>
    <SendDirect :post="post" v-else @close="close"></SendDirect>
  </vue-final-modal>
  <PostCreateModal @onSuccess="() => emit('close')" :post="post" :original-id="post.id" :share="true" v-else />
</template>
<script setup lang="ts">
import { useMainStore } from '@/data/main.store'
import type { IPost } from '@/data/posts/posts.interface'
import type { PropType } from 'vue'
import PostCreateModal from '@/components/lazy/base/post/create/PostCreateModal.vue'
import { useChatStore } from '@/data/chat/chat.store'
import type { IMediaFile } from '@/data/main.model'

const $chat = useChatStore()
const props = defineProps({
  post: {
    type: Object as PropType<IPost>,
    required: true,
  },
})
const $main = useMainStore()
const { t } = useI18n()
const emit = defineEmits(['close'])
const media = ref(undefined as any)
const recentUsers = computed(() => Object.values($chat.users).splice(1).slice(0, 3))
const shareModal = ref(true)
const sendDirect = ref(false)
const loading = ref(false)

const send = async (id: string) => {
  loading.value = true
  const rooms = $chat.rooms
  const currentRoom = Object.values(rooms).find((room) => room.members[1].id === id)
  const url = '/posts/' + props.post.id
  const mediaData = props.post.files ? props.post.files[0] : ({} as IMediaFile)
  const file: File = await fetch(mediaData.path as any)
    .then((res) => res.blob())
    .then(async (blob) => {
      return new File([blob], 'File name', { type: mediaData.mimeType })
    })
  const mediaUrl = await $chat.uploadContent(file)
  if (mediaUrl) {
    const reversedUrl = $chat.client?.mxcUrlToHttp(mediaUrl)
    media.value = {
      msgtype: `m.${file.type?.split('/')[0]}-shared`,
      url: mediaUrl,
      reversedUrl,
      originalLink: url,
      info: {
        mimeType: file.type,
        size: file.size,
        fileName: file.name,
      },
    }
  }
  if (currentRoom?.id) $chat.sendMessage(currentRoom.id, '', media.value)
  $main.toast({
    type: 'success',
    message: t('toast.shared'),
  })
  emit('close')
}
const buttons = computed(() => {
  return [
    {
      title: t('sending.copy_link'),
      icon: 'i-figma:link',
      action: () => {
        const prefix = window.location.href
        const url = prefix + 'posts/' + props.post.id
        navigator.clipboard.writeText(url)
        $main.toast({
          type: 'info',
          message: t('toast.copied'),
        })
      },
    },
    {
      title: t('sending.repost'),
      icon: 'i-figma:plus-square',
      action: () => {
        shareModal.value = false
      },
    },
  ]
})
</script>
<style scoped lang="scss">
:deep(.btn-actions > .p-button-icon) {
  --at-apply: '!w-8 !h-8';
}
:deep(.close > .p-button-icon) {
  --at-apply: '!w-6 !h-6';
}
</style>
