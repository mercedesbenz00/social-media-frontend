<template>
  <div>
    <div v-if="isAdmin" class="hidden lg:block">
      <PButton
        class="btn-outlined-primary px-8 text-sm"
        :label="$t('group.edit')"
        icon="i-figma:edit"
        @click.stop.prevent="router.push(group.id + '/group-settings')"
      />
    </div>

    <div v-else-if="buttons" class="flex items-center justify-center gap-x-4">
      <div v-if="!small && group.memberState !== 'NOT_MEMBER'">
        <PButton
          :loading="popupLoading"
          icon="i-figma:more-horizontal"
          @click.stop="(e) => togglePopup(e)"
          class="btn-flat-primary text-2xl"
          ref="popupTarget"
        />
        <PopupMenu ref="popup" :items="popupItems" />
      </div>

      <PButton
        v-for="(button, index) in buttons"
        :key="index"
        @click.stop.prevent="button.action"
        :label="button.label"
        :class="button.class"
        :icon="button.icon"
        :disabled="button.disabled"
        :loading="loading"
        class="px-8 text-sm"
      />
    </div>
    <GroupUpdate v-if="!small" :groupData="group" @update="() => emits('update')" ref="groupUpdate" />
  </div>
</template>
<script setup lang="ts">
import type { IGroup } from '@/data/groups/groups.interface'
import { useGroupsStore } from '@/data/groups/groups.store'
import { useMainStore } from '@/data/main.store'
import { useOnboardingStore } from '@/data/onboarding/onboarding.store'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import type { PropType } from 'vue'
const router = useRouter()
const $onboarding = useOnboardingStore()
const route = useRoute()
const props = defineProps({
  group: {
    type: Object as PropType<IGroup>,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  small: {
    type: Boolean,
    default: false,
  },
  onboarding: {
    type: Boolean,
    required: false,
    default: undefined,
  },
})
const $groups = useGroupsStore()
const emits = defineEmits(['update'])
const { t } = useI18n()
const loading = ref(false)
const popupLoading = ref(false)
const popup = ref()
const $main = useMainStore()
const popupTarget = ref()
const groupNotificationSettings = ref(false)
const { md } = useBreakpoints(breakpointsTailwind)
const togglePopup = async (event: any) => {
  try {
    popupLoading.value = true
    groupNotificationSettings.value = await $groups.getGroupsNotificationSettingsById(props.group?.id)
  } finally {
    popupLoading.value = false
  }
  popup.value.toggle(event)
}
const groupUpdate = ref()
const editGroup = () => {
  groupUpdate.value.show()
}
interface IButtonAction {
  label: string
  class: string
  icon: string
  disabled: boolean
  action?: () => void
}
const buttons = computed<IButtonAction[] | null>(() => {
  switch (props.group.memberState) {
    case 'INVITED':
      return [
        {
          label: t('group.join_ignore'),
          class: 'btn-outlined-primary',
          icon: '',
          disabled: false,
          action: () => {
            leave()
          },
        },
        {
          label: t('group.join_accept'),
          class: 'btn-primary',
          icon: 'i-figma:user-plus',
          disabled: false,
          action: () => {
            join()
          },
        },
      ]
    case 'PENDING':
      return [
        {
          label: md.value ? t('group.join_requested') : '',
          class: 'btn-outlined-primary',
          icon: 'i-figma:clock',
          disabled: true,
        },
      ]
    case 'APPROVED':
      if (props.group.invitePermission == 'MEMBER' && !props.small) {
        return [
          {
            label: t('group.invite'),
            class: 'btn-primary',
            icon: 'i-figma:plus',
            disabled: false,
            action: () => {
              if (!route.params?.id) router.push(route.fullPath + '/' + props.group.id + '/invite-members/all')
              else router.push(route.fullPath + '/invite-members/all')
            },
          },
        ]
      } else {
        return [
          {
            label: md.value ? t('group.joined') : '',
            class: 'btn-outlined-primary',
            icon: 'i-figma:user',
            disabled: true,
            action: () => {},
          },
        ]
      }
    case 'REJECTED':
      return [
        {
          label: md.value ? t('group.join_request') : '',
          class: 'btn-primary',
          icon: 'i-figma:user-plus',
          disabled: false,
          action: () => {
            join(true)
          },
        },
      ]
    case 'NOT_MEMBER':
      switch (props.group.accessType) {
        case 'PRIVATE':
          return [
            {
              label: md.value ? t('group.join_request') : '',
              class: 'btn-primary',
              icon: 'i-figma:user-plus',
              disabled: false,
              action: () => {
                join(true)
              },
            },
          ]
        case 'PUBLIC':
          return [
            {
              label: md.value ? t('group.join') : '',
              class: 'btn-primary',
              icon: 'i-figma:user-plus',
              disabled: false,
              action: () => {
                join()
              },
            },
          ]
        default:
          return []
      }
  }
})

const join = async (requiresApproval = false) => {
  loading.value = true
  await $groups.joinGroup(props.group.id, requiresApproval, props.onboarding)
  if (props.onboarding) $onboarding.groupsCount++
  loading.value = false
  emits('update')
}
const leave = async () => {
  loading.value = true
  await $groups.removeUserFromGroup(props.group.id)
  loading.value = false
  emits('update')
}
const popupItems = computed<any>(() => [
  {
    title: t('group.leave'),
    action: (e) => {
      $main.confirm({
        header: t('groups.leave_header'),
        message: t('groups.leave_message'),
        acceptLabel: t('acceptLabel'),
        rejectLabel: t('rejectLabel'),
        accept: async () => {
          await leave()
          togglePopup(e)
        },
        reject: () => {},
      })
    },
  },
  {
    title: groupNotificationSettings.value ? t('group.unmute') : t('group.mute'),
    icon: 'i-figma:users',
    action: (e) => {
      $groups.setGroupNotificationSettings(props.group.id, !groupNotificationSettings.value)
      togglePopup(e)
    },
  },
  {
    title: t('group.copy_link'),
    icon: 'i-figma:copy',
    action: () => {
      const href = window.location.origin
      navigator.clipboard.writeText(href + '/groups/' + props.group.id)
      $main.toast({
        type: 'success',
        message: t('toast.success'),
        detail: t('group.link_copied'),
      })
    },
  },
])
</script>
