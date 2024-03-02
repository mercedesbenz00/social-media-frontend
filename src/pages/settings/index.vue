<template>
  <div class="w-full flex flex-col flex-1">
    <div class="mb-4 font-bold text-3xl flex justify-between px-8">
      <span>{{ $t('edit_profile.title') }}</span>
    </div>
    <p
      class="pb-4 text-sm text-text-secondary-light ps-8"
      v-html="$t('edit_profile.subtitle', { email: me?.email, username: me?.username })"
    ></p>
    <div class="space-y-8">
      <EditProfile />
      <UpdateUserName />
      <UpdatePassword />
      <DeleteAccount class="ps-8" />
    </div>
  </div>
</template>
<route lang="yaml">
meta:
  layout: settings
</route>
<script setup lang="ts">
import { useAuthStore } from '@/data/auth/auth.store'

const $user = useAuthStore()
const me = computed(() => $user.user)
</script>
