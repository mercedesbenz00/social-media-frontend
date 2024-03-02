<template>
  <div class="relative" v-if="items">
    <p-button class="btn-flat-primary" icon="i-figma:more-horizontal" :loading="loading" @click="toggle" />
    <popup-menu ref="pm" :items="items" />
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from '@/data/main.store'
import { usePersonsStore } from '@/data/persons/persons.store'
const $main = useMainStore()
const { t } = useI18n()
const $persons = usePersonsStore()
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})
const loading = ref(false)
const pm = ref()
const toggle = async (event) => {
  if (!props.data.me && props.data.isFollowing) {
    try {
      loading.value = true
      const res = await $persons.getFollowingNotificationSettingsById(props.data.id)
      if (res) isMute.value = res
    } finally {
      loading.value = false
    }
  }
  pm.value.toggle(event)
}

const actions = computed(() => {
  return {
    COPY_LINK: {
      title: t('profile.copy_link'),
      icon: 'i-figma:copy',
      action: (e) => {
        const href = window.location.origin
        navigator.clipboard.writeText(href + '/profile/' + props.data.id)
        $main.toast({
          type: 'success',
          message: t('toast.success'),
          detail: t('profile.link_copied'),
        })
      },
    },
    MUTE: {
      title: t('post.mute_person'),
      icon: 'i-figma:bell',
      action: (e) => {
        isMute.value = true
        $persons.setFollowerNotificationSettingsById(props.data.id, true)
      },
    },
    UNMUTE: {
      title: t('post.unmute_person'),
      icon: 'i-figma:bell',
      action: (e) => {
        isMute.value = false
        $persons.setFollowerNotificationSettingsById(props.data.id, false)
      },
    },
  }
})
const isMute = ref<boolean>(false)

const items = computed(() => {
  const ACTIONS = actions.value
  if (props.data.me) return [ACTIONS.COPY_LINK]
  else {
    if (props.data.isFollowing && isMute.value) return [ACTIONS.COPY_LINK, ACTIONS.UNMUTE]
    else if (props.data.isFollowing && !isMute.value) return [ACTIONS.COPY_LINK, ACTIONS.MUTE]
    return [ACTIONS.COPY_LINK]
  }
})
</script>
