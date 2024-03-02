<template>
  <BaseRenderlessModal title="" subtitle="">
    <div class="group-update">
      <div class="group-update-form">
        <div>
          <InputField :label="t('group.name')" :errors="v$.name.$errors">
            <p-input-text
              class="min-w-160"
              id="name"
              v-model="form.name"
              :placeholder="t('group.name')"
              @blur="v$.name.$touch"
            ></p-input-text>
          </InputField>
          <InputField :label="t('group.description')" :errors="v$.name.$errors">
            <p-textarea
              class="rounded"
              id="description"
              v-model="form.description"
              :placeholder="t('group.description')"
              @blur="v$.description.$touch"
            ></p-textarea>
          </InputField>
          <InputField :label="t('group.tags')">
            <p-input-text
              class="rounded"
              id="tag"
              v-model="searchTag"
              :placeholder="t('group.search_tag')"
            ></p-input-text>
          </InputField>
        </div>
        <div class="py-6 flex justify-end gap-3">
          <PButton @click="close" class="p-button-outlined" :label="t('post.ban_button_label_no')" />
          <PButton @click="onConfirm" class="p-button-primary" :label="t('post.ban_button_label_yes')" />
        </div>
      </div>
    </div>
  </BaseRenderlessModal>
</template>
<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required } from '@/utils/validators.utils'
import { useGroupsStore } from '@/data/groups/groups.store'
import type { IGroupAccessType, IGroupPostingPermissionTypes } from '@/data/groups/groups.interface'
const { t } = useI18n()
const props = defineProps({
  groupId: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['confirmed', 'close'])
const searchTag = ref('')
const form = reactive({
  name: '',
  description: '',
  accessType: '' as IGroupAccessType,
  postingPermission: '' as IGroupPostingPermissionTypes,
  tags: [] as Array<any>,
})

const rules = {
  name: {
    required,
  },
  description: {
    required,
  },
}

const v$ = useVuelidate(rules, form, {
  $autoDirty: true,
})

const onConfirm = async () => {
  emit('confirmed', form)
}

const close = () => {
  emit('close')
}

onMounted(async () => {
  const groupData = await useGroupsStore().getGroupById(props.groupId)
  const { name, description, accessType, tags, postingPermission } = groupData
  form.name = name
  form.description = description
  form.accessType = accessType
  form.postingPermission = postingPermission
  form.tags = [...tags]
})
</script>
<style scoped lang="scss">
.group-update-form {
  --at-apply: '';
}
</style>
