<template>
  <div class="max-w-180 w-full mx-auto mt-6">
    <a
      @click="goBack"
      class="text-text-primary hover:text-gray-600 font-bold text-sm ms-4 lg:ms-0 lg:text-xl cursor-pointer"
    >
      <span class="pi pi-arrow-left text-sm font-bold px-2"></span>
      {{ $t(linkText, [displayName]) }}
    </a>
    <div class="page-level-tab mt-2">
      <PTabView ref="tabview" v-model:activeIndex="activeTab" @tab-change="onTabChanged">
        <PTabPanel :header="$t('profile.followers')">
          <Followers v-if="activeTab === 0" />
        </PTabPanel>
        <PTabPanel :header="$t('profile.following')">
          <Following v-if="activeTab === 1" />
        </PTabPanel>
        <PTabPanel :header="$t('profile.groups')">
          <Groups v-if="activeTab === 2" />
        </PTabPanel>
        <PTabPanel :header="$t('profile.collections')" v-if="route.params.id == $auth.user?.id">
          <Collections v-if="activeTab === 3" />
        </PTabPanel>
      </PTabView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/data/auth/auth.store'
import { usePersonsStore } from '@/data/persons/persons.store'

const route = useRoute()
const router = useRouter()
const content = route.params.all
const activeTab = ref()
const routes = ['followers', 'following', 'groups', 'collections']
const $auth = useAuthStore()
const $person = usePersonsStore()

const onTabChanged = (e) => {
  const path = routes[e.index].toLowerCase()
  router.push({ path })
}

const goBack = () => {
  router.back()
}

watch(route, (v) => {
  const p = v.params.all
  if (p) {
    const pIndex = routes.findIndex((r) => r === p)
    if (pIndex > -1) {
      activeTab.value = pIndex
    }
  }
})
const linkText = computed(() => {
  const { user_id, all } = route.params
  const authUserId = $auth.user?.id

  if (Number(user_id) === authUserId) return all === 'collections' ? 'profile.my_collections' : 'profile.my_network'
  return all === 'collections' ? 'profile.user_collections' : 'profile.user_network'
})
const displayName = computed(() => {
  if (user.value?.id) return user.value.displayName
  return ''
})
const user = ref()
const fetchPersonProfile = async () => {
  const { user_id } = route.params
  const authUserId = $auth.user?.id

  if (Number(user_id) === authUserId) user.value = $auth.user
  else user.value = await $person.getPersonById(user_id, true)
}

onMounted(async () => {
  const index = routes.findIndex((r) => r === content)
  if (index > -1) activeTab.value = index
  await fetchPersonProfile()
})
</script>

<style lang="scss" scoped>
.dark-mode {
  .tab {
    .p-tabview-nav-content {
      .p-highlight {
        .p-tabview-nav-link {
          background-color: rgba(var(--primary-color), 1) !important;
        }
      }
    }
  }
}
</style>
