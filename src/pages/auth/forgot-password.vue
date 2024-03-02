<template>
  <ElevatedCard :elevated="false" :title="$t('auth.forgot_title')" :subtitle="$t('auth.forgot_subtitle')">
    <div class="w-full flex flex-col flex-none h-full">
      <form class="flex flex-col flex-1 justify-center" @submit.prevent="forgotPassword">
        <InputField :label="$t('auth.email')" :errors="v$.email.$errors">
          <template #leading>
            <div class="i-figma:mail sm:text-2xl text-base bg-primary"></div>
          </template>
          <p-input-text
            id="email"
            v-model="data.email"
            @blur="v$.email.$touch"
            :placeholder="$t('auth.email_placeholder')"
          />
        </InputField>
      </form>
      <div class="block mt-12 space-y-2">
        <PButton
          :loading="data.loading"
          class="btn-primary login-button"
          icon="i-fa6-solid:paper-plane  me-2"
          :label="$t('auth.send')"
          icon-pos="right"
          @click="validate"
        ></PButton>
        <CallToActionText
          class="text-center"
          :description="$t('auth.return_to')"
          :actionText="$t('auth.login')"
          :bold="true"
          to="/auth/login"
        />
      </div>
    </div>
    <vue-recaptcha
      size="invisible"
      ref="recaptcha"
      :sitekey="sitekey"
      @verify="forgotPassword"
      @expired="onCaptchaExpired"
    >
    </vue-recaptcha>
  </ElevatedCard>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@/utils/validators.utils'
import { useAuthStore } from '@/data/auth/auth.store'
import { VueRecaptcha } from 'vue-recaptcha'
const auth = useAuthStore()
const router = useRouter()
const recaptcha = ref()
const sitekey = import.meta.env.APP_SITEKEY
const data = reactive({
  loading: false,
  email: '',
})
const rules = {
  email: {
    required,
    email,
  },
}
const v$ = useVuelidate(rules, data, { $autoDirty: true })
const validate = async () => {
  if (!(await v$.value.$validate())) return
  recaptcha.value.execute()
}

const onCaptchaExpired = () => {
  recaptcha.value.reset()
}
const forgotPassword = async (token) => {
  try {
    data.loading = true
    await auth.forgotPassword({ email: data.email, captchaResponse: token, siteKey: sitekey })
    router.push('/auth/reset-password?email=' + data.email)
  } finally {
    onCaptchaExpired()
    data.loading = false
  }
}
</script>

<style scoped lang="scss">
.login-button {
  --at-apply: 'w-full h-12 flex-center-none text-lg font-semibold';
}
</style>
