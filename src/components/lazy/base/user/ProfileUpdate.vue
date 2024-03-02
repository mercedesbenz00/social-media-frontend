<template>
  <PDialog
    class="profile-update"
    :draggable="false"
    v-model:visible="display"
    :breakpoints="{ '960px': '720px', '640px': '90vw' }"
    :style="{ width: '50vw' }"
  >
    <template #header>
      <span class="font-bold text-lg text-text-primary">{{ $t('profile_update.title') }}</span>
    </template>
    <div class="sticky top-0 z-10">
      <hr class="border-gray-300 mb-4" />
    </div>
    <form v-if="props.userData && props.userData.id">
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
      <InputField :label="$t('profile_update.location')" :errors="v$.cityId.$errors" class="mt-6">
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
      <InputField :label="$t('profile_update.birthDate')" :errors="v$.birthDate.$errors" class="mt-6">
        <p-calendar
          id="basic"
          v-model="form.birthDate"
          :placeholder="$t('profile_update.birthDate')"
          @blur="v$.birthDate.$touch"
          autocomplete="off"
          dateFormat="yy-mm-dd"
        />
      </InputField>
      <InputField :label="$t('profile_update.email')" :errors="v$.email.$errors" class="mt-6">
        <p-input-text
          id="email"
          v-model="form.email"
          :placeholder="$t('profile_update.email')"
          @blur="v$.email.$touch"
        ></p-input-text>
      </InputField>
      <InputField :label="$t('profile_update.gender')" :errors="v$.gender.$errors" class="mt-6">
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
      <InputField :label="$t('profile_update.displayName')" :errors="v$.displayName.$errors" class="mt-6">
        <p-input-text
          id="displayName"
          v-model="form.displayName"
          :placeholder="$t('profile_update.displayName')"
          @blur="v$.displayName.$touch"
        ></p-input-text>
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
      <div class="text-right">{{ $t('profile_update.bio_charaters_limit', { length: remainingCharacters }, 0) }}</div>
    </form>
    <template #footer>
      <div class="mt-6">
        <hr class="border-gray-300 mb-4" />
        <PButton
          :loading="loading"
          @click="updateProfile"
          class="p-button-primary px-8"
          :label="$t('profile_update.save')"
        />
      </div>
    </template>
  </PDialog>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@/utils/validators.utils'
import type { PropType } from 'vue'
import type { ICity } from '@/data/cities/cities.interface'
import { useCitiesStore } from '@/data/cities/cities.store'
import { usePersonsStore } from '@/data/persons/persons.store'
import moment from 'moment-with-locales-es6'
import type { IUser } from '@/data/auth/auth.interface'

const display = ref(false)
const show = () => {
  initializeForm()
  display.value = true
}

const emit = defineEmits<{
  (event: 'update', data: any): void
}>()

const props = defineProps({
  userData: {
    type: Object as PropType<IUser | undefined | null>,
    default: undefined,
  },
})

const form = ref({
  id: 0,
  firstName: '',
  lastName: '',
  cityId: 0,
  birthDate: '' as any,
  email: '',
  gender: '',
  displayName: '',
  bio: '',
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
  email: {
    required,
    email,
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

onMounted(async () => {
  await useCitiesStore().getCities()
  const { cities } = useCitiesStore()
  locations.value = cities
})

const initializeForm = () => {
  form.value = {
    id: props.userData?.id ?? 0,
    firstName: props.userData?.firstName ?? '',
    lastName: props.userData?.lastName ?? '',
    birthDate: props.userData?.birthDate ?? '',
    email: props.userData?.email ?? '',
    gender: props.userData?.gender ?? '',
    cityId: props.userData?.cityId ?? 0,
    displayName: props.userData?.displayName ?? '',
    bio: props.userData?.bio ?? '',
  }
}

const loading = computed(() => {
  return usePersonsStore().loading
})

const remainingCharacters = computed(() => {
  return 800 - (form.value?.bio?.length || 0)
})

const updateProfile = async () => {
  if (!(await v$.value.$validate())) return
  const user = await usePersonsStore().updateProfile(form.value)
  if (user?.id) {
    emit('update', user)
    display.value = false
  }
}

defineExpose({ show })
</script>

<style lang="scss">
.profile-update {
  border-radius: 16px !important;
  z-index: 99999;
  .p-dialog-header {
    border-top-left-radius: 16px !important;
    border-top-right-radius: 16px !important;
  }
  .p-dialog-footer {
    border-bottom-left-radius: 16px !important;
    border-bottom-right-radius: 16px !important;
  }

  .p-datepicker-trigger {
    --at-apply: 'flex-1';
  }

  .label {
    --at-apply: '!h-auto !font-normal';
  }

  .post-textarea {
    --at-apply: '!h-[102px] !overflow-auto';
  }

  .icon {
    --at-apply: 'flex items-start';
  }
}
</style>
