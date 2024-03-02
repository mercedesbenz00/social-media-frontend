<template>
  <div>
    <div v-if="loading">
      <PSkeleton width="30%" height="1.2rem" class="mb-4" />
      <div v-for="i in 3" :key="i">
        <div class="flex items-center">
          <PSkeleton class="me-2" shape="circle" width="64px" height="64px" />
          <PSkeleton width="50%" height="1.2rem" />
        </div>
        <PDivider />
      </div>
    </div>
    <div v-else>
      <GroupPermissionItem :title="t('moderation.admin_title')" icon="i-figma:star" :items="adminsPermissions" />
      <GroupPermissionItem
        :title="t('moderation.moderator_title')"
        icon="i-figma:user-check"
        :items="moderatorsPermissions"
        :btn-label="t('moderation.change')"
        :show-actions="true"
        @on-remove="removeModerator"
        @on-modal="openModal('moderator')"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useGroupsStore } from '@/data/groups/groups.store'
import { useMainStore } from '@/data/main.store'

const { t } = useI18n()
const $groups = useGroupsStore()
const $main = useMainStore()
const route = useRoute()

const loading = ref(false)
const adminsPermissions = ref()
const moderatorsPermissions = ref()

const fetchPermissions = async () => {
  try {
    loading.value = true
    const response = await $groups.getPermissions({ groupIds: route.params.id, statuses: 'ADMIN, MODERATOR' }, true)
    adminsPermissions.value = response.content.filter((p) => p.permission === 'ADMIN')
    moderatorsPermissions.value = response.content.filter((p) => p.permission === 'MODERATOR')
  } finally {
    loading.value = false
  }
}

const removeModerator = async (id: number) => {
  $main.confirm({
    header: t('chat.remove_chat_header'),
    message: t('chat.remove_chat_message'),
    acceptLabel: t('acceptLabel'),
    rejectLabel: t('rejectLabel'),
    accept: async () => {
      await $groups.removePermission(route.params.id, id)
      moderatorsPermissions.value = moderatorsPermissions.value.filter((m) => m.id !== id)
    },
    reject: () => {},
  })
}
const openModal = (state: string) => {
  const { $vfm } = useGlobals()
  const component = resolveComponent('GroupPermissionModal')
  $vfm.show({
    component,
    bind: {
      drag: false,
      size: 'large',
      adaptive: false,
      noActions: true,
      state,
      groupId: Number(route.params.id),
      items: [...adminsPermissions.value, ...moderatorsPermissions.value],
    },
    on: {
      close: () => {
        $vfm.hideAll()
      },
      add: async (payload: { personId: number; permission: string }) => {
        await $groups.addPermission(route.params.id, payload)
        fetchPermissions()
        $vfm.hideAll()
      },
    },
  })
}
onMounted(fetchPermissions)
</script>
