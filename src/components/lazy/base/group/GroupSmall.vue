<template>
  <component :is="!disableRouting ? 'router-link' : 'div'" :to="`/groups/${group.id}`" class="group">
    <GroupCover :not-clickable="true" :group-id="group.id" :cover="group.cover?.path" class="group-cover" />
    <div class="group-content">
      <Avatar class="!w-[48px] !h-[48px] group-avatar" :src="group.avatar?.path || assetImage('no-avatar.svg')" />
      <div class="group-text">
        <div class="font-bold text-sm">{{ group.name }}</div>
        <div class="flex items-center space-x-2 text-text-primary mt-2 md:mt-0">
          <div class="i-figma:users w-4 h-4"></div>
          <div class="text-xs">{{ group.stats?.membersCount ?? 0 }}</div>
        </div>
      </div>
      <PDivider class="hidden md:block" />
      <GroupActions :group="group" :small="true" @update="() => emits('update')" :onboarding="onboarding" />
    </div>
  </component>
</template>
<script setup lang="ts">
import { useAssets } from '@/composables/useAssets'
import type { IGroup } from '@/data/groups/groups.interface'
import type { PropType } from 'vue'

defineProps({
  group: {
    type: Object as PropType<IGroup>,
    required: true,
  },
  disableRouting: {
    type: Boolean,
    required: false,
    default: false,
  },
  onboarding: {
    type: Boolean,
    required: false,
    default: undefined,
  },
})
const assetImage = useAssets
const emits = defineEmits(['update'])
</script>
<style scoped lang="scss">
.group {
  --at-apply: 'font-poppins rounded-none md:rounded-2xl primary-none md:primary-shadow cursor-pointer';

  &-cover {
    --at-apply: 'max-h-[72px] rounded-t-2xl hidden md:block';
  }
  &-content {
    --at-apply: 'px-4 pb-4 mt-0 flex items-center md:block md:-mt-[30px]';
  }
  &-text {
    --at-apply: 'block md:flex text-xs md:text-base items-center w-full md:w-content ms-2 md:ms-0 justify-between mt-2 mb-4 min-h-[40px]';
  }
}
</style>
