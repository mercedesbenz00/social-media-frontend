<template>
  <div class="px-6 py-2 primary-shadow flex flex-col rounded-2xl">
    <div v-if="loading" class="flex flex-col space-y-4">
      <div class="flex items-center" v-for="i in 3" :key="i">
        <PSkeleton shape="circle" width="48px" height="48px" />
        <PSkeleton class="ms-4 rounded-2xl" width="30%" height="2rem" />
        <PSkeleton class="ms-auto rounded-2xl" width="10%" height="2rem" />
      </div>
    </div>
    <MembersItem
      v-else
      v-for="(item, index) in data.content"
      :key="index"
      :group-id="groupId"
      :member-data="item"
      :is-admin="isAdmin"
      @update="() => emits('update')"
    />
  </div>
</template>
<script setup lang="ts">
import type { PropType } from 'vue'
defineProps({
  data: {
    type: Object as PropType<any>,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: false,
    default: false,
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
  groupId: {
    type: Number,
    required: true,
  },
})
const emits = defineEmits(['update'])
</script>
