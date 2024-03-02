<template>
  <div class="card-defaults p-4">
    <h3 class="font-bold text-lg text-text-primary mb-4 ms-4">{{ $t('update_username.title') }}</h3>
    <form v-if="userData && userData.id">
      <InputField :label="$t('update_username.username')" :errors="v$.username.$errors">
        <p-input-text
          id="firstName"
          v-model="form.username"
          :placeholder="$t('update_username.username')"
          @blur="v$.username.$touch"
        ></p-input-text>
      </InputField>
      <p class="pt-4 text-sm text-text-secondary-light ms-4">
        {{ $t('settings.new_username_notif') }}
      </p>
    </form>
    <div class="mt-6">
      <hr class="border-gray-300 mb-4" />
      <PButton
        :loading="loading"
        :disabled="v$.$invalid || noChangeInUserName"
        @click="updateProfile"
        class="p-button-primary px-8"
        :label="$t('update_username.title')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { required, updateUserNameValidation } from '@/utils/validators.utils'
import { useVuelidate } from '@vuelidate/core'
import { helpers } from '@vuelidate/validators'
import { useAuthStore } from '@/data/auth/auth.store'
import { usePersonsStore } from '@/data/persons/persons.store'
const { t } = useI18n()
const userData = useAuthStore().user

const usernameCheck = async (val) => {
  if (userData?.username === val) {
    return false
  } else {
    return await usePersonsStore().checkUserName(val)
  }
}

const form = ref({
  username: userData?.username || '',
})

const noChangeInUserName = computed(() => userData?.username === form.value.username)

const rules = {
  username: {
    required,
    updateUserNameValidation,
    usernameValid: helpers.withMessage(() => {
      if (userData?.username === form.value.username) {
        return ''
      }
      return t('profile_update.username_is_not_available')
    }, helpers.withAsync(usernameCheck)),
  },
}

const v$ = useVuelidate(rules, form, { $autoDirty: true })

const loading = ref(false)

const updateProfile = async () => {
  if (!userData?.id) return
  try {
    loading.value = true

    await usePersonsStore().updateProfile({ id: userData.id, ...form.value })
  } finally {
    loading.value = false
  }
}
</script>
