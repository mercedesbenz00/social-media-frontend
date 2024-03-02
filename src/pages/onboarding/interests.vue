<template>
  <div class="container">
    <UserHeader
      class="sm:mb-6 sm:ms-3 flex flex-col items-center justify-center mb-6"
      :title="t('onboarding.interests_title')"
      :subtitle="t('onboarding.interests_title')"
    />
    <OnboardingInterestsTabs
      @selected="selectedCategories = $event"
      class="w-full h-full manage-interest"
      :min="minInterests"
    />
    <SetupPagination class="mt-4 continue" :options="options" :loading="loading" />
  </div>
</template>
<route lang="yaml">
meta:
  layout: onboarding
</route>
<script setup lang="ts">
import { useOnboardingStore } from '@/data/onboarding/onboarding.store'
import type { ICategory } from '@/data/onboarding/onboarding.interface'

const router = useRouter()
const $onboarding = useOnboardingStore()
const minInterests = import.meta.env.APP_MIN_INTERESTS
const { t } = useI18n()
const loading = ref(false)
const selectedCategories = ref<ICategory[]>([])
const interestsCount = computed(() => $onboarding.interestsCount !== 0 ? $onboarding.interestsCount : selectedCategories.value.length)
const options = computed(() => ({
  nextOptions: {
    label: t('user.next'),
    disabled: interestsCount < minInterests,
    icon: '',
  },
  previousOptions: {
    label: t('user.back'),
  },
  onPrevious: () => {
    router.push('/onboarding/form')
  },
  center: true,
  onNext: async () => {
    try {
      loading.value = true
      if (selectedCategories.value) {
        const categoryIds: string = selectedCategories.value.map((category) => +category.id).toString()
        await $onboarding.assignCategories({ categoryIds, onboarding: true })
        $onboarding.interestsCount = selectedCategories.value.length
      }
      $onboarding.state = 'INTERESTS_PROVIDED'
      router.push('/onboarding/join-groups')
    } finally {
      loading.value = false
    }
  },
}))
</script>

<style lang="scss" scoped>
:deep(.btn-next) {
  --at-apply: 'w-full h-12 text-lg';
}
:deep(.btn-back) {
  --at-apply: 'font-normal text-sm';
}
.container {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  margin: auto;

  h1 {
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 32px;
    color: var(--primary-color);
    margin-top: 56px;
  }

  p {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: var(--secondary-color);
  }
}
</style>
