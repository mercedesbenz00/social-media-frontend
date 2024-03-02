<template>
  <div class="flex items-center">
    <Avatar
      :src="user.person?.avatar?.path || user.bennedPerson?.avatar?.path"
      :person-id="user.personId ?? user?.bannedPerson?.id ?? user.id"
      class="w-12 h-12 md:w-16 md:h-16 cursor-pointer"
    />
    <div class="text-sm ms-2">
      <div>
        <span class="font-bold">{{ user.displayName ?? user?.bannedPerson?.displayName }}</span>
        <span v-if="user.bannedPerson">
          &nbsp;
          {{ t('moderation.is_muted_for') }} {{ convertTime }}
          {{ convertTime == 1 ? t('moderation.day') : t('moderation.days') }}</span
        >
        <span v-if="actionText && md">&nbsp;{{ actionText }}</span>
      </div>
      <div v-if="user.bannedPerson" class="text-text-secondary-light text-sm">
        {{ moment(user.createdAt).fromNow() }}
      </div>
    </div>
    <div class="ms-auto">
      <UniversalButtons :user="user" :status="status" @update="emits('update', $event)" />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { IUser } from '@/data/auth/auth.interface'
import type { PropType } from 'vue'
import moment from 'moment-with-locales-es6'
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
const props = defineProps({
  user: {
    type: Object as PropType<any>,
    required: true,
  },
  actionText: {
    type: String,
    required: false,
    default: '',
  },
  status: {
    type: Object as PropType<any>,
    required: false,
    default: undefined,
  },
})
const md = useBreakpoints(breakpointsTailwind).greater('md')
const { t } = useI18n()
const emits = defineEmits(['update'])
const convertTime = computed(() => {
  const diff = moment.duration(props.user.expiredAt - props.user.createdAt)
  return Math.ceil(diff.asDays())
})
</script>
