<template>
  <BaseListWithPagination v-bind="vBind">
    <template #action="{ item }">
      <GroupActions :group="item" :is-admin="isAdmin(item.groupId)" />
    </template>
  </BaseListWithPagination>
</template>
<script lang="ts" setup>
import { GroupStates } from '@/data/groups/groups.interface'
import { useGroupsStore } from '@/data/groups/groups.store'
import type { IGroup } from '@/data/groups/groups.interface'
import { get } from 'lodash'
import { router } from '@/plugins/0/router.plugin'

const $groups = useGroupsStore()
const isAdmin = (id: number) => $groups.isAdminByGroupId(id)
const props = defineProps({
  params: {
    type: Object,
  },
  showPagination: {
    type: Boolean,
  },
})

const params: any = {
  states: GroupStates.APPROVED,
  ...props.params,
}

const request = useGroupsStore().getGroups

const { t } = useI18n()
function adapter(group: IGroup) {
  return {
    displayText: get(group, 'name'),
    assiveText: `${get(group, 'stats.membersCount')} ${t('profile.group_members')}`,
    avatar: get(group, 'avatar.path'),
    description: get(group, 'description'),
    groupId: get(group, 'id'),
  }
}

function goToDetail(group: IGroup) {
  router.push(`/groups/${group.id}`)
}

function keyGenerator(group: IGroup, index: number) {
  return `group-${get(group, 'id')}-${index}`
}

const vBind = {
  request,
  params,
  keyGenerator,
  goToDetail,
  adapter,
  showPagination: props.showPagination,
}
</script>
