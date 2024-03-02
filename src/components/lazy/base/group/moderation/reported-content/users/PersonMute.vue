<template>
  <div v-if="!ban">
    <div class="flex items-center">
      <PButton
        icon="i-figma:user-x"
        :class="handleMute ? 'btn-primary' : 'btn-outlined-primary'"
        @click="handleMute = !handleMute"
      />
      <div class="ms-2 text-text-secondary-light text-xs">
        {{ t('moderation.mute') }} {{ displayName }} <span v-if="handleMute">{{ t('moderation.for') }}</span>
      </div>
    </div>
    <div v-if="handleMute">
      <PDivider />
      <div class="flex items-center space-x-2">
        <PButton
          class="!px-2 !py-1 !min-h-[21px] !h-[21px] text-xs"
          :class="muteValue == item.val ? 'btn-primary' : 'btn-outlined-primary'"
          size="small"
          v-for="(item, index) in muteOptions"
          :key="index"
          :label="item.label"
          @click="mute(item.val)"
          :loading="loading"
        />
      </div>
    </div>
  </div>
  <div v-else class="flex items-center">
    <PButton
      class="btn-primary"
      icon="i-figma:user-x"
      @click="unmute"
      :loading="loading"
      v-tooltip.bottom="$t('moderation.unmute')"
    />
    <div class="ms-2">
      {{ t('moderation.person_muted', { displayName, date }) }}
      {{ date > 1 ? t('moderation.days') : t('moderation.day') }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { usePersonsStore } from '@/data/persons/persons.store'
import moment from 'moment-with-locales-es6'
const { locale } = useI18n()
const $persons = usePersonsStore()
const props = defineProps({
  personId: {
    type: Number,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
})
const emits = defineEmits(['refresh'])
const loading = ref(false)
const { t } = useI18n()
const route = useRoute()
const { id } = route.params
const handleMute = ref(false)
const unmute = async () => {
  if (!ban.value) return
  try {
    loading.value = true
    await $persons.deleteGroupBan(ban.value.id)
    await fetchGroupBans()
  } finally {
    loading.value = false
  }
}
const mute = async (val: number) => {
  try {
    loading.value = true
    muteValue.value = val
    await $persons.createGroupBan({
      personId: props.personId,
      groupIds: [Number(id)],
      reason: 'reason',
      days: val,
    })
    await fetchGroupBans()
  } finally {
    loading.value = false
  }
}
const muteValue = ref(0)
const muteOptions = ref([
  {
    label: '1 day',
    val: 1,
  },
  {
    label: '1 week',
    val: 7,
  },
  {
    label: '1 month',
    val: 30,
  },
  {
    label: '1 year',
    val: 365,
  },
])
const groupBans = ref()
const ban = ref()
const date = computed(() => {
  if (!ban.value) return
  const start_date = moment(ban.value.createdAt)
  const end_date = moment(ban.value.expiredAt)
  return end_date.diff(start_date, 'days') + 1
})
const fetchGroupBans = async () => {
  groupBans.value = await $persons.getGroupBans({ groupIds: route.params.id ?? route.params.id })
  ban.value = groupBans.value?.content?.find((i) => i.bannedPerson.id == props.personId)
}
onMounted(fetchGroupBans)
</script>
