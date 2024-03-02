<template>
  <PDialog
    class="edit-rules"
    :draggable="false"
    v-model:visible="display"
    :breakpoints="{ '960px': '720px', '640px': '90vw' }"
    :style="{ width: '50vw' }"
  >
    <template #header>
      <span class="font-bold text-lg text-text-primary">{{ $t('group.edit_rules') }}</span>
    </template>
    <div class="sticky top-0 z-10">
      <hr class="border-gray-300 mb-4" />
    </div>
    <form v-if="groupData && groupData.id">
      <InputField>
        <p-textarea
          :autoResize="true"
          :rows="5"
          :cols="35"
          class="rounded-lg"
          id="rules"
          v-model="form.rules"
          :placeholder="$t('group.form.rules')"
        >
        </p-textarea>
      </InputField>
    </form>
    <template #footer>
      <div class="mt-6">
        <hr class="border-gray-300 mb-4" />
        <PButton :loading="loading" @click="updateGroup" class="p-button-primary px-8" :label="$t('group.form.save')" />
      </div>
    </template>
  </PDialog>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { IGroup } from '@/data/groups/groups.interface'
import { useGroupsStore } from '@/data/groups/groups.store'

const display = ref(false)
const show = () => (display.value = true)

const emit = defineEmits(['update'])

const props = defineProps({
  groupData: {
    type: Object as PropType<IGroup>,
    default: undefined,
  },
})

const form = ref({
  rules: '',
})

const loading = computed(() => useGroupsStore().loading)

const updateGroup = async () => {
  const group = (await useGroupsStore().updateGroup({ groupId: props.groupData?.id, payload: form.value })) as IGroup
  if (group.id) {
    emit('update', group)
    display.value = false
  }
}

onMounted(async () => {
  const { rules } = props.groupData as any
  form.value = {
    rules,
  }
})

defineExpose({
  show,
})
</script>

<style lang="scss">
.edit-rules {
  border-radius: 16px !important;
  .p-dialog-header {
    border-top-left-radius: 16px !important;
    border-top-right-radius: 16px !important;
  }
  .p-dialog-footer {
    border-bottom-left-radius: 16px !important;
    border-bottom-right-radius: 16px !important;
  }

  .p-datepicker-trigger {
    --at-apply: 'flex-1';
  }

  .label {
    --at-apply: '!h-auto !font-normal';
  }
}
</style>
