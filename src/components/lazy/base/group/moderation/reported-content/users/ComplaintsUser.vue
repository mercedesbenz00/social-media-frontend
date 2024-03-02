<template>
  <div class="cursor-pointer" @click="showReasonOther = !showReasonOther">
    <div class="flex items-center">
      <Avatar :person-id="user.id" class="w-16 h-16" />
      <div class="ms-2">
        <div class="text-sm font-bold">{{ user.displayName }}</div>
        <div class="flex items-center text-xs">
          <div class="font-bold">{{ get(complaint.reason, 'name') }}</div>
          <div class="ms-1">{{ moment(complaint.createdAt).locale(locale).fromNow() }}</div>
        </div>
      </div>
    </div>
    <div v-if="complaint.reasonOther && showReasonOther" class="mt-2 text-xs">{{ complaint.reasonOther }}</div>
    <PDivider />
  </div>
</template>
<script setup lang="ts">
import { usePersonsStore } from '@/data/persons/persons.store'
import type { PropType } from 'vue'
import moment from 'moment-with-locales-es6'
import { get } from 'lodash'

const showReasonOther = ref(false)
const { locale } = useI18n()
const $persons = usePersonsStore()
const props = defineProps({
  complaint: {
    type: Object as PropType<any>,
    required: true,
  },
})
const user = ref({} as any)
const fetchUser = async () => {
  user.value = await $persons.getPersonById(props.complaint.authorId)
}

onMounted(fetchUser)
</script>
