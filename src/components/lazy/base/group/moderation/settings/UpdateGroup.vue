<template>
  <div class="relative">
    <InputField :label="t('moderation.settings.name')" :errors="v$.name.$errors">
      <p-input-text v-model="form.name" @blur="v$.name.$touch" />
    </InputField>
    <InputField :label="t('moderation.settings.description')" :errors="v$.description.$errors">
      <p-input-text v-model="form.description" @blur="v$.description.$touch" />
    </InputField>
    <InputField :label="t('moderation.settings.posting_permissions')" :errors="v$.postingPermission.$errors">
      <p-dropdown v-model="form.postingPermission" :options="options" @blur="v$.postingPermission.$touch" />
    </InputField>
    <PDivider />
    <div>
      <div class="text-sm mb-1 lg:text-base">{{ t('moderation.settings.access_type') }}</div>
      <div class="flex items-center">
        <p-input-switch v-model="form.accessType" class="input-switch" />
        <div class="ms-2 text-sm lg:text-base">{{ t('moderation.settings.private_group') }}</div>
      </div>
    </div>
    <PDivider />
    <div>
      <div class="font-bold text-sm lg:text-base mb-1">{{ t('moderation.settings.invite_title') }}</div>
      <div class="text-sm lg:text-base">
        <div class="flex flex-wrap gap-3">
          <div class="flex align-items-center">
            <p-radio-button v-model="form.invitePermission" inputId="ADMIN" name="ADMIN" value="ADMIN" />
            <label for="admin" class="ml-2">{{ t('moderation.settings.admin_can_invite') }}</label>
          </div>
          <div class="flex align-items-center">
            <p-radio-button v-model="form.invitePermission" inputId="MEMBER" name="MEMBER" value="MEMBER" />
            <label for="all" class="ml-2">{{ t('moderation.settings.member_can_invite') }}</label>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-end mt-4">
      <PButton
        class="text-sm lg:text-base"
        :disabled="v$.$invalid"
        :label="t('profile_update.save')"
        icon="i-figma:save"
        :loading="loading"
        @click="updateGroup"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { GroupPostingPermissions, type IGroupData } from '@/data/groups/groups.interface'
import { useGroupsStore } from '@/data/groups/groups.store'
import { debounce } from 'lodash'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@/utils/validators.utils'
import { useMainStore } from '@/data/main.store'

const { t } = useI18n()
const posting = ref('')
const form = reactive({
  name: '',
  description: '',
  tags: [''],
  postingPermission: 'ALL' as string | undefined,
  accessType: false as boolean,
  invitePermission: '' as string | undefined,
})
const loading = ref(false)
const route = useRoute()
const { id } = route.params
const options = computed(() => Object.keys(GroupPostingPermissions))
const group = ref({} as IGroupData)
const $groups = useGroupsStore()
const fetchGroup = async () => {
  group.value = await $groups.getGroupById(Number(id))
  const { name, description, postingPermission, invitePermission, accessType } = group.value
  form.name = name
  form.description = description
  form.postingPermission = postingPermission
  form.invitePermission = invitePermission
  form.accessType = accessType == 'PRIVATE' ? true : false
}

const rules = {
  name: {
    required,
  },
  description: {
    required,
  },
  postingPermission: {
    required,
  },
}

const v$ = useVuelidate(rules, form, {
  $autoDirty: true,
})
onMounted(fetchGroup)
const updateGroup = async () => {
  if (v$.value.$invalid) return
  try {
    loading.value = true
    const payload = {
      ...form,
      accessType: form.accessType ? 'PRIVATE' : 'PUBLIC',
    }
    await $groups.updateGroup({ groupId: id, payload })
  } finally {
    loading.value = false
  }
}
</script>
<style scoped lang="scss">
@media screen and (max-width: 769px) {
  :deep(.label) {
    --at-apply: 'ps-0 text-sm lg:ps-2 lg:text-xl';
  }
}
.input-switch {
  --at-apply: 'w-8 h-5 lg:w-12 lg:h-7';
}
</style>
