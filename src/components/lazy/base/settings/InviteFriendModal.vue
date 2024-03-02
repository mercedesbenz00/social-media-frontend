<template>
  <vue-final-modal
    v-slot="{ close }"
    :esc-to-close="true"
    content-class="absolute inset-0 w-full h-full bg-black/50 z-100 flex items-center justify-center"
  >
    <div class="max-w-[392px] relative w-full h-max pt-10 px-4 pb-4 bg-bg-primary rounded-2xl primary-shadow">
      <div @click="close" class="i-figma:x w-6 h-6 absolute top-6 right-4 cursor-pointer"></div>
      <div class="max-w-[280px] w-full mx-auto mb-6">
        <div class="font-bold text-lg mb-2">{{ $t('settings.invite_friends_title') }}</div>
        <div class="text-xs">
          {{ $t('settings.invite_friends_subtitle') }}
        </div>
      </div>
      <form class="max-w-[328px] w-full mx-auto">
        <div class="border-bottom pb-8">
          <InputField :label="$t('settings.name')" :errors="v$.name.$errors">
            <p-input-text
              id="name"
              @blur="v$.name.$touch"
              v-model="form.name"
              :placeholder="$t('settings.name_placeholder')"
            ></p-input-text>
          </InputField>
          <InputField :errors="v$.email.$errors" :label="$t('settings.email')">
            <p-input-text
              class="rounded-2xl"
              id="email"
              v-model="form.email"
              :placeholder="$t('settings.email_placeholder')"
              @blur="v$.email.$touch"
            ></p-input-text>
          </InputField>
        </div>
        <div class="mt-4 flex justify-end">
          <PButton @click="validate" class="w-[88px] flex items-center justify-center">{{
            $t('settings.send')
          }}</PButton>
        </div>
      </form>
    </div>
    <vue-recaptcha size="invisible" ref="recaptcha" :sitekey="sitekey" @verify="send" @expired="onCaptchaExpired">
    </vue-recaptcha>
  </vue-final-modal>
</template>
<script lang="ts" setup>
import { usePersonsStore } from '@/data/persons/persons.store'
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@/utils/validators.utils'
import { VueRecaptcha } from 'vue-recaptcha'

const recaptcha = ref()
const sitekey = import.meta.env.APP_SITEKEY
const emit = defineEmits(['close'])
const form = ref({
  name: '',
  email: '',
})

const rules = {
  name: {
    required,
  },
  email: {
    required,
    email,
  },
}

const onCaptchaExpired = () => {
  recaptcha.value.reset()
}
const v$ = useVuelidate(rules, form, {
  $autoDirty: true,
})

const validate = async () => {
  if (!(await v$.value.$validate())) return
  recaptcha.value.execute()
}
const send = async (token) => {
  await usePersonsStore()
    .inviteFriend({
      name: form.value.name,
      email: form.value.email,
      captchaResponse: token,
      siteKey: sitekey,
    })
    .then(() => {
      emit('close')
    })
}
</script>
<style scoped lang="scss">
:deep(.label) {
  --at-apply: 'font-normal text-sm h-auto';
}
.text-area {
  resize: none;
}
.border-bottom {
  border-bottom: 1px solid rgb(var(--bg-border-light));
}
</style>
