<template>
  <div class="profile-page">
    <a @click="goBack" class="text-text-primary hover:text-gray-600 font-bold text-xl cursor-pointer" v-if="user">
      <span class="pi pi-arrow-left text-sm font-bold px-2"></span>
      {{ $t('profile.user_profiles', [user.displayName]) }}
    </a>
    <ProfileCardSkeleton v-if="loading" />
    <ProfileCard
      v-else
      :userData="user"
      :is-my-profile="isMyProfile"
      @refresh="fetchPersonProfile(user.id)"
      class="primary-shadow mt-3"
    />
    <div class="my-4" v-if="isMyProfile">
      <PostCreate @onSuccess="addPost"></PostCreate>
    </div>
    <div class="flex justify-between items-center my-4 px-2 md:px-0">
      <div class="text-xl font-bold">{{ $t('profile.post_activities') }}</div>
      <PostStateMenu v-model="stateType" v-if="user && isMyProfile" />
    </div>
    <PostList ref="postList" :params="postParams" v-if="user"> </PostList>
  </div>
</template>

<route lang="yaml">
meta:
layout: default
</route>

<script setup lang="ts">
import { PostStates, type IPost } from '@/data/posts/posts.interface'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/data/auth/auth.store'
import { usePersonsStore } from '@/data/persons/persons.store'
import { useGroupsStore } from '@/data/groups/groups.store'

const props = defineProps({
  personId: {
    type: [Number, String],
    default: undefined,
  },
})

const $user = useAuthStore()
const $person = usePersonsStore()
const user = ref()
const router = useRouter()
const groupStore = useGroupsStore()
const postList = ref()

const loading = ref(false)

const fetchGroups = async () => {
  await Promise.all([groupStore.getRecentlyJoinedGroups(), groupStore.getSuggestedGroups()])
}
const addPost = (v?: IPost) => {
  if (v) postList.value?.addPost(v)
}

const fetchPersonProfile = async (personId) => {
  loading.value = true
  try {
    const person = await $person.getPersonById(personId, true)
    if (person) {
      user.value = person
    }
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

const isMyProfile = computed(() => props.personId == $user?.user?.id ?? false)

onMounted(() => {
  const route = useRoute()
  if (route.query.pending == 'true' && isMyProfile.value) {
    stateType.value.title = 'group.pending_posts'
    stateType.value.type = PostStates.WAITING_TO_BE_PUBLISHED
  }
})
const stateType = ref({
  title: 'group.all_posts',
  type: isMyProfile.value ? null : PostStates.PUBLISHED,
})

const postParams = computed(() => {
  if (user.value) {
    const { id } = user.value
    return {
      authorIds: [Number(id)],
      states: stateType.value && stateType.value.type !== null ? [stateType.value.type] : null,
    }
  }
  return {}
})

const getPersonData = async () => {
  if (props.personId) {
    await fetchPersonProfile(props.personId)
  } else {
    user.value = useAuthStore().user
  }
}

onMounted(() => {
  getPersonData()
  fetchGroups()
})

watch(() => props.personId, getPersonData)
</script>

<style scoped lang="scss">
.profile-page {
  --at-apply: 'py-6 mx-auto w-full md:max-w-180 md:mx-4';
}
</style>
