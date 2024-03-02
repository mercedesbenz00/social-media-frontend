<template>
  <div>
    <universal-users-skeleton-list :loading="loading" :items="users.content" state="mutual">
      <UsersList :users="users.content" />
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

const page = computed(() => Number(route.query.page) ?? 1)
const users = ref([] as any)
const route = useRoute()
const $groups = useGroupsStore()
const loading = ref(false)
const { id } = route.params
const fetchMutual = async () => {
  try {
    loading.value = true
    users.value = await $groups.getMutualFriends(Number(id), { query: props.searchValue, page: page.value - 1 })
  } finally {
    loading.value = false
  }
}

watch(page, () => {
  fetchMutual()
})

watch(
  props,
  () => {
    fetchMutual()
  },
  { immediate: true }
)
</script>
