<template>
  <div class="block md:absolute md:top-36 left-4">
    <div class="sidebar" @mouseenter="!md ? (extended = true) : ''" @mouseleave="extended = false">
      <router-link v-for="(item, index) in menu" :key="index" :to="item.to" class="sidebar-item">
        <i :class="item.icon" />
        <div v-show="extended">{{ item.label }}</div>
      </router-link>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { PropType } from 'vue'
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
const route = useRoute()
const extended = ref(false)
const { t } = useI18n()
const md = useBreakpoints(breakpointsTailwind).smaller('md')
const id = computed(() => route.params.id)
const menu = computed(() => {
  if (!id.value) return []
  return [
    {
      label: t('moderation.published_posts'),
      icon: 'i-figma:list',
      to: computed(() => `/groups/${id.value}`),
    },
    {
      label: t('moderation.posts_moderation'),
      icon: 'i-figma:crown',
      to: computed(() => `/groups/${id.value}/posts-moderation`),
    },
    {
      label: t('moderation.admin_panel'),
      icon: 'i-figma:star',
      to: computed(() => `/groups/${id.value}/admin-panel`),
    },
    {
      label: t('moderation.manage_members'),
      icon: 'i-figma:users',
      to: computed(() => `/groups/${id.value}/manage-members`),
    },
    {
      label: t('moderation.reported_content'),
      icon: 'i-figma:flag-regular',
      to: computed(() => `/groups/${id.value}/reported-content`),
    },
    {
      label: t('moderation.groups_settings'),
      icon: 'i-figma:settings',
      to: computed(() => `/groups/${id.value}/group-settings`),
    },
  ]
})
</script>
<style scoped lang="scss">
.router-link-active {
  --at-apply: 'relative md:font-bold';
  &::after {
    --at-apply: 'content-none absolute -left-25% w-150% h-1 bg-primary -bottom-2 md:hidden';
  }
}
.sidebar {
  --at-apply: 'flex items-center w-full border border-bg-purple-light/50 mx-px justify-between px-4 py-6 md:border-none md:card-defaults md:flex-col md:items-start md:overflow-hidden md:px-6 md:py-10 md:top-4 md:space-y-4 md:mx-0 md:h-max md:sticky md:w-[72px] hover:w-full duration-250 ease-out';
  &-item {
    --at-apply: 'flex items-center';
    & i {
      --at-apply: 'min-w-7 min-h-7 md:min-w-6 md:h-6 bg-primary-light/50 md:bg-primary';
    }
    & div {
      --at-apply: 'md:ms-2 whitespace-nowrap text-primary';
    }
  }
}
</style>
