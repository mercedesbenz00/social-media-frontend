<template>
  <page-wrapper class="px-2">
    <div class="font-bold text-4xl mt-6">{{ t('groups.title') }}</div>
    <div class="mt-6">
      <custom-groups-row-skeleton v-if="myGroupsLoading" />
      <div v-else-if="myGroups && myGroups.length > 0">
        <div class="flex items-center justify-between my-4">
          <div class="font-bold text-lg">{{ t('groups.my_groups') }}</div>
          <router-link :to="'/groups/details?type=my_groups'" class="text-sm text-primary">{{
            t('group.members.see_all')
          }}</router-link>
        </div>
        <div class="flex flex-col md:flex-row items-center gap-4 justify-between">
          <router-link
            v-for="{ group } in myGroups"
            :to="'/groups/' + group.id"
            :key="group.id"
            class="w-full p-4 flex items-center gap-x-4 card-defaults"
          >
            <Avatar :src="group.avatar?.path || assetImage('no-group.svg')" />
            <div class="flex items-center justify-center font-bold text-sm h-10">
              {{ group.name.length > 30 ? group.name.slice(0, 27) + '...' : group.name }}
            </div>
          </router-link>
        </div>
      </div>
      <div v-else>{{ t('groups.no_group') }}</div>
    </div>
    <PDivider />
    <router-link
      v-if="!loading && !myGroupsLoading"
      :to="'/settings/manage-interests'"
      class="mb-4 flex w-full md:w-max ms-auto"
    >
      <PButton :label="t('groups.manage_btn')" class="btn-primary w-full md:w-max" icon="i-figma:edit" />
    </router-link>
    <custom-groups-row-skeleton v-if="loading || myGroupsLoading" />
    <div class="flex flex-col gap-y-4" v-else-if="myGroups && myGroups.length > 0 && !loading && !myGroupsLoading">
      <div v-for="(entry, i) of Object.entries(groups)" :key="i">
        <CustomGroupsRow v-if="entry[1].length > 0" :title="entry[0]" :groups="entry[1]" />
      </div>
    </div>
  </page-wrapper>
</template>

<script setup lang="ts">
import { useAssets } from '@/composables/useAssets'
import type { IGroup } from '@/data/groups/groups.interface'
import { useGroupsStore } from '@/data/groups/groups.store'
import { ref, onMounted } from 'vue'
const { t } = useI18n()
const $groups = useGroupsStore()
const loading = ref(false)
const myGroupsLoading = ref(false)

interface IGroups {
  recomended_groups: IGroup[]
  popular_groups?: IGroup[]
  discovered_groups?: IGroup[]
}
const myGroups = ref<IGroup[]>()
const groups = ref<IGroups>({
  recomended_groups: [],
  popular_groups: [],
  discovered_groups: [],
})

const assetImage = useAssets

async function fetchGroups() {
  const size = 3
  myGroupsLoading.value = true
  try {
    const m = await $groups.getMyGroups({ size })
    if (m) myGroups.value = m.content
  } finally {
    myGroupsLoading.value = false
    if (myGroups.value && myGroups.value.length > 0) {
      loading.value = true
      try {
        const groupIds = myGroups.value.map((g: any) => g.group.id)
        const [recomendedGroups, popularGroups, discoveredGroups] = await Promise.all([
          $groups.getSimilarGroups({ size, groupIds }),
          $groups.getPopularGroups({ size }),
          $groups.getSuggestedGroups({ size }),
        ])

        if (recomendedGroups) groups.value.recomended_groups = []
        if (popularGroups) groups.value.popular_groups = popularGroups.content
        if (discoveredGroups) groups.value.discovered_groups = discoveredGroups.content
      } finally {
        loading.value = false
      }
    }
  }
}

onMounted(fetchGroups)
</script>
