<template>
  <div class="flex items-center" @click="openSettingsOverlay">
    <div
      class="rounded-full h-10 w-10 flex flex-none items-center justify-center overflow-hidden bg-bg-primary border-white border-2 avatar"
    >
      <img
        class="rounded-full cursor-pointer w-full h-full object-cover"
        :src="userAvatar || assetImage('no-avatar.svg')"
      />
    </div>
    <div class="text-2xl text-primary" :class="overlayOpened ? 'i-figma:chevron-up' : 'i-figma:chevron-down'"></div>
  </div>
  <POverlayPanel
    ref="settingPanel"
    @hide="overlayOpened = false"
    @show="overlayOpened = true"
    class="setting-p-overlay"
  >
    <profile-settings>
      <template #start>
        <div class="flex gap-x-2">
          <Avatar class="w-9 h-9" :src="user.avatar?.path || assetImage('no-avatar.svg')" />
          <div class="flex flex-col items-start space-y-1">
            <div class="font-semibold text-base">{{ user.displayName ?? user.firstName + ' ' + user.lastName }}</div>
            <div class="text-text-primary-light/60 text-xs">{{ user.username }}</div>
            <router-link :to="'/profile/' + user.id" class="text-primary text-xs">
              {{ t('profile_dropdown.view_profile') }}
            </router-link>
          </div>
        </div>
      </template>
      <template #end>
        <p-button
          @click="logout"
          class="btn-primary text-sm w-full"
          icon="i-figma:log-out"
          :label="t('profile_dropdown.log_out')"
        />
      </template>
    </profile-settings>
  </POverlayPanel>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/data/auth/auth.store'
import type { IAuthUser } from '@/data/auth/auth.interface'
import { useAssets } from '@/composables/useAssets'

const { t } = useI18n()
const settingPanel = ref()
const $auth = useAuthStore()
const assetImage = useAssets

const overlayOpened = ref(false)

const userAvatar = computed(() => $auth.getUserAvatar())
const user = computed<IAuthUser>(() => $auth.user as IAuthUser)

const hideOverlay = () => {
  settingPanel.value.hide()
}

const openSettingsOverlay = (event) => {
  settingPanel.value.toggle(event, event.target)
}
const logout = async () => {
  await $auth.logout()
}
</script>

<style lang="scss" scoped></style>
