<template>
  <div>
    <div class="mb-4 font-bold text-3xl hidden justify-between px-8 lg:flex">
      <span>{{ $t('manage_interests.title') }}</span>
    </div>
    <p class="pb-4 text-sm text-text-secondary-light ps-4 lg:ps-8">
      {{ $t('manage_interests.subtitle') }}
    </p>
    <div class="card-defaults">
      <onboarding-interests-tabs @selected="selectedCategories = $event" :active-tab="0" />
      <div class="w-full p-4 display-flex justify-end">
        <PButton
          class="w-full lg:w-auto"
          @click="save"
          :disabled="invalid"
          :label="$t('profile_update.save')"
          :loading="loading"
        />
      </div>
    </div>
  </div>
</template>
<route lang="yaml">
meta:
  layout: settings
</route>
<script setup lang="ts">
import { useOnboardingStore } from '@/data/onboarding/onboarding.store'
import type { ICategory } from '@/data/onboarding/onboarding.interface'
import { useDeviceDetector } from '@/utils/device-detector.utils'
const selectedCategories = ref<ICategory[]>([])
const minInterests = import.meta.env.APP_MIN_INTERESTS
const loading = ref(false)

const invalid = computed(() => selectedCategories.value.length < 5)

async function selectedCircles(selectedCircles: ICategory[]) {
  selectedCategories.value = selectedCircles
}

async function save() {
  try {
    loading.value = true
    const categoryIds: string = selectedCategories.value.map((category) => +category.id).toString()
    await useOnboardingStore().assignCategories({ categoryIds })
  } finally {
    loading.value = false
  }
}
</script>
<style></style>
