<template>
  <div>
    <universal-users-skeleton-list :loading="loading" :items="users.content" state="invited">
      <UsersList :users="users.content" />
    </universal-users-skeleton-list>
    <UniversalPaginator v-if="users.totalPages && users.totalPages !== 1" :totalPages="users.totalPages" />
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
const fetchMutual = async () => {
  try {
    loading.value = true
    users.value = await $groups.getGroupMembersByGroupId(id, {
      states: 'INVITED',
      query: props.searchValue,
      page: page.value - 1,
    })
  } finally {
    loading.value = false
  }
}

watch(
  page,
  () => {
    fetchMutual()
  },
  { immediate: true }
)

watch(
  props,
  () => {
    fetchMutual()
  },
  { immediate: true }
)
</script>
