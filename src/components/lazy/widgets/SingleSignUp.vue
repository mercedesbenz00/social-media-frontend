<template>
  <div class="flex flex-col items-center sm:py-4 py-2 sm:gap-y-4 gap-y-2">
    <div class="text-sm">{{ $t('auth.sign_up_with') }}</div>
    <div class="flex space-x-2" id="fb-root">
      <PButton class="btn-flat-primary sm:text-3xl text-2xl" icon="i-figma:facebook " @click="checkFbLogin"></PButton>
      <PButton class="btn-flat-primary sm:text-3xl text-2xl" icon="i-figma:google" @click="checkGoogleLogin"></PButton>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/data/auth/auth.store'
import gAuth from 'vue3-google-auth'
const $gAuth = gAuth.useGAuth()

const auth = useAuthStore()
const checkFbLogin = () => {
  FB.getLoginStatus(async (response) => {
    if (response.status === 'connected') {
      await auth.socialLogin({
        providerName: 'facebook',
        accessToken: response.authResponse.accessToken,
      })
    } else {
      fbLogin()
    }
  }, true)
}

const fbLogin = async () => {
  await FB.login((response) => {
    auth.socialLogin({
      providerName: 'facebook',
      accessToken: response.authResponse.accessToken,
    })
  })
}

const checkGoogleLogin = async () => {
  const googleUser = await $gAuth.signIn()
  const token = googleUser.getAuthResponse().id_token
  await auth.socialLogin({
    providerName: 'google',
    accessToken: token,
  })
}
</script>

<style lang="scss" scoped>
.button {
  color: white;
  min-width: 150px;
  background-color: #000000a1;
  height: 2.5rem;
  border-radius: 2rem;
  font-weight: 400;
  font-size: 0.8rem;
}
</style>
