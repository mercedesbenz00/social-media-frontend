<template>
  <div class="w-[432px] min-h-[562px] flex flex-col space-y-6">
    <div class="flex items-center justify-between">
      <div class="font-bold text-sm">{{ $t('post.share.direct.title') }}</div>
      <PButton class="btn-flat-primary close" icon="i-figma:x" @click="() => emit('close')"></PButton>
    </div>
    <div class="flex border-bottom pb-2">
      <div class="text-sm me-2 py-1">To:</div>
      <div class="flex items-center flex-wrap">
        <div v-for="(user, index) in choosedUsers" :key="index">
          <div
            @click="removeChoosedUser(index)"
            class="choosedUser primary-shadow py-1 px-3 rounded-2xl flex items-center me-2 mb-1 cursor-pointer"
          >
            <div class="i-figma:x w-4 h-4 me-2 bg-primary"></div>
            <div v-if="user.displayName" class="text-sm">{{ user.displayName }}</div>
            <div v-else class="text-sm">{{ user.firstName }} {{ user.lastName }}</div>
          </div>
        </div>
        <p-input-text
          class="border-0 !w-auto !h-6 ms-2 outline-none p-1 text-sm"
          v-model="searchValue"
          @input="searchUser"
        ></p-input-text>
      </div>
    </div>
    <div class="-mx-6 space-y-3">
      <div v-for="(person, index) in persons" :key="index" class="flex items-center px-6 py-1 justify-between">
        <div class="flex items-center space-x-2">
          <Avatar :person-id="person.id" class="!w-10 !h-10"></Avatar>
          <label :for="person.id">
            <div>
              <div v-if="person.displayName" class="font-bold text-xs">{{ person.displayName }}</div>
              <div v-else class="font-bold text-xs">{{ person.firstName }} {{ person.lastName }}</div>
              <div class="text-10 text-text-secondary-light">{{ useLocation(person.cityId) }}</div>
            </div>
          </label>
        </div>
        <PCheckbox :inputId="person.id.toString()" name="person" :value="person" v-model="choosedUsers" />
      </div>
    </div>
    <p-input-text v-model="comment" :placeholder="$t('post.share.direct.message_placeholder')"></p-input-text>
    <PButton :loading="loading" @click="send" class="btn-primary" :label="$t('post.share.direct.send')"> </PButton>
  </div>
</template>
<script setup lang="ts">
import { usePersonsStore } from '@/data/persons/persons.store'
import { debounce } from 'lodash'
import { useLocation } from '@/composables/useLocation'
import { useChatStore } from '@/data/chat/chat.store'
import type { PropType } from 'vue'
import type { IPost } from '@/data/posts/posts.interface'
import { useMainStore } from '@/data/main.store'
import type { IMediaFile } from '@/data/main.model'

const $chat = useChatStore()
const $persons = usePersonsStore()
const $main = useMainStore()
const { t } = useI18n()
const loading = ref(false)

const emit = defineEmits(['close'])
const props = defineProps({
  post: {
    type: Object as PropType<IPost>,
    required: true,
  },
})

const choosedUsers = ref([] as any[])
const searchValue = ref('')
const media = ref(undefined as any)
const comment = ref('')
const searchUser = debounce(() => {
  fetchPersons({
    query: searchValue.value,
  })
}, 500)
const persons = ref([] as any[])
const fetchPersons = async (params = {}) => {
  params = { ...params, ...{ size: 5, followingsFirst: true } }
  const response = await $persons.getPersons(params)
  if (response) persons.value = response.content
}

const removeChoosedUser = (index: number) => {
  choosedUsers.value = choosedUsers.value.filter((_, idx) => idx !== index)
}

const send = async () => {
  loading.value = true
  try {
    const rooms = $chat.rooms
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
    const roomIds = [] as any
    for (const user of choosedUsers.value) {
      for (const room of Object.values(rooms)) {
        for (const member of room.members) {
          if (member.id.includes(user.id)) roomIds.push(room.id)
          else {
            const roomId = await $chat.initRoom(user.id, false)
            roomIds.push(roomId)
          }
        }
      }
    }
    const ids = new Set(roomIds)
    ids.forEach((id: any) => {
      $chat.sendMessage(id, comment.value, media.value)
    })
    $main.toast({
      type: 'success',
      message: t('toast.shared'),
    })
    emit('close')
    loading.value = false
  } catch (error) {
    $main.toast({
      type: 'error',
      message: t('toast.error'),
      detail: error?.response?.data?.message,
    })
    emit('close')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPersons()
})
</script>
<style scoped lang="scss">
.border-bottom {
  border-bottom: 1px solid rgb(var(--bg-border-light));
}
.text-10 {
  font-size: 0.6rem;
  line-height: 0.875rem;
}
</style>
