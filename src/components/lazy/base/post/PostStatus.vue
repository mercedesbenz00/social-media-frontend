<template>
  <div class="flex items-center gap-2">
    <div v-if="isPinned" class="tag">{{ $t('post.pinned') }}</div>
    <div v-if="tagStatuses.includes(post.state)" class="tag">{{ $t(`post.${post.state.toLowerCase()}`) }}</div>
    <template v-if="groupName">
      <span class="assistive-text">{{ $t('post.posted_in') }}</span>
      <Avatar :src="groupAvatar" :group-id="group.id" class="w-7 h-7" />
      <router-link @click.stop :to="`/groups/${group.id}`">
        <span class="bold text-text-primary text-xs font-semibold">
          {{ groupName.length > 15 ? `${groupName.substring(0, 15)}...` : groupName }}
        </span>
      </router-link>
    </template>
  </div>
</template>

<script setup lang="ts">
import { PostStates } from '@/data/posts/posts.interface'
import type { IPost } from '@/data/posts/posts.interface'
import type { PropType } from 'vue'
import type { IGroup } from '@/data/groups/groups.interface'

const props = defineProps({
  post: { type: Object as PropType<IPost>, required: true },
  group: {
    type: Object as PropType<IGroup>,
    required: true,
  },
})

const groupAvatar = computed(() => props.group.avatar?.path ?? undefined)
const groupName = computed(() => props.group.name ?? undefined)
const isPinned = computed(() => props.post.pinned ?? false)

const tagStatuses = ref([PostStates.WAITING_TO_BE_PUBLISHED, PostStates.DELETED, PostStates.REJECTED, PostStates.DRAFT])
</script>

<style lang="scss" scoped>
.tag {
  --at-apply: 'text-text-primary/60 text-xs px-2 py-1 rounded-full border-gray-400 border-1';
}
.assistive-text {
  --at-apply: 'text-xs text-text-primary/60 py-0.5 px-2 rounded-lg';
}
</style>
