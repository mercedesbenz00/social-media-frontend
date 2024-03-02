<template>
  <BaseRenderlessModal :title="t('moderation.add_moderator')" subtitle="" icon="i-figma:user-check">
    <div class="lg:p-4">
      <div class="p-input-icon-left my-4">
        <i class="i-figma-search w-6 h-6 text-primary" />
        <p-input-text
          v-model="searchValue"
          class="w-full"
          :placeholder="t('moderation.search_members')"
          @input="search"
        />
      </div>
      <div class="max-h-40vh overflow-auto pe-3">
        <div v-if="loading">
          <div v-for="i in 3" :key="i">
            <div class="flex items-center gap-x-2">
              <PSkeleton shape="circle" width="44px" height="44px" />
              <PSkeleton width="50%" height="1.2rem" />
              <PSkeleton width="20%" height="1.2rem" class="ms-auto" />
            </div>
            <PDivider />
          </div>
        </div>
        <div v-else-if="members && members.length > 0" v-for="(member, index) in members" :key="index">
          <div class="flex items-center">
            <Avatar :person-id="member.personId" class="me-2 w-8 h-8 lg:w-11 lg:h-11" />
            <div class="text-xs lg:text-base">{{ member.displayName ?? 'no name' }}</div>
            <div class="ms-auto">
              <PButton
                class="text-xs lg:text-base"
                :label="t('moderation.add')"
                @click="emits('add', { personId: member.personId, permission: 'MODERATOR' })"
              />
            </div>
          </div>
          <PDivider />
        </div>
        <div v-else class="flex flex-col items-center justify-center">
          <i class="i-figma:no-members w-60px h-50px lg:w-[122px] lg:h-[108px] bg-primary-light/25 mb-4"></i>
          <div class="font-bold text-xl lg:text-2xl">{{ t('moderation.empty.members.title') }}</div>
        </div>
      </div>
    </div>
  </BaseRenderlessModal>
</template>
<script setup lang="ts">
import type { PropType } from 'vue'
import { debounce } from 'lodash'
import type { IUser } from '@/data/auth/auth.interface'
import { useGroupsStore } from '@/data/groups/groups.store'

const { t } = useI18n()
const props = defineProps({
  state: {
    type: String as PropType<'admin' | 'moderator'>,
    required: false,
    default: 'admin',
  },
  groupId: {
    type: Number,
    required: true,
  },
  items: {
    type: Array as PropType<any>,
    required: false,
    default: [],
  },
})
const searchValue = ref('')
const emits = defineEmits(['add'])
const $groups = useGroupsStore()
const members = ref([] as IUser[])
const loading = ref(false)
const searchQuery = ref('')
const search = debounce(() => {
  fetchMembers()
}, 250)

const fetchMembers = async () => {
  try {
    loading.value = true
    const response = await $groups.getGroupMembersByGroupId(props.groupId, { query: searchValue.value })
    if (response && response.content) {
      const ids = props.items.map((i) => i.personId)
      members.value = response.content.filter((i: any) => !ids.includes(i.personId))
    }
  } finally {
    loading.value = false
  }
}
onMounted(fetchMembers)
</script>
