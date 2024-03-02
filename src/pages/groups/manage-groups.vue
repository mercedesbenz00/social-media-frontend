<template>
  <page-wrapper class="flex flex-col space-y-4 max-w-720px w-full mx-auto py-4">
    <div class="search">
      <div class="p-input-icon-left">
        <i class="i-figma-search w-4 h-4 text-primary" />
        <p-input-text
          v-model="searchValue"
          class="w-full max-h-[32px] text-xs"
          :placeholder="t('group.search_button_placeholder')"
          @input="search"
        />
      </div>
    </div>
    <div class="mt-4">
      <ManageGroupsListSkeleton v-if="loading" />
      <ManageGroupsList v-else-if="groups && groups.content" :groups="groups.content" />
      <div v-else>{{ t('group.list_is_empty') }}</div>
    </div>
  </page-wrapper>
</template>
<script setup lang="ts">
import type { IAuthUser } from '@/data/auth/auth.interface'
import { useAuthStore } from '@/data/auth/auth.store'
import type { IGroup } from '@/data/groups/groups.interface'
import { useGroupsStore } from '@/data/groups/groups.store'
import { debounce } from 'lodash'

const $auth = useAuthStore()
const $groups = useGroupsStore()
const { t } = useI18n()
const groups = ref([] as any)
const loading = ref(false)
const searchValue = ref('')

const user = computed<IAuthUser>(() => $auth.user as IAuthUser)

const search = debounce(() => {
  fetchAdminGroup({ query: searchValue.value })
}, 300)
const fetchAdminGroup = async (params = {}) => {
  try {
    loading.value = true
    params = { ...{ personId: user.value.id }, ...params }
    groups.value = await $groups.getManagedGroups(params)
  } finally {
    loading.value = false
  }
}
onMounted(fetchAdminGroup)
</script>
<style scoped lang="scss">
.search {
  --at-apply: 'p-4 rounded-2xl bg-bg-primary border border-bg-purple-light/50 flex items-center';
}
</style>
