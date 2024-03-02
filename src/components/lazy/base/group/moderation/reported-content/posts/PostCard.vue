<template>
  <div class="card">
    <div class="flex items-center">
      <Avatar :person-id="post.authorId" class="w-10 h-10" />
      <div class="ms-2 w-full">
        <div class="font-bold">{{ post.authorDisplayName }}</div>
        <div class="text-text-secondary-light text-xs">{{ moment(post.createdAt).locale(locale).fromNow() }}</div>
      </div>
    </div>
    <div class="flex justify-between items-center text-xs mt-2">
      <div class="flex items-center">
        <div class="text-text-secondary-light">Posted in</div>
        <Avatar :group-id="group.id" class="w-6 h-6 mx-2" />
        <div class="font-bold">{{ group.name?.length > 12 ? group.name?.slice(0, 12) + '...' : group.name }}</div>
      </div>
      <RouterLink :to="'/posts/' + post.id" class="text-info">View post -></RouterLink>
    </div>
    <PostItemBody :post="post" />
    <div class="text-xs md:text-sm" v-if="post.content">{{ post.content }}</div>
    <div class="flex items-center justify-between">
      <PersonMute class="mt-2" :person-id="post.authorId" :display-name="post.authorDisplayName" />
      <div
        @click="emits('open-comments')"
        class="block text-info cursor-pointer text-xs underline underline-offset-2 md:hidden"
      >
        Read the comment
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { IPost } from '@/data/posts/posts.interface'
import type { PropType } from 'vue'
import moment from 'moment-with-locales-es6'
import type { IGroup } from '@/data/groups/groups.interface'
import { useGroupsStore } from '@/data/groups/groups.store'

const emits = defineEmits(['open-comments'])
const $groups = useGroupsStore()
const { locale } = useI18n()
const props = defineProps({
  post: {
    type: Object as PropType<IPost>,
    required: true,
  },
})

const group = ref({} as IGroup)
const fetchGroup = async () => {
  group.value = await $groups.getGroupById(props.post.userGroupId)
}

onMounted(fetchGroup)
</script>
<style scoped lang="scss">
.card {
  --at-apply: 'p-4 border border-bg-purple-light/50 mx-px md:card-defaults md:mx-0 md:border-none';
}
</style>
