<template>
  <ElevatedCard :elevated="false" :title="$t('auth.login_title')" :subtitle="$t('auth.login_subtitle')">
    <div class="w-full flex flex-col flex-none h-full">
      <div class="flex flex-col flex-1 justify-center" @keyup.enter.prevent="login">
        <InputField :label="$t('auth.credentials_label')" :errors="v$.credential.$errors">
          <template #leading>
            <div class="i-figma:user sm:text-2xl text-base bg-primary"></div>
          </template>
          <p-input-text
            id="credential"
            v-model="data.credential"
            :placeholder="$t('auth.credentials_placeholder')"
            @blur="v$.credential.$touch"
          />
        </InputField>
        <InputField :label="$t('auth.password_label')" :errors="v$.password.$errors">
          <template #leading>
            <div class="i-figma:unlock sm:text-2xl text-base bg-primary"></div>
          </template>
          <p-password
            v-model="data.password"
            toggle-mask
            :feedback="false"
            :placeholder="$t('auth.password_placeholder')"
            @blur="v$.password.$touch"
          />
        </InputField>
        <div class="flex flex-none justify-between items-center sm:mt-2 sm:text-sm text-xs sm:ps-4 ps-8">
          <RouterLink to="/auth/forgot-password" class="inline-block text-primary font-normal hover:underline">
            {{ $t('auth.forgot_link') }}
          </RouterLink>
        </div>
      </div>
      <div class="block sm:mt-12 mt-4 sm:space-y-4 space-y-0">
        <PButton
          :loading="data.loading"
          class="btn-primary login-button"
          :label="$t('auth.login_button')"
          @click="login"
        />
      </div>
      <div>
        <SingleSignUp />
        <CallToActionText
          class="text-center"
          :description="$t('auth.dont_have_an_account')"
          :actionText="$t('auth.create_now')"
          :bold="true"
          to="/auth/signup"
        />
      </div>
    </div>
  </ElevatedCard>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, maxLength } from '@/utils/validators.utils'
import { useAuthStore } from '@/data/auth/auth.store'
const auth = useAuthStore()
const data = reactive({
  loading: false,
  credential: '',
  password: '',
  remember: true,
})
const rules = {
  credential: {
    required,
  },
  password: {
    required,
    minLength: minLength(8),
    maxLength: maxLength(20),
  },
}

const v$ = useVuelidate(rules, data, {
  $autoDirty: true,
})

const login = async () => {
  if (!(await v$.value.$validate())) return
  try {
    data.loading = true
    await auth.token({
      credential: data.credential,
      password: data.password,
    })
  } finally {
    data.loading = false
  }
}
</script>

<style scoped lang="scss">
.login-button {
  --at-apply: 'w-full h-12';
  --at-apply: 'flex-center-none sm:text-lg text-sm sm:font-semibold';
}
</style>
