<template>
  <PAvatarGroup v-if="loading && !members">
    <PAvatar v-for="i in 4" :key="i" :image="assetImage('no-avatar.svg')" class="!w-10 !h-10" shape="circle" />
  </PAvatarGroup>
  <div v-else-if="members && members.content?.length > 0" class="flex avatar-group">
    <Avatar
      class="!w-10 !h-10"
      v-for="(member, index) in members.content.slice(0, 4)"
      :key="index"
      :person-id="member.personId"
    />
    <PAvatar
      v-if="members.totalElements - 4 > 1"
      :label="`+${members.totalElements - 4}`"
      shape="circle"
      class="!w-10 !h-10 avatar-text"
      style="background-color: '#9c27b0', color: '#ffffff'"
    />
  </div>
</template>
<script setup lang="ts">
import { useAssets } from '@/composables/useAssets'
import { useGroupsStore } from '@/data/groups/groups.store'
import type { IPage } from '@/data/main.model'
import type { IPerson } from '@/data/persons/persons.interface'
import type { PropType } from 'vue'

const props = defineProps({
  groupId: {
    type: Number,
    required: true,
  },
})
const assetImage = useAssets
const $groups = useGroupsStore()
const loading = ref(false)
const members = ref<IPage<IPerson[]> | null>(null)
const fetchMembers = async () => {
  try {
    loading.value = true
    members.value = await $groups.getGroupMembersByGroupId(props.groupId)
  } finally {
    loading.value = false
  }
}
onMounted(fetchMembers)
</script>
<style scoped lang="scss">
.avatar {
  &-text {
    :deep(.p-avatar-text) {
      --at-apply: 'text-xs';
    }
  }
}
[dir='ltr'] {
  .avatar {
    &-group {
      --at-apply: '-space-x-3';
    }
  }
}
[dir='rtl'] {
  .avatar {
    &-group {
      div {
        --at-apply: '-ms-3';
      }
      div:first-child {
        --at-apply: 'ms-0';
      }
    }
  }
}
</style>
