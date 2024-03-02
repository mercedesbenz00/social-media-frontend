<template>
  <div class="flex flex-col items-center justify-center mt-4 md:mt-10">
    <div :class="data.icon" class="w-60px h-50px md:w-[122px] md:h-[108px] bg-primary-light/25 mb-4 md:mb-10"></div>
    <div class="font-bold text-xl md:text-4xl">{{ data.title }}</div>
    <div v-if="data.subtitle" class="text-sm md:text-lg mt-2 text-center" v-html="data.subtitle"></div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  state: {
    type: String,
    required: true,
  },
})
const { t } = useI18n()
const data = computed(() => {
  return {
    title: titles[props.state] ?? '',
    subtitle: subtitles[props.state] ?? '',
    icon: icons[props.state] ?? '',
  }
})
const icons = {
  pending: 'i-figma:no-pending',
  rejected: 'i-figma:no-rejected',
  invitation: 'i-figma:no-invitation',
  invited: 'i-figma:no-invited',
  members: 'i-figma:no-members',
  muted: 'i-figma:no-muted',
  mutual: 'i-figma:no-mutual',
  reportedComments: 'i-figma:no-reported-comments',
  reportedPosts: 'i-figma:no-reported-posts',
  requests: 'i-figma:no-requests',
}
const titles = {
  pending: t('moderation.empty.pending.title'),
  rejected: t('moderation.empty.rejected.title'),
  invitation: t('moderation.empty.invitation.title'),
  invited: t('moderation.empty.invited.title'),
  members: t('moderation.empty.members.title'),
  muted: t('moderation.empty.muted.title'),
  mutual: t('moderation.empty.mutual.title'),
  reportedComments: t('moderation.empty.reported_comments.title'),
  reportedPosts: t('moderation.empty.reported_posts.title'),
  requests: t('moderation.empty.requests.title'),
}
const subtitles = {
  pending: t('moderation.empty.pending.subtitle'),
  rejected: t('moderation.empty.rejected.subtitle'),
  members: t('moderation.empty.members.subtitle'),
  reportedComments: t('moderation.empty.reported_comments.subtitle'),
  reportedPosts: t('moderation.empty.reported_posts.subtitle'),
}
</script>
