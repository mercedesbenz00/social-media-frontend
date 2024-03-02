<template>
  <div>
    <universal-users-skeleton-list :loading="loading" :items="users.content" state="muted">
      <UsersList :users="users.content" @update="fetchMuted()" />
    </universal-users-skeleton-list>
    <UniversalPaginator v-if="users.totalPages && users.totalPages !== 1" :total-records="users.totalElements" />
  </div>
</template>
<script setup lang="ts">
import { usePersonsStore } from '@/data/persons/persons.store'

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
const $persons = usePersonsStore()
const loading = ref(false)
const { id } = route.params
const fetchMuted = async () => {
  try {
    loading.value = true
    users.value = await $persons.getGroupBans({ groupIds: [id], query: props.searchValue, page: page.value - 1 })
  } finally {
    loading.value = false
  }
}

watch(page, () => {
  fetchMuted()
})

watch(
  props,
  () => {
    fetchMuted()
  },
  { immediate: true }
)
</script>
