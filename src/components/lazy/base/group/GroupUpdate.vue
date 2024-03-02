<template>
  <PDialog
    class="profile-update"
    :draggable="false"
    v-model:visible="display"
    :breakpoints="{ '960px': '720px', '640px': '90vw' }"
    :style="{ width: '50vw' }"
  >
    <template #header>
      <span class="font-bold text-lg text-text-primary">{{ $t('group.form.update_title') }}</span>
    </template>
    <div class="sticky top-0 z-10">
      <hr class="border-gray-300 mb-4" />
    </div>
    <form v-if="groupData?.id">
      <InputField :label="$t('group.form.name')" :errors="v$.name.$errors">
        <p-input-text
          id="name"
          v-model="form.name"
          :placeholder="$t('group.form.name')"
          @blur="v$.name.$touch"
        ></p-input-text>
      </InputField>
      <InputField :label="$t('group.form.description')" :errors="v$.description.$errors" class="mt-6">
        <p-textarea
          class="rounded-lg"
          id="description"
          v-model="form.description"
          :placeholder="$t('group.form.description')"
          @blur="v$.description.$touch"
        ></p-textarea>
      </InputField>
      <InputField :label="$t('group.form.tags')" class="mt-6">
        <p-dropdown
          id="tags"
          @change="onTagSelected"
          :filter="true"
          :show-clear="true"
          :options="allTags"
          optionLabel="tag"
          :placeholder="$t('group.form.tags')"
        />
      </InputField>
      <div class="flex-wrap flex gap-2">
        <div
          v-for="(tagItem, tagIndex) in form.tags"
          :key="tagIndex"
          class="rounded-full px-3 py-1 border-1 text-xs text-text-primary shadow-lg flex items-center"
        >
          <div class="i-heroicons-solid:x text-base" @click="removeTag(tagIndex)"></div>
          <span>{{ tagItem.tag }}</span>
        </div>
      </div>
      <InputField :label="$t('group.form.posting_permissions')" :errors="v$.postingPermission.$errors" class="mt-6">
        <p-dropdown
          id="postingPermission"
          :filter="false"
          :show-clear="true"
          v-model="form.postingPermission"
          :options="postingPermissions"
          @blur="v$.postingPermission.$touch"
          :placeholder="$t('group.form.posting_permission')"
        />
      </InputField>

      <InputField :label="$t('group.form.access_type')" class="mt-6">
        <div class="flex items-center gap-2">
          <PInputSwitch v-model="isPrivate" class="!w-48px" />
          <div class="flex-1">{{ $t('group.form.is_private') }}</div>
        </div>
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
import { useVuelidate } from '@vuelidate/core'
import { required } from '@/utils/validators.utils'
import type { PropType } from 'vue'
import type { IGroup, IGroupAccessType } from '@/data/groups/groups.interface'
import { useGroupsStore } from '@/data/groups/groups.store'
import { useTagStore } from '@/data/tags/tags.store'
import type { ITag } from '@/data/tags/tags.interface'
import { GroupPostingPermissions } from '@/data/groups/groups.interface'

const display = ref(false)
const show = () => (display.value = true)

const emit = defineEmits<{
  (event: 'update', data: any): void
}>()

const props = defineProps({
  groupData: {
    type: Object as PropType<IGroup>,
    default: undefined,
  },
})

const isPrivate = ref(false)
watch(isPrivate, (value) => {
  form.value.accessType = value ? 'PRIVATE' : ('PUBLIC' as IGroupAccessType)
})

const form = ref({
  name: '',
  description: '',
  accessType: '',
  postingPermission: '',
  tags: [] as Array<ITag>,
})

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

const allTags = computed(() => {
  return useTagStore().tags?.content ?? []
})

const onTagSelected = (e) => {
  form.value.tags.push(e.value as ITag)
}

const removeTag = (index) => {
  form.value.tags.splice(index, 1)
}

const loading = computed(() => {
  return useGroupsStore().loading
})

const updateGroup = async () => {
  const payload = {
    ...form.value,
    tags: form.value.tags.map((t) => t.id),
  }
  const group = (await useGroupsStore().updateGroup({ groupId: props.groupData?.id, payload })) as IGroup
  if (group.id) {
    emit('update', group)
    display.value = false
  }
}

const postingPermissions = computed(() => {
  return Object.keys(GroupPostingPermissions)
})

onMounted(async () => {
  await useTagStore().getAllTags()

  const { name, description, accessType, tags, postingPermission } = props.groupData as any

  isPrivate.value = accessType === ('PRIVATE' as IGroupAccessType)
  form.value = {
    name,
    description,
    accessType,
    postingPermission,
    tags: [...tags],
  }
})

defineExpose({
  show,
})
</script>

<style lang="scss">
.profile-update {
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
