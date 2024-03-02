<template>
  <ElevatedCard :elevated="false" :title="$t('auth.reset_header')" :subtitle="$t('auth.forget_message')">
    <div class="w-full flex flex-col flex-none h-full">
      <form class="flex flex-col flex-1 justify-center" @submit.prevent @keyup.enter.prevent="next">
        <InputField :label="$t('auth.email')" :errors="v$.credential.$errors">
          <template #leading>
            <div class="i-figma:mail text-2xl"></div>
          </template>
          <p-input-text
            id="credential"
            v-model="data.credential"
            autocomplete="off"
            :placeholder="$t('auth.email_placeholder')"
            @blur="v$.credential.$touch"
          ></p-input-text>
        </InputField>
        <InputField :label="$t('auth.code')" :errors="v$.code.$errors">
          <template #leading>
            <div class="i-figma:code text-2xl"></div>
          </template>
          <p-input-text
            id="code"
            v-model="data.code"
            autocomplete="off"
            :placeholder="$t('auth.code_placeholder')"
            @blur="v$.code.$touch"
          ></p-input-text>
        </InputField>
        <InputField class="mt-6" :label="$t('auth.password_label')" :errors="v$.password.$errors">
          <template #leading>
            <div class="i-figma:unlock text-2xl"></div>
          </template>
          <p-password
            ref="password"
            v-model="data.password"
            toggle-mask
            autocomplete="off"
            :prompt-label="$t('auth.password_enter')"
            :weak-label="$t('auth.password_weak')"
            :medium-label="$t('auth.password_medium')"
            :strong-label="$t('auth.password_strong')"
            :placeholder="$t('auth.password_placeholder')"
            @blur="v$.password.$touch"
          ></p-password>
        </InputField>
        <InputField class="mt-6" :label="$t('auth.confirm_password_label')" :errors="v$.confirmPassword.$errors">
          <template #leading>
            <div class="i-figma:unlock text-2xl"></div>
          </template>
          <p-password
            v-model="data.confirmPassword"
            toggle-mask
            autocomplete="off"
            :feedback="false"
            :placeholder="$t('auth.password_placeholder')"
            @blur="v$.confirmPassword.$touch"
          ></p-password>
        </InputField>
      </form>
      <div class="block mt-6 space-y-4">
        <PButton
          :loading="data.loading"
          class="btn-primary login-button"
          :label="$t('auth.reset_header')"
          @click="validate()"
        ></PButton>
      </div>
    </div>
  </ElevatedCard>
  <vue-recaptcha
    size="invisible"
    ref="recaptcha"
    :sitekey="sitekey"
    @verify="resetPassword"
    @expired="onCaptchaExpired"
  >
  </vue-recaptcha>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, sameAs, match } from '@/utils/validators.utils'
import { useAuthStore } from '@/data/auth/auth.store'
import { VueRecaptcha } from 'vue-recaptcha'

const $auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const recaptcha = ref()
const sitekey = import.meta.env.APP_SITEKEY
const data = reactive({
  loading: false,
  credential: route.query['email'] ?? '',
  code: route.query['code'] ?? '',
  password: '',
  confirmPassword: '',
  remember: true,
  regexPass: /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})./,
})
const onCaptchaExpired = () => {
  recaptcha.value.reset()
}
const rules = {
  credential: {
    required,
  },
  code: {
    required,
  },
  password: {
    required,
    minLength: minLength(6),
    match: match(data.regexPass),
  },
  confirmPassword: {
    sameAs: sameAs(computed(() => data.password)),
  },
}
const v$ = useVuelidate(rules, data, { $autoDirty: true })
const validate = async () => {
  if (!(await v$.value.$validate())) return
  recaptcha.value.execute()
}

const resetPassword = async (token) => {
  onCaptchaExpired()
  try {
    data.loading = true
    await $auth.resetPassword({
      email: data.credential,
      code: data.code,
      password: data.password,
      confirmationPassword: data.confirmPassword,
      captchaResponse: token,
      siteKey: sitekey,
    })
    router.push(route.query.redirect?.toString() ?? '/')
  } finally {
    data.loading = false
  }
}
</script>

<style scoped lang="scss">
.login-button {
  --at-apply: 'w-full h-12 flex-center-none text-lg font-semibold ';
}
</style>
