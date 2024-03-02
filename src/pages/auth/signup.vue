<template>
  <ElevatedCard :elevated="false" :title="$t('auth.signup_title')" :subtitle="$t('auth.signup_subtitle')">
    <div class="w-full flex flex-col flex-none h-full">
      <div class="flex flex-col flex-1 justify-center" @keyup.enter.prevent="signup">
        <InputField :label="$t('auth.email')" :errors="v$.credential.$errors">
          <template #leading>
            <div class="i-figma:mail sm:text-2xl text-base bg-primary"></div>
          </template>
          <p-input-text
            autocomplete="off"
            id="credential"
            v-model="data.credential"
            @blur="v$.credential.$touch"
            :placeholder="$t('auth.email_placeholder')"
          />
        </InputField>
        <InputField class="mt-3" :label="$t('auth.password_label')">
          <template #leading>
            <div class="i-figma:unlock sm:text-2xl text-base bg-primary"></div>
          </template>
          <p-password
            v-model="data.password"
            ref="password"
            autocomplete="off"
            toggle-mask
            :prompt-label="$t('auth.password_enter')"
            :weak-label="$t('auth.password_weak')"
            :medium-label="$t('auth.password_medium')"
            :strong-label="$t('auth.password_strong')"
            :placeholder="$t('auth.password_placeholder')"
            @blur="v$.password.$touch"
            strongRegex="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#&()–{}:;',?/*~$^+=<>]).{8,20}$"
          >
            <template #footer>
              <div class="max-w-sm md:max-w-md w-full">
                <p v-for="error of v$.password.$errors" :key="error.$uid" class="text-error text-start text-xs">
                  {{ error.$message }}
                </p>
              </div>
            </template>
          </p-password>
        </InputField>
        <InputField class="mt-3" :label="$t('auth.confirm_password_label')">
          <template #leading>
            <div class="i-figma:unlock sm:text-2xl text-base bg-primary"></div>
          </template>
          <p-password
            v-model="data.confirmPassword"
            autocomplete="off"
            toggle-mask
            :feedback="false"
            :placeholder="$t('auth.password_placeholder')"
            @blur="v$.confirmPassword.$touch"
          >
            <template #footer>
              <p v-for="error of v$.confirmPassword.$errors" :key="error.$uid" class="text-error text-start text-xs">
                {{ error.$message }}
              </p>
            </template>
          </p-password>
        </InputField>
        <div
          class="mx-auto mt-3 text-xs max-w-[80%] text-center"
          v-html="$t('auth.privacy_policy', { link: `/privacy-policy-${locale}.html` })"
        ></div>
      </div>
      <div class="block sm:mt-6 mt-2 sm:space-y-4 space-y-2">
        <PButton
          :disabled="!validation"
          :loading="data.loading"
          class="btn-primary login-button"
          :label="$t('auth.continue')"
          @click="validate"
        />
      </div>
      <div class="flex flex-col items-center sm:mt-2 text-sm sm:space-y-4 space-y-0">
        <SingleSignUp />
        <CallToActionText
          class="text-center"
          :description="$t('auth.have_an_account')"
          :actionText="$t('auth.login')"
          :bold="true"
          to="/auth/login"
        />
      </div>
    </div>
  </ElevatedCard>
  <vue-recaptcha size="invisible" ref="recaptcha" :sitekey="sitekey" @verify="signup" @expired="onCaptchaExpired">
  </vue-recaptcha>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, match, email, sameAs } from '@/utils/validators.utils'
import { useAuthStore } from '@/data/auth/auth.store'
import { maxLength } from '@vuelidate/validators'
import { VueRecaptcha } from 'vue-recaptcha'

const { locale } = useI18n()
const auth = useAuthStore()
const router = useRouter()
const { t } = useI18n()
const recaptcha = ref()
const sitekey = import.meta.env.APP_SITEKEY
const emailRegex =
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#&()–{}:;',?/*~$^+=<>]).{8,20}$/
const validation = computed(
  () =>
    data.credential.match(emailRegex) && data.password.match(passwordRegex) && data.password === data.confirmPassword
)
const onCaptchaExpired = () => {
  recaptcha.value.reset()
}

const validate = async () => {
  if (!(await v$.value.$validate())) return
  recaptcha.value.execute()
}

const data = reactive({
  loading: false,
  credential: '',
  password: '',
  confirmPassword: '',
})

const rules = {
  credential: {
    required,
    email,
  },
  password: {
    required,
    minLength: minLength(8),
    maxLength: maxLength(20),
    match: match(passwordRegex),
  },
  confirmPassword: {
    required,
    minLength: minLength(8),
    maxLength: maxLength(20),
    sameAs: sameAs(
      computed(() => data.password),
      t('auth.password_label')
    ),
  },
}

const v$ = useVuelidate(rules, data, {
  $autoDirty: true,
})

const signup = async (token) => {
  onCaptchaExpired()
  try {
    data.loading = true
    const response = await auth.signup({
      email: data.credential,
      password: data.password,
      confirmPassword: data.confirmPassword,
      captchaResponse: token,
      siteKey: sitekey,
    })
    if (response) router.push('/auth/confirm')
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
