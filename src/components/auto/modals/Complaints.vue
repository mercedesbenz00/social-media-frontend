<template>
  <BaseRenderlessModal :title="title">
    <div class="gap-y-2 mt-8">
      <div class="text-sm font-bold">{{ t('complaints.title') }}</div>
      <div class="text-sm">{{ t('complaints.subtitle') }}</div>
    </div>
    <div class="flex flex-col" v-if="reasons">
      <div class="" v-for="(r, i) in reasons.content" :key="i">
        <PDivider />
        <div class="flex items-center gap-x-2 text-sm">
          <PRadioButton :id="`complaint-${i}`" name="complaint" :value="r" v-model="selectedReason" />
          <label :for="`complaint-${i}`">
            {{ !!r.localizations && !!r.localizations[locale] ? r.localizations[locale] : r.name }}
          </label>
        </div>
      </div>
      <div class="">
        <PDivider />
        <div class="flex items-center gap-x-2">
          <PRadioButton id="complaint-other" name="complaint" :value="other" v-model="selectedReason" />
          <label for="complaint-other">
            {{ !!other.localizations && !!other.localizations[locale] ? other.localizations[locale] : other.name }}
          </label>
        </div>
      </div>
    </div>
    <div class="mt-3" v-if="selectedReason?.name === 'Others'">
      <div class="text-base mb-2 ps-8">{{ t('group.form.description') }}</div>
      <p-textarea :autoResize="true" :rows="3" v-model="description" class="rounded-lg w-full resize-none" />
    </div>
    <div class="flex justify-end mt-4">
      <PButton
        @click="onComplaint"
        :label="t('complaints.submit')"
        :disabled="buttonDisabled"
        :loading="loading"
        class="w-128px"
      />
    </div>
  </BaseRenderlessModal>
</template>

<script setup lang="ts">
import { usePostsStore } from '@/data/posts/posts.store'
import { usePersonsStore } from '@/data/persons/persons.store'
import type { PropType } from 'vue'
import type { IPost, IComment } from '@/data/posts/posts.interface'
import { COMPLAINT_TYPE } from '@/data/main.model'

const { t } = useI18n()
const { locale } = useI18n()
const emit = defineEmits(['close'])
const props = defineProps({
  complaintType: {
    type: String,
    default: 'post',
  },
  post: {
    type: Object as PropType<IPost>,
    default: () => {},
  },
  comment: {
    type: Object as PropType<IComment>,
    default: () => {},
  },
  title: {
    type: String,
    default: '',
    required: true,
  },
  subtitle: {
    type: String,
    default: null,
  },
})

const other = {
  localizations: {
    ar: 'آخر',
    en: 'Others',
  },
  name: 'Others',
}
const $post = usePostsStore()
const $person = usePersonsStore()
const reasons = ref()
const description = ref('')
const selectedReason = ref()
const loading = ref(false)

const buttonDisabled = computed(() => {
  return (
    (selectedReason.value?.name === 'Others' && description.value.length === 0) || selectedReason.value === undefined
  )
})

const onComplaint = async () => {
  loading.value = true
  if (props.complaintType === COMPLAINT_TYPE.POST) {
    const payload = {
      postId: props.post.id.toString(),
      reason: {
        id: selectedReason.value?.id,
        name: selectedReason.value?.name,
      },
      reasonOther: description.value ?? '',
    }
    await $post.complaintPost(payload)
  } else if (props.complaintType === COMPLAINT_TYPE.COMMENT) {
    const payload = {
      commentUuid: props.comment.commentUuid,
      reason: {
        id: selectedReason.value?.id,
        name: selectedReason.value?.name,
      },
      reasonOther: description.value ?? '',
    }
    await $post.complaintComment(payload)
  } else if (props.complaintType === COMPLAINT_TYPE.PERSON) {
    const payload = {
      personId: props.post.authorId,
      reason: description.value,
      reasonId: selectedReason.value?.id,
      userGroupId: props.post.userGroupId,
    }
    await $person.complaintUser(payload)
  }
  loading.value = false
  emit('close')
}

onMounted(async () => {
  if (props.post?.id || props.comment?.id) reasons.value = await $post.getPostComplaintItems()
})
</script>
