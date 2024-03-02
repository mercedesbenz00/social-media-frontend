<template>
  <div class="users-list">
    <div v-for="user in users" :key="user.id">
      <UsersItem
        :user="user"
        :action-text="actionText"
        :status="statuses?.find((s) => s.personId == user.id)"
        @update="emits('update', $event)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { IUser } from '@/data/auth/auth.interface'
import type { PropType } from 'vue'
const emits = defineEmits(['update'])
const props = defineProps({
  users: {
    type: Array as PropType<IUser[]>,
    required: true,
  },
  actionText: {
    type: String,
    required: false,
    default: '',
  },
  statuses: {
    type: Array as PropType<any>,
    required: true,
  },
})
</script>
<style scoped lang="scss">
.users {
  &-list {
    --at-apply: 'flex flex-col gap-y-2 md:gap-y-4 border border-bg-purple-light/50 mx-px p-4 md:border-none md:card-defaults mt-2 md:mt-4 md:p-6';
  }
}
</style>
