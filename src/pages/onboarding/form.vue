<template>
  <div class="max-w-360px w-full">
    <UserHeader
      class="flex flex-col items-center justify-center mb-6"
      :title="$t('user.your_info')"
      :subtitle="$t('user.enter_info')"
    />
    <form>
      <InputField :label="$t('profile_update.firstname')" :errors="v$.firstName.$errors">
        <p-input-text
          id="firstName"
          v-model="form.firstName"
          :placeholder="$t('profile_update.firstname')"
          @blur="v$.firstName.$touch"
        ></p-input-text>
      </InputField>
      <InputField :label="$t('profile_update.lastname')" :errors="v$.lastName.$errors" class="mt-6">
        <p-input-text
          id="firstName"
          v-model="form.lastName"
          :placeholder="$t('profile_update.lastname')"
          @blur="v$.lastName.$touch"
        ></p-input-text>
      </InputField>
      <InputField :label="$t('profile_update.birthDate')" :errors="v$.birthDate.$errors" class="mt-6">
        <p-calendar
          id="basic"
          v-model="form.birthDate"
          class="flex items-center justify-center"
          :placeholder="$t('profile_update.birthDate')"
          @blur="v$.birthDate.$touch"
          autocomplete="off"
          dateFormat="yy-mm-dd"
        />
        <template #trailing>
          <div class="i-figma:calendar sm:text-2xl text-base bg-primary"></div>
        </template>
      </InputField>
      <InputField :label="$t('profile_update.gender')" :errors="v$.gender.$errors" class="mt-6">
        <p-dropdown
          id="gender"
          class="flex items-center justify-center"
          v-model="form.gender"
          :options="genderOptions"
          optionLabel="title"
          optionValue="id"
          @blur="v$.gender.$touch"
          :placeholder="$t('profile_update.gender')"
        >
          <template #value="slotProps">
            <span v-if="slotProps.value">{{ $t(getGenderTitle(slotProps.value)) }}</span>
            <span v-else>
              {{ slotProps.placeholder }}
            </span>
          </template>
          <template #option="slotProps">
            <span>{{ $t(slotProps.option.title) }}</span>
          </template>
        </p-dropdown>
      </InputField>
      <InputField :label="$t('profile_update.location')" :errors="v$.cityId.$errors" class="mt-6">
        <p-dropdown
          id="location"
          class="flex items-center justify-center"
          :filter="true"
          v-model="form.cityId"
          :options="locations"
          optionLabel="name"
          optionValue="id"
          @blur="v$.cityId.$touch"
          :placeholder="$t('profile_update.location')"
        />
      </InputField>
    </form>
    <SetupPagination :loading="loading" class="mt-6 continue" :options="options" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: onboarding
</route>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required } from '@/utils/validators.utils'
import type { ICity } from '@/data/cities/cities.interface'
import { useCitiesStore } from '@/data/cities/cities.store'
import { usePersonsStore } from '@/data/persons/persons.store'
import { useAuthStore } from '@/data/auth/auth.store'
import { useOnboardingStore } from '@/data/onboarding/onboarding.store'

const { t } = useI18n()
const router = useRouter()
const $onboarding = useOnboardingStore()
const loading = ref(false)
const options = computed(() => ({
  nextOptions: {
    label: t('user.continue'),
  },
  center: true,
  onNext: async () => {
    loading.value = true
    if (!(await v$.value.$validate())) {
      loading.value = false
      return
    }
    try {
      const response = await usePersonsStore().updatePerson(form.value, { onboarding: true })
      if (response) {
        $onboarding.state = 'INFO_PROVIDED'
        router.push('/onboarding/interests')
        loading.value = false
      }
    } finally {
      loading.value = false
    }
  },
}))

const form = ref({
  id: 0,
  firstName: '',
  lastName: '',
  cityId: 0,
  birthDate: '' as any,
  gender: '',
})

const rules = {
  firstName: {
    required,
  },
  lastName: {
    required,
  },
  cityId: {
    required,
  },
  birthDate: {
    required,
  },
  gender: {
    required,
  },
}

const v$ = useVuelidate(rules, form, {
  $autoDirty: true,
})

const genderOptions = ref([
  { title: 'profile_update.gender_type.male', id: 'MALE' },
  { title: 'profile_update.gender_type.female', id: 'FEMALE' },
  { title: 'profile_update.gender_type.prefer_not_to_disclose', id: 'UNKNOWN' },
])

const getGenderTitle = (val) => genderOptions.value.filter((gt) => gt.id === val)[0].title

const locations = ref([] as Array<ICity>)

const fetchUser = async () => {
  const response = await useAuthStore().me()

  if (response) {
    form.value = {
      id: response.id ?? 0,
      firstName: response.firstName ?? '',
      lastName: response.lastName ?? '',
      gender: response.gender ?? '',
      birthDate: response.birthDate ?? '',
      cityId: response.cityId ?? 0,
    }

    await useCitiesStore().getCities()
    const { cities } = useCitiesStore()
    locations.value = cities
  }
}

onMounted(fetchUser)
</script>

<style lang="scss">
.profile-update {
  border-radius: 16px !important;
  .p-dialog-header {
    border-top-left-radius: 16px !important;
    border-top-right-radius: 16px !important;
  }
  .p-dialog-footer {
    border-bottom-left-radius: 16px !important;
    border-bottom-right-radius: 16px !important;
  }

  .label {
    --at-apply: '!h-auto !font-normal';
  }
}
.continue button {
  --at-apply: 'w-full h-12 mt-4';
}
</style>
