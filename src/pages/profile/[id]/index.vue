<template>
  <div class="flex flex-col gap-y-4">
    <router-link class="flex items-center gap-x-2" to="/">
      <i class="i-figma:arrow-left w-5 h-5"></i>
      <div class="text-lg font-bold">{{ data.person.displayName }}</div>
    </router-link>
    <profile-header :data="data" @update="emits('update')" />
    <post-create v-if="data.me" @on-success="addPost" />
    <div class="flex justify-between items-center my-4 px-2 md:px-0">
      <div class="text-xl font-bold">{{ $t('profile.post_activities') }}</div>
      <post-state-menu v-model="stateType" v-if="data.me" />
    </div>
    <PostList :params="params" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: profile
</route>

<script setup lang="ts">
import { PostStates } from '@/data/posts/posts.interface'
import type { PropType } from 'vue'

const postList = ref()
const route = useRoute()
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const stateType = ref({
  title: 'group.all_posts',
  type: props.data.me ? null : PostStates.PUBLISHED,
})

const params = computed(() => {
  return {
    authorIds: [Number(props.data.id)],
    states: stateType.value && stateType.value.type !== null ? [stateType.value.type] : null,
  }
})
const emits = defineEmits(['update'])
const addPost = (v) => {
  if (v) postList.value?.addPost(v)
}
onMounted(() => {
  const route = useRoute()
  if (route.query.pending == 'true' && props.data.me) {
    stateType.value.title = 'group.pending_posts'
    stateType.value.type = PostStates.WAITING_TO_BE_PUBLISHED
  }
})
</script>
