<template>
  <div>
    <div
      class="border border-bg-purple-light/50 mx-px lg:defaults lg:bg-bg-primary lg:rounded-xl lg:border-none lg:primary-shadow p-5 my-2 lg:my-4"
    >
      <span class="p-input-icon-left">
        <i class="i-figma-search w-4 h-4 text-primary" />
        <p-input-text
          v-model="searchValue"
          class="w-full max-h-[32px] text-xs"
          :placeholder="$t('search.search_following')"
          @input="search"
        />
      </span>
    </div>
    <template v-if="loading">
      <div class="flex flex-col space-y-4 px-4 mt-4">
        <div v-for="i in perPage" :key="i" class="item">
          <UserListItemSkeleton />
        </div>
      </div>
    </template>
    <template v-else-if="totalRecords">
      <div class="following">
        <div v-for="(item, index) in data.content" :key="index" class="item">
          <UserListItem
            class="cursor-pointer"
            @click="gotoProfile(lodash.get(item, 'subscribedTo.id'))"
            :displayText="lodash.get(item, 'subscribedTo.displayName')"
            :assiveText="location(lodash.get(item, 'subscribedTo.cityId'))"
            :avatar="lodash.get(item, 'subscribedTo.avatar.path')"
          >
            <template #button>
              <InviteButton v-if="type == 'invite'" :person-id="lodash.get(item, 'subscribedTo.id')" />
              <MessageButton
                v-else
                :person-id="lodash.get(item, 'subscribedTo.id')"
                :label="$t('profile.follow_message')"
              />
            </template>
          </UserListItem>
        </div>
      </div>
    </template>
    <template v-if="!totalRecords">
      <div class="px-8 text-center flex flex-col items-center mt-25%">
        <i class="i-figma:users bg-primary w-[80px] h-[80px] mb-2"></i>
        <div>{{ $t('profile.following_not_found') }}</div>
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
import { usePersonsStore } from '@/data/persons/persons.store'
import { useLocation } from '@/composables/useLocation'
import UserListItemSkeleton from '@/components/lazy/base/user/UserListItemSkeleton.vue'
import type { PropType } from 'vue'
import { debounce } from 'lodash'
const route = useRoute()
const router = useRouter()
const personStore = usePersonsStore()
const lodash = useLodash()
const location = useLocation
const data = ref({} as any)
const first = ref(0)
const perPage = ref(20)
const loading = ref(false)
const props = defineProps({
  userId: {
    type: Number,
    required: false,
  },
  type: {
    type: String as PropType<'invite | default'>,
    required: false,
    default: 'default',
  },
})
const searchValue = ref('')
const search = debounce(() => fetch(), 250)
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

const fetch = async () => {
  loading.value = true
  const userId = props.userId || route.params.id
  const params = {
    page: currentPage.value ? currentPage.value : null,
    query: searchValue.value ?? '',
  }
  // await personStore.getFollowing(userId, params)
  data.value = await personStore.getFollowing(userId, params)
  loading.value = false
}

const gotoProfile = (id) => {
  router.push(`/profile/${id}`)
}

watch(currentPage, () => {
  fetch()
})

onMounted(() => {
  const path = route.params.all
  if (path === 'following') {
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
.following {
  --at-apply: 'border border-bg-purple-light/50 mx-px lg:border-none lg:mx-0 lg:card-defaults p-5';
  .item {
    --at-apply: 'border-b-1 border-gray-200 pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0';
  }
}

.pagination {
  --at-apply: 'p-0 mt-4 ';
}
</style>
