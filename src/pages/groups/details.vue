<template>
  <div class="w-full max-w-720px p-4">
    <custom-groups-row-skeleton v-if="loading" />
    <custom-groups-row v-else-if="groups && groups.length > 0" :groups="groups" :title="title" :go-back="true" />
    <div v-else>{{ t('groups.no_group') }}</div>
  </div>
</template>
<script setup lang="ts">
import type { IGroup } from '@/data/groups/groups.interface'
import { useGroupsStore } from '@/data/groups/groups.store'

const route = useRoute()
const $groups = useGroupsStore()
const groups = ref<IGroup[]>()
const title = computed(() => route.query?.type?.toString())
const loading = ref(false)
const { t } = useI18n()

const fetchGroups = async () => {
  const type = route.query.type
  let response
  try {
    loading.value = true
    if (type === 'my_groups' || 'recent') {
      const myGroups = await $groups.getMyGroups()
      response = myGroups.content.map((g: any) => g.group)
    }
    if (type === 'popular_groups') response = await $groups.getPopularGroups()
    if (type === 'discovered_groups' || type === 'suggested') response = await $groups.getSuggestedGroups()
    if (type === 'recomended_groups') {
      const myGroups = await $groups.getMyGroups()
      const groupIds = myGroups.content.map((g: any) => g.group.id)
      response = await $groups.getSimilarGroups({ groupIds })
    }
    groups.value = response.content ?? response
  } finally {
    loading.value = false
  }
}
onMounted(fetchGroups)
</script>
