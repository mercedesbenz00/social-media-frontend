<template>
  <div>
    <UserHeader
      class="sm:mb-6 sm:ms-3 flex flex-col items-center justify-center mb-6"
      :title="t('settings.invite_friend')"
      :subtitle="t('settings.invite_friend_subtitle')"
    />
    <InviteFriend class="invite" />
    <SetupPagination class="mb-4 w-full max-w-[320px] mx-auto" :options="options" />
  </div>
</template>
<route lang="yaml">
meta:
  layout: onboarding
</route>
<script setup lang="ts">
const { t } = useI18n()
const router = useRouter()
const options = computed(() => ({
  nextOptions: {
    label: t('user.next'),
    icon: '',
  },
  onNext: () => {
    router.push('/')
  },
  previousOptions: {
    label: t('user.back'),
  },
  onPrevious: '/onboarding/join-groups',
  center: true,
}))
</script>
<style scoped lang="scss">
:deep(.invite) {
  .action {
    --at-apply: 'mx-auto';
  }
}
:deep(.btn-next) {
  --at-apply: 'w-full h-12 text-lg';
}
:deep(.btn-back) {
  --at-apply: 'font-normal text-sm';
}
</style>
