<template>
  <div class="group-members">
    <div class="flex items-center justify-between">
      <div class="font-semibold text-sm">{{ $t('group.members.title') }}</div>
      <GroupMembersTrailing
        v-if="device !== 'desktop'"
        :total="total"
        :is-private="isPrivate"
        :has-access="hasAccess"
        :group-id="groupId"
        :mutual-friends="mutualFriends"
        :person-ids="personIds"
        :device="device"
      />
      <div
        class="flex items-center gap-1 text-primary hover:text-secondary"
        v-else-if="adminView && device == 'desktop'"
      >
        <div class="i-figma-edit text-primary"></div>
        <router-link :to="{ path: `/groups/${groupId}/manage-members` }">{{ $t('group.manage_members') }}</router-link>
      </div>
    </div>
    <div class="flex justify-between items-center mt-3">
      <div class="flex gap-3 overflow-x-auto pb-4 lg:pb-0">
        <template v-if="loading">
          <Avatar v-for="i in 9" :key="i" />
        </template>
        <template v-else>
          <Avatar
            class="!h-12 !w-12"
            @mouseover="showOverlay($event, personId)"
            v-for="personId in personIds"
            :key="'avatar' + personId"
            :person-id="personId"
          />
          <POverlayPanel ref="profilePanel" @mouseleave="hideOverlay" class="profile-p-overlay">
            <ProfileCardSmall :userData="targetUserData" v-if="targetUserData" />
          </POverlayPanel>
        </template>
      </div>
      <GroupMembersTrailing
        v-if="device == 'desktop' && total > 9"
        :total="total"
        :is-private="isPrivate"
        :has-access="hasAccess"
        :group-id="groupId"
        :mutual-friends="mutualFriends"
        :person-ids="personIds"
        :device="device"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { GroupStates } from '@/data/groups/groups.interface'
import { useGroupsStore } from '@/data/groups/groups.store'
import ProfileCardSmall from '@/components/lazy/widgets/user/profile/ProfileCardSmall.vue'
import { usePersonsStore } from '@/data/persons/persons.store'

const $person = usePersonsStore()
const $group = useGroupsStore()

const props = defineProps({
  groupId: {
    type: Number as PropType<number | undefined>,
    default: undefined,
  },
  size: {
    type: Number as PropType<number | undefined>,
    default: 9,
  },
  adminView: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  increase: {
    type: Number as PropType<number>,
    default: 0,
  },
  isPrivate: {
    type: Boolean,
    required: true,
  },
  hasAccess: {
    type: Boolean,
    required: false,
    default: false,
  },
  device: {
    type: String as PropType<'mobile | laptop | desktop'>,
    required: false,
    default: 'desktop',
  },
})

const members = ref()
const loading = ref(false)
const mutualFriends = ref({} as any)

const fetchGroupMembers = async () => {
  loading.value = true
  if (props.isPrivate && props.groupId) mutualFriends.value = await $group.getMutualFriends(props.groupId)
  const { groupId, size } = props
  const params = {
    states: GroupStates.APPROVED,
    size,
  }
  members.value = await $group.getGroupMembersByGroupId(groupId, params)
  loading.value = false
}

const personIds = computed(() => {
  if (members.value) return members.value.content.map((p) => p.personId)
  return []
})

const total = computed(() => {
  if (members.value) return members.value.totalElements + props.increase
  return 0
})

onMounted(() => {
  if (typeof props.groupId === 'number') fetchGroupMembers()
})

const lastShowed = ref(0)
const profilePanel = ref()
const targetUserData = ref(null)
const showOverlay = (e, current) => {
  if (lastShowed.value !== current) {
    if (profilePanel.value.visible) {
      profilePanel.value.hide()
      lastShowed.value = current
      nextTick(() => {
        targetUserData.value = $person.users[current] as any
        profilePanel.value.show(e)
        return
      })
      return
    }
    targetUserData.value = $person.users[current] as any
    profilePanel.value.show(e)
  }
}
const hideOverlay = () => {
  profilePanel.value.hide()
}
</script>

<style lang="scss" scoped>
.group-members {
  --at-apply: 'card-defaults p-5';
}
</style>
