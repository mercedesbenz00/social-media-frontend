<template>
  <div>
    <div class="flex items-center">
      <i v-if="icon" :class="icon" class="w-6 h-6 bg-primary me-2"></i>
      <div class="font-bold text-xl">{{ title }}</div>
      <div class="ms-auto" v-if="btnLabel">
        <PButton :label="btnLabel" class="w-120px" @click="emits('on-modal')" />
      </div>
    </div>
    <PDivider />
    <div v-if="items && items.length > 0">
      <div v-for="(item, index) in items" :key="index">
        <div class="flex items-center">
          <Avatar :src="item.person.avatar?.path ?? item.person.id ?? undefined" class="me-2 w-16 h-16" />
          <div class="text-sm font-bold">{{ item.person.displayName ?? 'no name' }}</div>
          <div v-if="showActions" class="ms-auto">
            <PButton
              :label="t('moderation.remove_moderator')"
              class="btn-outlined-primary w-120px"
              @click="emits('on-remove', item.id)"
            />
          </div>
        </div>
        <PDivider />
      </div>
    </div>
    <div v-else>{{ t('group.no_data') }}</div>
  </div>
</template>
<script setup lang="ts">
import type { PropType } from 'vue'
const { t } = useI18n()
const props = defineProps({
  items: {
    type: Array as PropType<any[]>,
    required: false,
    default: [],
  },
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: false,
    default: '',
  },
  showActions: {
    type: Boolean,
    required: false,
    default: false,
  },
  btnLabel: {
    type: String,
    required: false,
    default: '',
  },
})

const emits = defineEmits(['on-remove', 'on-modal'])
</script>
