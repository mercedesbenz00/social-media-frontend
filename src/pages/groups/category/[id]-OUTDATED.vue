<template>
  <div class="max-w-[720px] w-full mx-auto mt-4">
    <div class="ps-8 mb-4 text-lg font-bold flex items-center" @click="router.push('/groups')">
      <i class="i-figma:arrow-left me-2 cursor-pointer"></i>
      <div class="cursor-pointer">{{ category.name }}</div>
    </div>
    <Loading v-if="loading" class="p-8" />
    <template v-else>
      <div class="grid grid-cols-3 gap-4">
        <GroupCardSmall
          :isCategories="true"
          v-for="(group, index) in groups.content"
          :key="index"
          :groupData="group"
          @refresh="fetch"
          @goToGroupDetails="goToGroupDetails($event)"
        ></GroupCardSmall>
      </div>
    </template>
    <div class="pagination">
      <PPaginator
        v-if="!showPaginator"
        ref="paginator"
        v-model:first="first"
        :rows="pageSize"
        :totalRecords="totalRecords"
        @page="onPage($event)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useGroupsStore } from '@/data/groups/groups.store'

const route = useRoute()
const router = useRouter()
const groupStore = useGroupsStore()

const groups = ref({} as any)
const category = ref({} as any)

const pageSize = ref(18)
const first = ref(0)
const currentPage = ref(0)
const perPage = ref(18)
const loading = ref(false)

const showPaginator = computed(() => totalRecords.value < perPage.value)

const onPage = ($event) => {
  const { page } = $event
  const query = { page }
  const { path } = route
  page > 0 ? router.push({ path, query }) : router.push({ path })
  currentPage.value = page
}

watch(currentPage, () => {
  fetch()
})

const totalRecords = computed(() => {
  return groups.value.totalElements ?? 0
})
const goToGroupDetails = (groupId) => {
  router.push(`/groups/${groupId}`)
}
const fetch = async () => {
  loading.value = true
  const params = {
    sort: 'createdAt,asc',
    size: pageSize.value,
    page: currentPage.value ? currentPage.value : 0,
  }
  groups.value = await groupStore.getGroupsByCategoryIds(Number(route.params.id), params)
  loading.value = false
}

onMounted(async () => {
  const categoryId = route.params.id
  category.value = await groupStore.getCategory(Number(categoryId))
  fetch()
})
</script>
<style scoped lang="scss">
:deep(.group-card) {
  --at-apply: 'w-[230px] min-w-0';
}
</style>
