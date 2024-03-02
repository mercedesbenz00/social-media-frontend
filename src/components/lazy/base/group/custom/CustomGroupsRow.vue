<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-4">
      <go-back v-if="goBack" class="font-semibold text-lg" :title="t('groups.' + title)" />
      <div v-else class="font-semibold text-lg">{{ t('groups.' + title) }}</div>
      <router-link :to="'/groups/details?type=' + title" v-if="!route.query.type">
        <div class="text-sm text-text-primary">{{ t('group.members.see_all') }}</div>
      </router-link>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 items-center gap-4" v-if="groups && groups.length > 0">
      <CustomGroupsCard v-for="group in groups" :key="group.id" :group="group" />
    </div>
    <div v-else>{{ t('groups.no_group') }}</div>
  </div>
</template>
<script setup lang="ts">
import type { IGroup } from '@/data/groups/groups.interface'
import type { PropType } from 'vue'
const { t } = useI18n()
const route = useRoute()
const props = defineProps({
  groups: {
    type: Array as PropType<IGroup[]>,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  goBack: {
    type: Boolean,
    required: false,
    default: false,
  },
})
</script>
