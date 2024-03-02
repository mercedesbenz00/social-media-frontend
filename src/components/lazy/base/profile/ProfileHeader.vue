<template>
  <div class="card-defaults p-0 overflow-hidden">
    <div class="mb-6">
      <profile-cover
        ref="cover"
        :cover="data.person?.cover?.path"
        :me="data.me"
        @update="emits('update')"
        @show-image="showImage"
      >
        <div class="relative" v-if="(items && items.length > 0) && data.me">
          <p-button class="btn-primary" icon="i-figma:more-horizontal" :loading="loading" @click="toggle" />
          <popup-menu ref="pm" :items="items" />
        </div>
      </profile-cover>
      <div class="flex flex-col md:flex-row items-center w-full ps-8 pe-6 pt-4">
        <profile-avatar
          ref="avatar"
          class="-mt-20"
          :avatar="data.person?.avatar?.path"
          :me="data.me"
          @update="emits('update')"
          @show-image="showImage"
        />
        <div class="ms-4">
          <div class="text-2xl font-500">{{ data.person?.displayName }}</div>
        </div>
        <profile-actions class="mx-auto md:mx-0 md:ms-auto" :data="data" />
      </div>
    </div>
    <div class="px-6 pb-4">
      <profile-summary :person="data.person" :me="data.me" />
      <profile-bio v-if="data.person.bio" :bio="data.person.bio" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { usePersonMediaStore } from '@/data/personMedia/personMedia.store'
import type { PropType } from 'vue'
const $personMedia = usePersonMediaStore()
const { t } = useI18n()
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const emits = defineEmits(['update'])
const data = unref(props.data)
const pm = ref()
const cover = ref()
const avatar = ref()
const showImage = (url) => {
  const { $vfm } = useGlobals()
  const component = resolveComponent('FullSizeImage')
  $vfm.show({
    component,
    bind: {
      drag: false,
      size: 'auto',
      adaptive: false,
      noActions: true,
      url,
    },
    on: {
      close: () => {
        $vfm.hideAll()
      },
    },
  })
}
const toggle = (event) => {
  pm.value.toggle(event)
}
const loading = ref(false)
const items = computed(() => {
  const i = [] as any
  if (props.data.person.avatar) i.push(actions.value.REMOVE_AVATAR)
  if (props.data.person.cover) i.push(actions.value.REMOVE_COVER)
  return i
})

const actions = computed(() => {
  return {
    REMOVE_AVATAR: {
      title: t('profile_card.remove_avatar'),
      icon: 'i-figma:remove-avatar',
      action: async () => {
        try {
          loading.value = true
          avatar.value.avatar = ''
          await $personMedia.removeAvatar()
          emits('update')
        } finally {
          loading.value = false
        }
      },
    },
    REMOVE_COVER: {
      title: t('profile_card.remove_cover'),
      icon: 'i-figma:remove-cover',
      action: async () => {
        try {
          loading.value = true
          cover.value.cover = ''
          await $personMedia.removeCover()
          emits('update')
        } finally {
          loading.value = false
        }
      },
    },
  }
})
</script>
