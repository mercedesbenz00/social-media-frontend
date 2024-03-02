<template>
  <PSkeleton v-if="loading" width="8rem" height="42px" borderRadius="21px" />
  <PButton
    v-else-if="!ifIsMe"
    :loading="followLoading"
    class="p-button"
    :class="isFollowing ? 'p-button-outlined' : ''"
    :icon="isFollowing ? 'i-heroicons-solid:user-remove' : 'i-figma i-figma-user-plus'"
    :label="$t(isFollowing ? 'profile_card.un_follow' : 'profile_card.follow')"
    @click="
      () => {
        isFollowing ? unFollowUser() : followUser()
      }
    "
  />
</template>

<script setup lang="ts">
import { usePersonsStore } from '@/data/persons/persons.store'
import { useAuthStore } from '@/data/auth/auth.store'
const $user = useAuthStore()

const props = defineProps({
  followingDisplayName: {
    type: String,
    required: true,
  },
  followingId: {
    type: Number,
    required: true,
  },
})
const emit = defineEmits(['refresh'])

const response = ref()
const loading = ref(true)
const isFollowing = computed(() => {
  const content = response?.value?.content ?? []
  if (content.length) {
    return content.filter((u) => u?.subscribedTo?.id == props.followingId).length > 0
  }
  return false
})

const fetch = async () => {
  const me = $user.user?.id
  const query = { name: props.followingDisplayName, size: 1000 }
  response.value = await usePersonsStore().getFollowing(me, query)
  loading.value = false
}

const ifIsMe = computed(() => {
  const myId = $user.user?.id
  if (myId && myId === props.followingId) return true
})
const followLoading = ref(false)

const followUser = async () => {
  followLoading.value = true
  const result = await usePersonsStore().followUser(props.followingId)
  if (result) {
    response.value = { content: [result] }
    updateProfileData()
  }
  followLoading.value = false
}

const unFollowUser = async () => {
  followLoading.value = true
  try {
    await usePersonsStore().unFollowUser(props.followingId)
    response.value = undefined
    updateProfileData()
  } finally {
    followLoading.value = false
  }
}

const updateProfileData = () => {
  useAuthStore().me(true) // for my following count update
  emit('refresh') // for target page count update
}

onMounted(() => {
  fetch()
})
</script>

<style scoped></style>
