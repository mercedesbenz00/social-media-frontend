<template>
  <PButton
    class="h-1"
    :class="button.class"
    :label="button.label"
    @click.stop.prevent="button.action"
    :icon="button.icon"
    :loading="loading"
    :disabled="button.disabled"
  />
</template>
<script setup lang="ts">
import { useGroupsStore } from '@/data/groups/groups.store'
import type { PropType } from 'vue'
const props = defineProps({
  state: {
    type: String as PropType<any>,
    required: true,
  },
  personId: {
    type: Number,
    required: true,
  },
})
const emits = defineEmits(['update'])
const $groups = useGroupsStore()
const route = useRoute()
const loading = ref(false)
const { id } = route.params
const isMember = ref<string>('NOT_A_MEMBER')
const getMemberStatus = async () => {
  loading.value = true
  try {
    const res = await $groups.isMember(id, props.personId.toString())
    isMember.value = res.state
  } catch (error) {
    isMember.value = 'NOT_A_MEMBER'
  } finally {
    loading.value = false
  }
}
const invite = async () => {
  loading.value = true
  try {
    await $groups.inviteToGroup(Number(id), props.personId)
    isMember.value = 'INVITED'
  } finally {
    loading.value = false
  }
}
const { t } = useI18n()
const button = computed(() => {
  switch (isMember.value) {
    case 'APPROVED':
      return {
        label: t('group.joined'),
        icon: 'i-figma:clock',
        class: 'btn-outlined-primary',
        disabled: true,
        action: () => {},
      }
    case 'INVITED':
      return {
        label: t('group.resend'),
        class: 'btn-primary',
        icon: 'i-figma:repeat',
        action: () => {
          invite()
        },
      }
    default:
      return {
        label: t('group.invite'),
        disabled: false,
        icon: 'i-figma:user-plus',
        action: () => {
          invite()
        },
      }
  }
})
onMounted(getMemberStatus)
</script>
