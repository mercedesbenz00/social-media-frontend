<template>
  <div>
    <universal-users-skeleton-list :loading="loading" :items="users.content" state="invitation">
      <UsersList :users="users.content" :statuses="statuses" />
    </universal-users-skeleton-list>
    <UniversalPaginator v-if="users.totalPages && users.totalPages !== 1" :total-records="users.totalElements" />
  </div>
</template>
<script setup lang="ts">
import { useGroupsStore } from '@/data/groups/groups.store'
import { usePersonsStore } from '@/data/persons/persons.store'

const props = defineProps({
  searchValue: {
    type: String,
    required: false,
    default: '',
  },
})
const users = ref([] as any)
const route = useRoute()
const page = computed(() => Number(route.query.page) ?? 1)
const $persons = usePersonsStore()
const $groups = useGroupsStore()
const loading = ref(false)
const { id } = route.params
const statuses = ref([] as any)
const fetchPersons = async () => {
  try {
    loading.value = true
    users.value = await $persons.getAllPersons({ query: props.searchValue, page: page.value - 1, size: 10 })
    const memberIds = users.value.content.map((u) => u.id)
    const promises = [] as any
    for (const id of memberIds) {
      promises.push($groups.getMemberState(Number(id), id))
    }
    statuses.value = await Promise.all(promises)
  } finally {
    loading.value = false
  }
}
watch(page, () => {
  fetchPersons()
})

watch(
  props,
  () => {
    fetchPersons()
  },
  { immediate: true }
)
</script>
