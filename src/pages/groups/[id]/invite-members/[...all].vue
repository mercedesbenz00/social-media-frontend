<template>
  <div v-if="false"></div>
  <div else class="w-180 mx-auto mt-6">
    <router-link :to="{ path: `/groups/${id}` }" class="text-text-primary hover:text-gray-900 font-bold text-xl">
      <span class="pi pi-arrow-left text-sm font-bold px-2"></span>
      {{ $t('group.members.invite_members') }}
    </router-link>
    <div class="page-level-tab mt-2">
      <PTabView ref="tabview" v-model:activeIndex="activeTab" @tab-change="onTabChanged">
        <PTabPanel :header="$t('group.all')">
          <AllUsers v-if="activeTab === 0" type="invite" />
        </PTabPanel>
        <PTabPanel :header="$t('profile.followers')">
          <Followers v-if="activeTab === 1" :user-id="userId" type="invite" />
        </PTabPanel>
        <PTabPanel :header="$t('profile.following')">
          <Following v-if="activeTab === 2" :user-id="userId" type="invite" />
        </PTabPanel>
      </PTabView>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAuthStore } from '@/data/auth/auth.store'
import type { IGroup } from '@/data/groups/groups.interface'
import { useGroupsStore } from '@/data/groups/groups.store'

const userId = computed(() => useAuthStore().user?.id)
const activeTab = ref(0)
const $groups = useGroupsStore()
const route = useRoute()
const router = useRouter()
const routes = ['all', 'followers', 'following']
const onTabChanged = (e) => {
  const path = routes[e.index].toLowerCase()
  router.push({ path })
}
const { id } = route.params
const isModerator = computed(() => group.value.accessType == 'PUBLIC' || $groups.isModeratorbyGroupId(id))
const group = ref({} as IGroup)
const getGroupById = async () => {
  group.value = await $groups.getGroupById(id)
}
onMounted(getGroupById)
</script>
