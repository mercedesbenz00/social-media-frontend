<template>
  <div>
    <universal-users-skeleton-list :loading="loading" :items="users.content" state="members">
      <UsersList :users="users.content" @update="removeFromList" />
    </universal-users-skeleton-list>
    <UniversalPaginator v-if="users.totalPages && users.totalPages !== 1" :total-records="users.totalElements" />
  </div>
</template>
<script setup lang="ts">
import { useGroupsStore } from '@/data/groups/groups.store'

const props = defineProps({
  searchValue: {
    type: String,
    required: false,
    default: '',
  },
})

const page = computed(() => Number(route.query.page))
const users = ref([] as any)
const route = useRoute()
const $groups = useGroupsStore()
const loading = ref(false)
const { id } = route.params
const fetchMembers = async () => {
  try {
    loading.value = true
    users.value = await $groups.getGroupMembersByGroupId(id, { query: props.searchValue, page: page.value - 1 })
  } finally {
    loading.value = false
  }
}
const removeFromList = (id) => {
  users.value.content = users.value.content.filter((u) => u.personId !== id)
}

watch(page, () => {
  fetchMembers()
})

watch(
  props,
  () => {
    fetchMembers()
  },
  { immediate: true }
)
</script>
