<template>
  <div class="flex flex-col lg:flex-row items-center justify-center">
    <div @click="handleUploadAvatar(_.get(group, 'avatar'))" :class="isAdmin ? 'cursor-pointer' : ''">
      <img
        class="!w-[120px] !h-[120px] border-4 border-white rounded-full"
        :class="{ 'object-none': !avatar }"
        :src="avatar || assetImage('no-group.svg')"
      />
    </div>
    <div class="mt-4 lg:mt-14 lg:ms-4 lg:space-y-2">
      <div class="font-bold text-xl" v-if="device == 'desktop'">{{ _.get(group, 'name') }}</div>
      <div class="flex items-center space-x-2 justify-center lg:justify-start">
        <div class="i-figma:users w-4 h-4 text-primary"></div>
        <div class="text-xs text-primary">
          <span>{{ memberCount }}</span>
          <span class="ms-1">{{ memberCount > 1 ? t('group.total_members') : t('group.total_member') }}</span>
        </div>
      </div>
      <div class="w-full mt-2 max-w-80 min-w-60 w-full" v-if="device !== 'desktop' && isAdmin">
        <router-link
          :to="'/groups/' + group.id + '/group-settings'"
          class="flex items-center justify-center p-button btn-outlined-primary w-full"
        >
          <i class="i-figma:edit me-2"></i>
          <div>{{ t('group.edit') }}</div>
        </router-link>
      </div>
    </div>
    <div class="mx-auto md:mx-0 md:ms-auto mt-2 lg:mt-14">
      <GroupActions :is-admin="isAdmin" :group="group" @update="emits('update')" />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { IGroup } from '@/data/groups/groups.interface'
import type { PropType } from 'vue'
import _ from 'lodash'
import { useGroupsStore } from '@/data/groups/groups.store'
import { useAssets } from '@/composables/useAssets'

const $groups = useGroupsStore()
const props = defineProps({
  group: {
    type: Object as PropType<IGroup>,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
  device: {
    type: String as PropType<'mobile | tablet | desktop'>,
    required: false,
    default: 'desktop',
  },
})

const emits = defineEmits(['update'])
const assetImage = useAssets
const { t } = useI18n()
const avatar = computed(() => _.get(props.group, 'avatar.path'))
const memberCount = computed(() => {
  return _.get(props.group, 'stats.membersCount') ?? 0
})
const handleUploadAvatar = (payload: any) => {
  const { $vfm } = useGlobals()
  if (props.isAdmin) {
    const component = resolveComponent('AvatarUpload')
    $vfm.show({
      component,
      bind: {
        drag: false,
        size: 'auto',
        adaptive: false,
        noActions: true,
        src: payload?.path ?? '',
        title: t('group.avatar_upload'),
      },
      on: {
        upload: async (payload) => {
          await $groups.setAvatar({ groupId: props.group.id, payload })
          emits('update')
          $vfm.hideAll()
        },
      },
    })
  } else {
    const component = resolveComponent('FullSizeImage')
    $vfm.show({
      component,
      bind: {
        drag: false,
        size: 'auto',
        adaptive: false,
        noActions: true,
        url: payload?.path ?? '',
      },
      on: {
        close: () => {
          $vfm.hideAll()
        },
      },
    })
  }
}
</script>
