<template>
  <div>
    <universal-users-skeleton-list :loading="loading" :items="users.content" state="requests">
      <UsersList
        :users="users.content"
        :action-text="t('moderation.requests_action_text')"
        @update="removeFromList($event)"
      />
    </universal-users-skeleton-list>
    <UniversalPaginator v-if="users.totalPages && users.totalPages !== 1" :total-records="users.totalElements" />
  </div>
</template>
<script setup lang="ts">
import { useGroupsStore } from '@/data/groups/groups.store'
import type { PropType } from 'vue'
const { t } = useI18n()

const props = defineProps({
  searchValue: {
    type: String,
    required: false,
    default: '',
  },
})

const page = computed(() => Number(route.query.page) ?? 1)
const users = ref([] as any)
const route = useRoute()
const $groups = useGroupsStore()
const loading = ref(false)
const { id } = route.params
const fetchRequests = async () => {
  try {
    loading.value = true
    users.value = await $groups.getGroupMembersByGroupId(id, {
      states: 'PENDING',
      query: props.searchValue,
      page: page.value - 1,
    })
  } finally {
    loading.value = false
  }
}
const removeFromList = (id) => {
  users.value.content = users.value.content.filter((u) => u.personId !== id)
}

watch(page, () => {
  fetchRequests()
})

watch(
  props,
  () => {
    fetchRequests()
  },
  { immediate: true }
)
</script>
