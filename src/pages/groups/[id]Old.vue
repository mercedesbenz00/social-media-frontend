<template>
  <NotFoundFiller v-if="notFound" type="group" />
  <div v-else class="mx-auto max-w-[720px] w-full mt-1">
    <GroupWrapperSkeleton v-if="loading" />
    <GroupWrapper v-else :is-admin="isAdmin" :group="group" @update="fetch" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: group
</route>

<script setup lang="ts">
import type { IGroup } from '@/data/groups/groups.interface'
import { useGroupsStore } from '@/data/groups/groups.store'
import _ from 'lodash'

const $groups = useGroupsStore()
const route = useRoute()
const group = ref({} as IGroup)
const loading = ref(false)
const id = computed(() => route.params.id)
const notFound = ref(false)

const fetch = async () => {
  try {
    loading.value = true
    group.value = await $groups.getGroupById(id.value, true)
  } catch (error) {
    notFound.value = true
  } finally {
    loading.value = false
  }
}

const isAdmin = computed(() => {
  const permissions = $groups.permissions.content
  const data = _.find(permissions, (i) => i.userGroup.id === group.value.id)
  return data?.permission === 'ADMIN' || data?.permission === 'MODERATOR'
})

watch(
  route,
  () => {
    fetch()
  },
  { immediate: true }
)
</script>
