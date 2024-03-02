<template>
  <div class="max-w-[720px] w-full">
    <div class="hidden lg:block mb-4 font-bold text-3xl">{{ $t('settings.blocked_people_title') }}</div>
    <div v-if="blockedPeople && blockedPeople.length > 0" class="px-6 py-2 rounded-2xl primary-shadow">
      <div v-for="(people, index) in blockedPeople" :key="index" class="flex items-center border-bottom py-4">
        <Avatar
          class="!h-12 !w-12 me-2"
          :key="'avatar' + people.blockedPerson.id"
          :person-id="people.blockedPerson.id"
        />
        <div v-if="people.blockedPerson.displayName" class="font-bold text-lg">
          {{ people.blockedPerson.displayName }}
        </div>
        <div v-else class="font-bold text-lg">
          {{ people.blockedPerson.firstName }} {{ people.blockedPerson.lastName }}
        </div>
        <div class="ms-auto">
          <PButton
            @click="unBlockPeople(people.blockedPerson.id)"
            class="btn-outlined-error"
            :label="device === 'desktop' ? $t('settings.blocked') : ''"
            icon="i-figma:x-circle"
          ></PButton>
        </div>
      </div>
    </div>
    <div v-else>{{ $t('settings.empty_blocked') }}</div>
  </div>
</template>
<route lang="yaml">
meta:
  layout: settings
</route>
<script lang="ts" setup>
import { useMainStore } from '@/data/main.store'
import { usePersonsStore } from '@/data/persons/persons.store'
import { useDeviceDetector } from '@/utils/device-detector.utils'

const device = useDeviceDetector()
const $main = useMainStore()
const $persons = usePersonsStore()
const blockedPeople = computed(() => $persons.blockedPeople)
const { t } = useI18n()

const unBlockPeople = async (id: number) => {
  $main.confirm({
    header: t('settings.blocked_people_unblock_header'),
    message: t('settings.blocked_people_unblock_message'),
    acceptLabel: t('acceptLabel'),
    rejectLabel: t('rejectLabel'),
    accept: async () => {
      await usePersonsStore().unBlockPeople(id)
    },
    reject: () => {},
  })
}

const fetch = async () => {
  await $persons.getBlockedPeople()
}

onMounted(fetch)
</script>
<style scoped lang="scss">
.border-bottom {
  border-bottom: 1px solid rgb(var(--bg-border-light));
  &:last-child {
    border-bottom: none;
  }
}
</style>
