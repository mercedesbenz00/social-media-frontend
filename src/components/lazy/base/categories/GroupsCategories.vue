<template>
  <div class="max-w-[720px] w-full mx-auto">
    <div class="mt-4">
      <div class="text-2xl font-bold">{{ $t('group.suggested_for_you') }}</div>
      <div v-for="(category, index) in categories.content" :key="index" class="my-5">
        <div class="flex justify-between">
          <div class="text-lg font-bold">{{ category.name }}</div>
          <div class="text-sm text-primary cursor-pointer" @click="router.push(`/groups/category/${category.id}`)">
            {{ $t('see_more') }}
          </div>
        </div>
        <GroupsRow :categoryId="category.id" :key="category.id"> </GroupsRow>
      </div>
    </div>
    <div class="pagination" v-if="!loading">
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

const categories = ref({} as any)

const pageSize = ref(5)
const first = ref(0)
const currentPage = ref(0)
const perPage = ref(5)
const loading = ref(false)

const showPaginator = computed(() => totalRecords.value < perPage.value)

const onPage = ($event: any) => {
  const { page } = $event
  router.push({ path: route.path, query: { ...route.query, page: page + 1 } })
}

watch(
  () => route.query,
  (v) => {
    currentPage.value = v?.page ? Number(v.page) - 1 : 0
    first.value = currentPage.value * pageSize.value
    fetch()
  },
  { immediate: true, deep: true }
)

const totalRecords = computed(() => categories.value.totalElements ?? 0)

async function fetch() {
  const params = {
    sort: 'createdAt,asc',
    size: pageSize.value,
    page: currentPage.value > 0 ? currentPage.value : 0,
  }

  categories.value = await groupStore.getAllCategories(params)
}
</script>
<style scoped lang="scss">
:deep(.group-card) {
  --at-apply: 'w-[230px] !min-w-0';
}
</style>
