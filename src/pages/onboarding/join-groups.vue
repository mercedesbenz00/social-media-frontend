<template>
  <div class="max-w-720px w-full">
    <UserHeader
      class="sm:mb-6 sm:ms-3 flex flex-col items-center justify-center mb-6"
      :title="$t('onboarding.join_groups_title')"
      :subtitle="$t('onboarding.join_groups_subtitle')"
    />
    <div class="text-error text-sm text-center" v-if="groupCount < minGroups">
      {{ $t('onboarding.join_groups_notif') }}
    </div>
    <div class="tab max-w-[720px] mx-auto mt-6">
      <group-tabs />
    </div>
    <SetupPagination :loading="loading" class="mt-4 w-full max-w-[320px] mx-auto" :options="options" />
  </div>
</template>
<route lang="yaml">
meta:
  layout: onboarding
</route>
<script setup lang="ts">
import { useOnboardingStore } from '@/data/onboarding/onboarding.store'

const router = useRouter()
const $onboarding = useOnboardingStore()
const minGroups = import.meta.env.APP_MIN_GROUPS
const groupCount = computed(() => $onboarding.groupsCount)
const loading = ref(false)
const { t } = useI18n()

const options = computed(() => ({
  nextOptions: {
    label: t('user.next'),
    icon: '',
    disabled: groupCount.value < minGroups,
  },
  onNext: () => {
    loading.value = true
    $onboarding.state = 'REGISTRATION_COMPLETED'
    router.push('/onboarding/invite-friends')
    loading.value = false
  },
  previousOptions: {
    label: t('user.back'),
  },
  onPrevious: () => {
    router.push('/onboarding/interests')
  },
  center: true,
}))
</script>

<style scoped lang="scss">
:deep(.btn-next) {
  --at-apply: 'w-full h-12 text-lg';
}
:deep(.btn-back) {
  --at-apply: 'font-normal text-sm';
}
</style>
<style lang="scss">
.tab {
  .p-tabview-nav li {
    --at-apply: 'rounded-2xl';
  }
  .p-tabview-nav-content {
    .p-tabview-nav {
      --at-apply: 'flex justify-center border-none bg-bg-primary-light rounded-2xl p-3';
    }

    .p-tabview-nav-link {
      --at-apply: '!bg-bg-primary-light !rounded-none !border-none !px-3 !py-3 !font-light !text-sm';
    }
    .p-highlight {
      .p-tabview-nav-link {
        --at-apply: '!text-text-primary !rounded-2xl !font-semibold';
        background-color: rgba(var(--primary-color), 0.2) !important;
      }
    }
  }
  .p-tabview-panels {
    --at-apply: 'bg-bg-primary-light px-0';
  }
}

.dark-mode {
  .tab {
    .p-tabview-nav-content {
      .p-highlight {
        .p-tabview-nav-link {
          background-color: rgba(var(--primary-color), 1) !important;
        }
      }
    }
  }
}
</style>
