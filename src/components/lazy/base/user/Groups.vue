<template>
  <div>
    <template v-if="loading">
      <div class="flex flex-col space-y-4 px-4 mt-4">
        <div v-for="i in perPage" :key="i" class="item">
          <UserListItemSkeleton />
        </div>
      </div>
    </template>
    <template v-else-if="totalRecords">
      <div class="groups mt-2">
        <div
          v-for="(item, index) in (data.content as IGroup[])"
          :key="`group-${lodash.get(item, 'id')}-${index}`"
          class="item"
        >
          <UserListItem
            class="cursor-pointer"
            @click="gotoGroupProfile(lodash.get(item, 'id'))"
            :displayText="lodash.get(item, 'name')"
            :assiveText="`${lodash.get(item, 'stats.membersCount')} ${$t('profile.group_members')}`"
            :avatar="lodash.get(item, 'avatar.path')"
          >
            <template #button>
              <template v-if="isMyGroups">
                <GroupJoinLeaveButtonWrapper :groupData="item" :total="totalRecords" @refresh="fetch(false)" />
              </template>
              <template v-else>
                <div v-if="authUserGroups.content && authUserGroups.content.length">
                  <GroupJoinLeaveButtonWrapper
                    :groupData="authUserGroups.content.filter((gt) => gt.id === item.id)[0]"
                    :total="authUserGroups.content.filter((gt) => gt.member).length"
                    @refresh="fetch(false)"
                  />
                </div>
                <PSkeleton v-else class="!m-auto !w-32 !h-10 rounded-full" />
              </template>
            </template>
          </UserListItem>
        </div>
      </div>
    </template>
    <template v-if="!totalRecords">
      <div class="px-8 text-center flex flex-col items-center mt-25%">
        <i class="i-figma:users bg-primary w-[80px] h-[80px] mb-2"></i>
        <div>{{ $t('profile.group_not_found') }}</div>
      </div>
    </template>
  </div>
  <div class="pagination" v-if="!loading && totalRecords - pageSize > 0">
    <PPaginator
      ref="paginator"
      v-model:first="first"
      :rows="pageSize"
      :totalRecords="totalRecords"
      @page="onPage($event)"
    />
  </div>
</template>

<script setup lang="ts">
import { GroupStates, type IGroup } from '@/data/groups/groups.interface'
import { useGroupsStore } from '@/data/groups/groups.store'
import { useAuthStore } from '@/data/auth/auth.store'
const route = useRoute()
const router = useRouter()
const groupStore = useGroupsStore()
const lodash = useLodash()
const data = ref({} as any)
const authUserGroups = ref({} as any) //same as data for myself
const first = ref(0)
const perPage = ref(10)
const loading = ref(false)
const $user = useAuthStore()

const totalRecords = computed(() => {
  return data.value?.totalElements ?? 0
})
const pageSize = computed(() => {
  return data.value.pageable?.pageSize ?? 0
})

const currentPage = ref(0)

const onPage = ($event) => {
  const { page } = $event
  const query = { page }
  const { path } = route
  page > 0 ? router.push({ path, query }) : router.push({ path })
  currentPage.value = page
}

const memberId = route.params.id

const fetch = async (showLoader = true) => {
  if (showLoader) {
    loading.value = true
  }
  const memberId = route.params.id

  const params = {
    states: GroupStates.APPROVED,
    memberId,
    page: currentPage.value ? currentPage.value : undefined,
    size: perPage.value,
  }
  data.value = await groupStore.getGroups(params)
  loading.value = false
}

const gotoGroupProfile = (id) => {
  router.push(`/groups/${id}`)
}

const isMyGroups = computed(() => {
  return Number(memberId) == $user?.user?.id
})

const queriedGroupIds = computed(() => {
  return data.value?.content?.map((g) => g.id) ?? []
})

watch(currentPage, () => {
  if (!isMyGroups.value) {
    authUserGroups.value = []
  }
  fetch()
})
watch(queriedGroupIds, async () => {
  if (!isMyGroups.value) {
    authUserGroups.value = await groupStore.getGroups({ groupIds: queriedGroupIds.value })
  }
})

onMounted(() => {
  const path = route.params.all
  if (path === 'groups') {
    const { page } = route.query
    if (page) {
      first.value = Number(page) * perPage.value
      currentPage.value = Number(page)
      return
    }
  } else {
    currentPage.value = 0
  }
  fetch()
})
</script>

<style lang="scss" scoped>
.groups {
  --at-apply: 'border border-bg-purple-light/50 mx-px lg:border-none lg:mx-0 lg:card-defaults p-5';
  .item {
    --at-apply: 'border-b-1 border-gray-200 pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0';
  }
}

.pagination {
  --at-apply: 'p-0 mt-4';
}
</style>
