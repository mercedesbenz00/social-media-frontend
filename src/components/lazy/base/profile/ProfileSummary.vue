<template>
  <div class="flex justify-center md:justify-start items-center gap-x-4">
    <component
      v-for="(item, index) in items"
      :key="index"
      :is="item.to ? 'router-link' : 'div'"
      class="flex items-center space-x-1"
      :to="item.to"
      :class="{ '!hidden': item.disabled }"
    >
      <i :class="item.icon" class="w-4 h-4 bg-primary"></i>
      <div v-if="item.value" class="text-xs">{{ item.value }}</div>
      <div v-if="item.title" class="text-xs hidden md:block">{{ item.title }}</div>
    </component>
  </div>
</template>
<script setup lang="ts">
import type { IPerson } from '@/data/persons/persons.interface'
import type { PropType } from 'vue'
const { t } = useI18n()

const props = defineProps({
  person: {
    type: Object as PropType<IPerson>,
    required: true,
  },
  me: {
    type: Boolean,
    required: true,
  },
})
const items = computed(() => {
  return [
    {
      title: t('profile.posts'),
      icon: 'i-figma:edit-2',
      value: props.person.postCount ?? 0,
    },
    {
      title: t('profile.followers'),
      icon: 'i-figma:heart',
      value: props.person.followerCount ?? 0,
      to: `/profile/${props.person.id}/followers`,
    },
    {
      title: t('profile.following'),
      icon: 'i-figma:user-plus',
      value: props.person.followingCount ?? 0,
      to: `/profile/${props.person.id}/following`,
    },
    {
      title: t('profile.groups'),
      icon: 'i-figma:users',
      value: props.person.groupCount ?? 0,
      to: `/profile/${props.person.id}/groups`,
    },
    {
      title: t('profile.collections'),
      icon: 'i-figma:copy',
      to: `/profile/${props.person.id}/collections`,
      disabled: !props.me,
    },
  ]
})
</script>
