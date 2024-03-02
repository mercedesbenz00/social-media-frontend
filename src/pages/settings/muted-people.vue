<template>
  <div class="max-w-[720px] w-full">
    <div class="hidden lg:block font-bold text-3xl mb-4">{{ $t('settings.muted_people_title') }}</div>
    <div v-if="mutedPeople && mutedPeople.length > 0" class="px-6 py-2 rounded-2xl primary-shadow">
      <div v-for="(people, index) in mutedPeople" :key="index" class="flex items-center border-bottom py-4">
        <Avatar class="!h-12 !w-12 me-2" :key="'avatar' + people.mutedPerson.id" :person-id="people.mutedPerson.id" />
        <div v-if="people.mutedPerson.displayName" class="font-bold text-lg">{{ people.mutedPerson.displayName }}</div>
        <div v-else class="font-bold text-lg">{{ people.mutedPerson.firstName }} {{ people.mutedPerson.lastName }}</div>
        <div class="ms-auto">
          <PButton
            @click="unMutePeople(people.mutedPerson.id)"
            class="btn-outlined-primary"
            :label="device === 'desktop' ? $t('settings.muted') : ''"
            icon="i-figma:volume-x"
          ></PButton>
        </div>
      </div>
    </div>
    <div v-else>{{ $t('settings.empty_muted') }}</div>
  </div>
</template>
<route lang="yaml">
meta:
  layout: settings
</route>
<script lang="ts" setup>
import { usePersonsStore } from '@/data/persons/persons.store'
import { useDeviceDetector } from '@/utils/device-detector.utils'

const $persons = usePersonsStore()
const mutedPeople = computed(() => $persons.mutedPeople)
const device = useDeviceDetector()
const unMutePeople = async (id: number) => {
  await usePersonsStore().unMutedPeople(id)
}
</script>
<style scoped lang="scss">
.border-bottom {
  border-bottom: 1px solid rgb(var(--bg-border-light));
  &:last-child {
    border-bottom: none;
  }
}
</style>
