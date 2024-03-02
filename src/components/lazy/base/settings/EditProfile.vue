<template>
  <div class="px-4 py-3 card-defaults lg:mx-0 lg:px-10 lg:py-6">
    <h3 class="font-bold text-lg text-text-primary mb-4 ms-4">{{ $t('profile_update.info') }}</h3>
    <form v-if="userData && userData.id">
      <div class="flex items-center">
        <InputField class="w-1/2 me-10" :label="$t('profile_update.firstname')" :errors="v$.firstName.$errors">
          <p-input-text
            id="firstName"
            v-model="form.firstName"
            :placeholder="$t('profile_update.firstname')"
            @blur="v$.firstName.$touch"
          ></p-input-text>
        </InputField>
        <InputField class="w-1/2" :label="$t('profile_update.lastname')" :errors="v$.lastName.$errors">
          <p-input-text
            id="lastName"
            v-model="form.lastName"
            :placeholder="$t('profile_update.lastname')"
            @blur="v$.lastName.$touch"
          ></p-input-text>
        </InputField>
      </div>
      <div class="px-6 mt-4 mb-6 text-xs text-text-secondary-light max-w-[540px]">
        {{ $t('profile_card.name_description') }}
      </div>
      <InputField :label="$t('profile_update.displayName')" :errors="v$.displayName.$errors" class="w-3/4">
        <p-input-text
          id="displayName"
          v-model="form.displayName"
          :placeholder="$t('profile_update.displayName')"
          @blur="v$.displayName.$touch"
        ></p-input-text>
      </InputField>
      <div class="px-6 mt-4 mb-6 text-xs text-text-secondary-light max-w-[550px]">
        {{ $t('profile_card.displayName_description') }}
      </div>
      <InputField :label="$t('profile_update.gender')" :errors="v$.gender.$errors" class="w-3/4">
        <p-dropdown
          id="gender"
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
      <InputField :label="$t('profile_update.location')" :errors="v$.cityId.$errors" class="mt-6 w-3/4">
        <p-dropdown
          id="location"
          :filter="true"
          v-model="form.cityId"
          :options="locations"
          optionLabel="name"
          optionValue="id"
          @blur="v$.cityId.$touch"
          :placeholder="$t('profile_update.location')"
        />
      </InputField>
      <InputField :label="$t('profile_update.birthDate')" :errors="v$.birthDate.$errors" class="mt-6 w-3/4">
        <p-calendar
          id="basic"
          v-model="form.birthDate"
          :placeholder="$t('profile_update.birthDate')"
          @blur="v$.birthDate.$touch"
          autocomplete="off"
          dateFormat="yy-mm-dd"
        />
      </InputField>
      <InputField :label="$t('profile_update.bio')" class="mt-6">
        <p-textarea
          id="bio"
          v-model="form.bio"
          :autoResize="true"
          :rows="3"
          :disable-outside-click-hide="true"
          :placeholder="$t('profile_update.bio_placeholder')"
          :maxlength="800"
        />
      </InputField>
    </form>
    <div class="mt-6">
      <hr class="border-gray-300 mb-4" />
      <PButton
        :loading="loading"
        :disabled="v$.$invalid && !v$.$anyDirty"
        @click="updateProfile"
        class="p-button-primary px-8"
        :label="$t('profile_update.save')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { required } from '@/utils/validators.utils'
import { useVuelidate } from '@vuelidate/core'
import type { ICity } from '@/data/cities/cities.interface'
import { useCitiesStore } from '@/data/cities/cities.store'
import { useAuthStore } from '@/data/auth/auth.store'
import { usePersonsStore } from '@/data/persons/persons.store'
import moment from 'moment-with-locales-es6'
const userData = useAuthStore().user

const form = ref({
  id: userData?.id ?? 0,
  firstName: userData?.firstName ?? '',
  lastName: userData?.lastName ?? '',
  birthDate: userData?.birthDate ?? '',
  gender: userData?.gender ?? '',
  cityId: userData?.cityId ?? 0,
  displayName: userData?.displayName ?? '',
  bio: userData?.bio ?? '',
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
    validateDate(strDate) {
      return moment(strDate).isValid()
    },
  },
  gender: {
    required,
  },
  displayName: {
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

const loading = ref(false)

const updateProfile = async () => {
  loading.value = true
  const sendData = JSON.parse(JSON.stringify(form.value))
  await usePersonsStore().updateProfile(sendData)
  loading.value = false
}

onMounted(async () => {
  await useCitiesStore().getCities()
  const { cities } = useCitiesStore()
  locations.value = cities
})
</script>
<style scoped lang="scss">
:deep(.label) {
  --at-apply: 'font-normal text-normal ps-6';
}
:deep(.p-inputtext) {
  --at-apply: 'ps-6';
}
</style>
