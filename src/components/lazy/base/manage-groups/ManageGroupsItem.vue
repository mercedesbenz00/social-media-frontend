<template>
  <div class="card">
    <div class="card-item">
      <Avatar class="me-2 !w-32px !h-32px" :group-id="group.id" />
      <div class="max-w-150px truncate overflow-hidden">{{ group.name }}</div>
    </div>
    <component
      v-for="(item, index) in actionItems"
      :key="index"
      :to="item.to"
      class="card-item"
      :class="item.class"
      :is="item.to ? 'router-link' : 'div'"
    >
      <i class="me-2 bg-primary-light/50" :class="item.icon"></i>
      <div :class="item.class?.includes('p-button') ? 'text-sm' : 'text-xs'" v-if="item.title !== ''">
        {{ item.title }}
      </div>
    </component>
  </div>
</template>
<script setup lang="ts">
import type { IGroup } from '@/data/groups/groups.interface'
import type { PropType } from 'vue'

const props = defineProps({
  group: {
    type: Object as PropType<any>,
    required: true,
  },
})

const { t } = useI18n()
const actionItems = computed(() => {
  return [
    {
      title: '',
      icon: props.group.accessType == 'PRIVATE' ? 'i-figma:lock' : 'i-figma:global',
      to: '',
    },
    {
      title: props.group.stats.membersCount ?? 0,
      icon: 'i-figma:users',
      to: '/groups/' + props.group.id + '/manage-members',
    },
    {
      title: `${props.group.stats.pendingPostsCount ?? 0} ${t('manage_groups.pending_posts')}`,
      icon: 'i-figma:copy',
      to: '/groups/' + props.group.id + '/posts-moderation',
    },
    {
      title: `${props.group.stats.pendingJoinRequests ?? 0} ${t('manage_groups.join_requests')}`,
      icon: props.group.stats.pendingJoinRequests > 0 ? 'i-figma:user-plus-with-circle' : 'i-figma:user-plus',
      to: '/groups/' + props.group.id + '/manage-members',
    },
    {
      title: t('manage_groups.manage'),
      class: 'p-button p-component btn-primary justify-center',
      to: '/groups/' + props.group.id,
    },
  ]
})
</script>
<style scoped lang="scss">
.card {
  --at-apply: 'py-6 px-4 rounded-2xl bg-bg-primary border border-bg-purple-light/50 text-sm grid grid-cols-6 gap-x-2';
  grid-template-columns: minmax(100px, 150px) 1.5rem 3rem 1fr 1fr 1fr;
  &-item {
    --at-apply: 'flex items-center';
  }
}
</style>
