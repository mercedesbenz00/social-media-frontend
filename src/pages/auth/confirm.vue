<template>
  <div class="verify-email">
    <ConfirmEmail v-if="!response"></ConfirmEmail>
    <ConfirmEmailConfirmed v-if="response && response.status === 200"></ConfirmEmailConfirmed>
    <div v-if="response && response.status !== 200">
      <div class="text-2xl">{{ $t('auth.confirm_failed') }}</div>
      <div v-if="response.data && response.data.errors">
        <ul>
          <li v-for="(error, index) in response.data.errors" :key="index">
            {{ error }}
          </li>
        </ul>
      </div>
      <PButton class="p-button-primary" :label="$t('auth.confirm_failed_btn')" @click="goToSignUp" />
    </div>
    <div v-if="response && response.status === 200">
      <div class="space-y-4 text-center text-sm">
        <div class="text 2xl text-primary">{{ $t('auth.confirm_success') }}</div>
        <div>{{ $t('auth.confirm_redirect') }}</div>
        <div @click="router.push('/auth/login')" class="text-info cursor-pointer">{{ $t('auth.click_here') }}</div>
      </div>
    </div>
    <div v-if="!response" class="space-y-4 text-center text-sm">
      <div class="text-primary font-bold text-2xl">{{ $t('auth.verify_email_title') }}</div>
      <div>{{ $t('auth.verify_email_subtitle') }}</div>
      <div>{{ $t('auth.verify_email_send_again_label') }}</div>
      <div @click="validate" class="text-info cursor-pointer">{{ $t('auth.send_again') }}</div>
      <div class="flex items-center justify-center cursor-pointer" @click="router.push('/auth/signup')">
        <i class="i-figma:arrow-left w-4 h-4 me-2"></i>
        <div>{{ $t('go_back') }}</div>
      </div>
    </div>
    <vue-recaptcha size="invisible" ref="recaptcha" :sitekey="sitekey" @verify="resend" @expired="onCaptchaExpired">
    </vue-recaptcha>
  </div>
</template>
<route lang="yaml">
meta:
  layout: setup
</route>
<script setup lang="ts">
import { useAuthStore } from '@/data/auth/auth.store'
import { useOnboardingStore } from '@/data/onboarding/onboarding.store';
import { VueRecaptcha } from 'vue-recaptcha'
const route = useRoute()
const router = useRouter()
const response = ref()
const $auth = useAuthStore()
const sitekey = import.meta.env.APP_SITEKEY
const $onboarding = useOnboardingStore()
const confirm = async (email: string, code: string) => {
  const data = await useAuthStore().confirmEmail({
    code: code.toString(),
    email: email.toString(),
  })
  if (data) response.value = data
  if (data.status === 200) {
    $onboarding.state = 'EMAIL_CONFIRMED'
    setTimeout(() => {
      router.push('/')
    }, 5000)
  }
}
const recaptcha = ref()
const validate = async () => {
  recaptcha.value.execute()
}
const credentials = computed(() => $auth.credentials)
const resend = async (token) => {
  onCaptchaExpired()
  if (Object.keys(credentials.value).length === 0) router.push('/auth/login')
  await $auth.resend({ captchaResponse: token, siteKey: sitekey })
}
const goToSignUp = () => {
  router.push('/auth/signup')
}
const onCaptchaExpired = () => {
  recaptcha.value.reset()
}
onMounted(() => {
  if (route.query.email && route.query.code) confirm(route.query.email.toString(), route.query.code.toString())
})
</script>
<style lang="scss" scoped>
.verify {
  &-email {
    --at-apply: 'gap-y-2 justify-center items-center';
  }
}
</style>
