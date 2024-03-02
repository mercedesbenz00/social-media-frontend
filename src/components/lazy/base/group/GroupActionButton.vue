<template>
  <div class="text-center sm:text-right !my-3 !sm:my-0 position-relative">
    <template v-if="group?.memberState === 'APPROVED'">
      <PButton
        v-if="groupStore.isAdmin"
        @click="onEditGroup"
        :loading="loading"
        class="p-button px-8 btn-outlined-primary"
        icon="i-figma-user-edit"
        :label="$t('group.edit')"
      />
      <PButton
        v-else
        @click="openPopupLeaveMenu"
        :loading="loading"
        class="p-button px-8 btn-outlined-primary"
        icon="i-figma-user-plus"
        :label="$t('group.joined')"
      />
      <PopupMenu :items="popupLeaveMenuItems" ref="popupLeaveMenuRef" />
    </template>
    <template v-else-if="group?.memberState === 'PENDING'">
      <PButton
        :label="t('group.join_requested')"
        class="btn-outlined-primary px-8 p-button"
        icon="i-figma:clock"
        :disabled="true"
        :loading="loading"
      />
    </template>
    <template v-else-if="group?.memberState === 'INVITED'">
      <PButton
        @click="join"
        :loading="loading"
        class="p-button px-8"
        icon="i-figma i-figma-user-plus"
        :label="t('group.join_accept')"
      />
    </template>
    <template v-else>
      <PButton
        @click="join"
        :loading="loading"
        class="p-button px-8"
        icon="i-figma i-figma-user-plus"
        :label="requiredApproval ? t('group.join_request') : t('group.join')"
      />
    </template>
    <GroupUpdate v-if="groupStore.isAdmin" :groupData="group" @update="fetchGroup" ref="groupUpdate" />
  </div>
</template>

<script lang="ts" setup>
import type { IGroup } from '@/data/groups/groups.interface'
import type { PropType } from 'vue'
import { useGroupsStore } from '@/data/groups/groups.store'
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
const { t } = useI18n()
const md = useBreakpoints(breakpointsTailwind).smaller('md')
const props = defineProps({
  groupData: {
    type: Object as PropType<IGroup>,
    required: true,
  },
})
const $groups = useGroupsStore()
const loading = ref(false)
const popupLeaveMenuItems = ref([{ title: t('group.leave'), action: leave }])
const group = ref(props.groupData)
const groupStore = computed(() => useGroupsStore())
const groupUpdate = ref()
const onEditGroup = () => {
  if (groupUpdate && groupUpdate.value) groupUpdate.value.show()
}
const groupActions = computed(() => {
  return {
    EDIT: {
      title: t('group.edit'),
      icon: 'i-figma:user-edit',
      action: () => {
        onEditGroup()
      },
    },
    OPENPOPUP: {
      title: t('group.joined'),
      icon: 'i-figma:user-plus',
      action: (e) => {
        openPopupLeaveMenu(e)
      },
    },
    REQUESTED: {
      title: t('group.join_requested'),
      icon: 'i-figma:clock',
      disabled: true,
      action: () => {},
    },
    INVITED: {
      title: t('group.join_accept'),
      icon: 'i-figma:user-plus',
      action: () => {
        join()
      },
    },
    JOIN: {
      title: requiredApproval.value ? t('group.join') : t('group.join_request'),
      icon: 'i-figma:user-plus',
      action: () => {
        join()
      },
    },
  }
})
const popupLeaveMenuRef = ref()
const openPopupLeaveMenu = (e) => {
  popupLeaveMenuRef.value.toggle(e)
}

const requiredApproval = computed(() => props.groupData?.accessType === 'PRIVATE')

const fetchGroup = async () => {
  loading.value = true
  group.value = await useGroupsStore().getGroupById(props.groupData?.id)
  loading.value = false
}

async function leave() {
  loading.value = true
  await useGroupsStore().removeUserFromGroup(props.groupData?.id)
  await fetchGroup()
  loading.value = false
}

const join = async () => {
  loading.value = true
  await useGroupsStore().joinGroup(props.groupData?.id)
  await fetchGroup()
  loading.value = false
}
</script>
