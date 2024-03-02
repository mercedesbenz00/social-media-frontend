<template>
  <default>
    <div class="mt-4 w-full flex">
      <group-sidebar v-if="isAdmin && !md" />
      <router-view v-slot="{ Component }">
        <loader-spinner v-if="loading" class="!flex m-auto" />
        <component v-else-if="!loading && group" :is="Component" :group="group" @update="findGroup(true)">
          <template #menu>
            <group-sidebar v-if="isAdmin && md" />
          </template>
        </component>
        <not-found-filler v-else type="group" />
      </router-view>
    </div>
  </default>
</template>
<script setup lang="ts">
import { useAuthStore } from '@/data/auth/auth.store'
import type { IGroup } from '@/data/groups/groups.interface'
import { useGroupsStore } from '@/data/groups/groups.store'
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'

const md = useBreakpoints(breakpointsTailwind).smaller('md')
const $groups = useGroupsStore()
const $auth = useAuthStore()
const group = ref<IGroup | null>(null)
const route = useRoute()
const isAdmin = computed(() => group.value?.permissions.find((p) => p == 'ADMIN'))
const loading = ref(false)
const findGroup = async (force = false) => {
  try {
    loading.value = true
    const { id } = route.params
    group.value = await $groups.getGroupById(id, force)
  } finally {
    loading.value = false
  }
}
onMounted(findGroup)
</script>
