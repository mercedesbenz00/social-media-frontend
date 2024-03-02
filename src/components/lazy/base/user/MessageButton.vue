<template>
  <p-button
    @click.stop="openChat(personId)"
    :loading="roomLoading"
    class="btn-outlined-primary h-1"
    :label="label"
    icon="i-figma-mail"
  />
</template>

<script setup lang="ts">
import { useChatStore } from '@/data/chat/chat.store'
import { useDeviceDetector } from '@/utils/device-detector.utils'
const router = useRouter()
defineProps({
  personId: {
    type: Number,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
})
const device = useDeviceDetector()
const roomLoading = ref(false)
const openChat = async (personId) => {
  if (roomLoading.value) return
  roomLoading.value = true
  const roomId = await useChatStore().initRoom(personId)
  if (device.value !== 'desktop' && roomId) {
    router.push('/chat/' + roomId)
  }
  roomLoading.value = false
}
</script>

<style scoped></style>
