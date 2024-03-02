<template>
  <div class="flex items-center">
    <div class="flex items-center lg:flex-col text-center text-sm" v-if="!isPrivate || hasAccess">
      <div class="me-4 lg:me-0 text-placeholder-primary">
        +{{ total - personIds.length }} {{ $t('group.members.more') }}
      </div>
      <router-link :to="{ path: `/groups/${groupId}/members` }" class="text-info hover:text-secondary">
        {{ $t('group.members.see_all') }}
      </router-link>
    </div>
    <div class="flex items-center lg:flex-col text-center text-sm" v-else>
      <router-link
        :to="{ path: `/groups/${groupId}/members`, hash: '#mutual-friends' }"
        class="text-primary hover:text-secondary"
      >
        +{{ mutualFriends.totalElements }} {{ $t('group.members.more_mutual') }}
      </router-link>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  isPrivate: {
    type: Boolean,
    required: false,
    default: false,
  },
  hasAccess: {
    type: Boolean,
    required: false,
    default: true,
  },
  total: {
    type: Number,
    required: true,
  },
  personIds: {
    type: Array as PropType<number[]>,
    required: true,
  },
  groupId: {
    type: Number,
    required: true,
  },
  mutualFriends: {
    type: Object as PropType<any>,
    required: false,
    default: {},
  },
  device: {
    type: String as PropType<'mobile | laptop | desktop'>,
    required: false,
    default: 'desktop',
  },
})
</script>
