<template>
  <div v-if="data" class="mx-auto w-full max-w-[720px] my-4">
    <router-link :to="{ path: `/groups/${groupId}` }" class="text-text-primary hover:text-gray-900 font-bold text-xl">
      <span class="pi pi-arrow-left text-sm font-bold px-2"></span>
      {{ $t('group.members.members') }}
    </router-link>
    <div class="mt-4 bg-bg-primary rounded-2xl primary-shadow px-6 py-4">
      <span class="p-input-icon-left">
        <i class="i-figma-search text-2xl text-primary/80" />
        <p-input-text
          @input="onSearch"
          :value="searchQuery"
          icon="pi pi-search"
          :placeholder="$t('group.members.search')"
          class="w-full"
        />
      </span>
    </div>
    <div class="mt-2 page-level-tab">
      <PTabView v-model:activeIndex="activeTab" @tab-change="onTabChanged">
        <PTabPanel :header="$t('group.all')" :disabled="closeView || loading" v-if="isAdmin">
          <MembersList
            v-if="data?.content?.length > 0"
            :group-id="groupId"
            :data="data"
            :is-admin="isAdmin"
            :loading="loading"
            @update="fetch('all')"
          />
          <div class="flex items-center justify-center" v-else>{{ $t('group.no_data') }}</div>
        </PTabPanel>
        <PTabPanel :header="$t('group.members_tab')" :disabled="closeView || loading">
          <MembersList
            v-if="data?.content?.length > 0"
            :group-id="groupId"
            :data="data"
            :is-admin="isAdmin"
            :loading="loading"
            @update="fetch('members')"
          />
          <div class="flex items-center justify-center" v-else>{{ $t('group.no_data') }}</div>
        </PTabPanel>
        <PTabPanel :header="$t('group.mutual')" :disabled="loading">
          <MembersList
            v-if="data?.content?.length > 0"
            :group-id="groupId"
            :data="data"
            :is-admin="isAdmin"
            :loading="loading"
            @update="fetch('mutual')"
          />
          <div class="flex items-center justify-center" v-else>{{ $t('group.no_data') }}</div>
        </PTabPanel>
        <PTabPanel :header="$t('group.invited')" :disabled="closeView || loading" v-if="isAdmin">
          <MembersList
            v-if="data?.content?.length > 0"
            :group-id="groupId"
            :data="data"
            :is-admin="isAdmin"
            :loading="loading"
            @update="fetch('invited')"
          />
          <div class="flex items-center justify-center" v-else>{{ $t('group.no_data') }}</div>
        </PTabPanel>
        <PTabPanel :header="$t('group.requests')" :disabled="closeView || loading" v-if="isAdmin">
          <MembersList
            v-if="data?.content?.length > 0"
            :group-id="groupId"
            :data="data"
            :is-admin="isAdmin"
            :loading="loading"
            @update="fetch('pending')"
          />
          <div class="flex items-center justify-center" v-else>{{ $t('group.no_data') }}</div>
        </PTabPanel>
      </PTabView>
      <PPaginator
        v-if="!showPaginator || !loading"
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
import { usePersonsStore } from '@/data/persons/persons.store'
import _ from 'lodash'
const router = useRouter()
const route = useRoute()
const $groups = useGroupsStore()
const $persons = usePersonsStore()
const group = ref({} as any)
const data = ref({} as any)
const activeTab = ref()
const loading = ref(false)
const pageSize = ref(20)
const state = ref('all')
const first = ref(0)
const currentPage = ref(0)
const totalRecords = computed(() => data.value?.totalElements ?? null)
const showPaginator = computed(() => totalRecords.value <= pageSize.value)
const searchQuery = ref(_.get(route.query, 'query'))
const groupId = ref(Number(route.params.id))
const closeView = ref(false)

const onPage = ($event) => {
  const { hash } = route
  const { page } = $event
  let routeQuery = {}
  if (page) {
    first.value = Number(page) * pageSize.value
    routeQuery = { page }
  } else {
    first.value = 0
  }
  const query = searchQuery.value && searchQuery.value != '' ? searchQuery.value : null
  if (query) {
    routeQuery = {
      ...routeQuery,
      query,
    }
  }
  const { path } = route
  router.push({ path, query: routeQuery, hash: hash })
  currentPage.value = page
}

const onTabChanged = (e) => {
  if (e.index === 1) router.push({ hash: '#mutual-friends' })
  else router.push({ hash: undefined })
}

const onSearch = _.debounce(($event) => {
  const query = $event.target.value.length ? $event.target.value : null
  searchQuery.value = query
}, 500)

watch(currentPage, () => {
  fetch(state.value)
})

watch(searchQuery, () => {
  router.push({ hash: state.value == 'mutual' ? '#mutual-friends' : '' })
  if (currentPage.value == 0) {
    fetch(state.value)
  } else {
    onPage({ page: 0 })
  }
})
const fetchGroup = async () => {
  try {
    loading.value = true
    group.value = await $groups.getGroupById(groupId.value)
    closeView.value = group.value.memberState === 'NOT_MEMBER' && group.value.accessType === 'PRIVATE'
    if (isAdmin.value && route.hash === '#mutual-friends') activeTab.value = 2
    else if (closeView.value || route.hash === '#mutual-friends') activeTab.value = 1
    else activeTab.value = 0
  } finally {
    loading.value = false
  }
}

const fetch = async (currentState = 'all', params = {}) => {
  try {
    loading.value = true
    params = {
      sort: 'createdAt,asc',
      size: pageSize.value,
      page: currentPage.value,
      query: searchQuery.value,
      ...params,
    }
    state.value = currentState
    if (currentState === 'members') {
      params = { ...params, states: 'APPROVED' }
      data.value = await $groups.getGroupMembersByGroupId(groupId.value, params)
    } else if (currentState === 'mutual') {
      data.value = await $groups.getMutualFriends(groupId.value, params)
    } else if (currentState === 'invited') {
      params = { ...params, states: 'INVITED' }
      data.value = await $groups.getGroupMembersByGroupId(groupId.value, params)
    } else if (currentState === 'pending') {
      params = { ...params, states: 'PENDING' }
      data.value = await $groups.getGroupMembersByGroupId(groupId.value, params)
    } else {
      params = { ...params, size: 5 }
      data.value = await $persons.getAllPersons(params)
      const promises = data.value.content.map((member) => $groups.getMemberState(groupId.value, member.id))

      const states = await Promise.all(promises)
      data.value.content.forEach((member) => {
        states.forEach((state) => {
          if (member.id === state.personId) member.state = state.state
        })
      })
    }
  } finally {
    loading.value = false
  }
}

const isAdmin = computed(() => {
  const permissions = $groups.permissions.content
  const data = _.find(permissions, (i) => i.userGroup.id === Number(groupId.value))
  return data?.permission === 'ADMIN' || data?.permission === 'MODERATOR'
})

watch(activeTab, () => {
  currentPage.value = 0
  onPage({ page: 0 })
  if (isAdmin.value) {
    switch (activeTab.value) {
      case 0:
        fetch('all')
        router.push({})
        break
      case 1:
        fetch('members')
        router.push({})
        break
      case 2:
        fetch('mutual')
        router.push({ hash: '#mutual-friends' })
        break
      case 3:
        fetch('invited')
        router.push({})
        break
      case 4:
        fetch('pending')
        router.push({})
        break
    }
  } else {
    switch (activeTab.value) {
      case 0:
        fetch('members')
        router.push({})
        break
      case 1:
        fetch('mutual')
        router.push({ hash: '#mutual-friends' })
        break
    }
  }
})

onMounted(() => {
  fetchGroup()
  const { page } = route.query
  if (page) {
    first.value = Number(page) * pageSize.value
    currentPage.value = Number(page)
    return
  } else currentPage.value = 0
})
</script>
<style scoped lang="scss">
:deep(.page-level-tab) {
  .p-tabview-panels {
    --at-apply: 'md: my-2';
  }
}
</style>
