<template>
  <div class="w-full">
    <div class="my-4">
      <a @click="goBack" class="text-text-primary hover:text-gray-600 font-bold text-xl cursor-pointer" v-if="group">
        <span class="pi pi-arrow-left text-sm font-bold px-2"></span>
        {{ _.get(group, 'name', '') }}
      </a>
    </div>
    <div class="flex flex-col space-y-6">
      <div class="group-wrapper">
        <GroupCover
          :is-admin="isAdmin"
          :cover="group.cover?.path"
          :group-id="group.id"
          @update="() => emits('update')"
        />
        <div class="px-6 pb-6 -mt-[50px]">
          <GroupHeader :is-admin="isAdmin" :group="group" :device="device" @update="() => emits('update')" />
          <GroupBody :group="group" />
        </div>
      </div>
      <GroupMembers
        :has-access="hasAccess"
        :admin-view="isAdmin"
        :group-id="group.id"
        :is-private="isPrivate"
        :device="device"
      />
      <GroupSearch v-if="isAdmin || !isPrivate || hasAccess" @search="onSearch($event)" />
      <GroupRules
        v-if="isAdmin || !isPrivate || hasAccess"
        :group="group"
        :is-admin="isAdmin"
        @update="() => emits('update')"
      />
      <post-create v-if="isAdmin || !isPrivate || hasAccess"/>
      <GroupPosts v-if="isAdmin || !isPrivate || hasAccess" :group="group" :is-admin="isAdmin" :query="query" />
      <GroupPrivatePlaceholder :title="$t('group.private_title')" :subtitle="$t('group.private_subtitle')" v-else />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { IGroup } from '@/data/groups/groups.interface'
import type { PropType } from 'vue'
import { useDeviceDetector } from '@/utils/device-detector.utils'
import _ from 'lodash'

const device = useDeviceDetector()
const props = defineProps({
  group: {
    type: Object as PropType<IGroup>,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const emits = defineEmits(['update'])
const isPrivate = ref(props.group.accessType === 'PRIVATE')
const hasAccess = computed(() => props.group.memberState === 'APPROVED')
const query = ref('')
const router = useRouter()
const onSearch = (value: string) => {
  query.value = value
}

const goBack = () => {
  router.back()
}
</script>
<style scoped lang="scss">
.group {
  &-wrapper {
    --at-apply: 'font-poppins card-defaults md:overflow-hidden';
  }
}
</style>
