<template>
  <BaseListWithPagination v-bind="vBind">
    <template #action="{ item }">
      <MessageButton :person-id="lodash.get(item, 'id')" :label="$t('profile.follow_message')" />
    </template>
  </BaseListWithPagination>
</template>
<script lang="ts" setup>
import type { IPerson } from '@/data/persons/persons.interface'
import { get } from 'lodash'
import { router } from '@/plugins/0/router.plugin'
import { usePersonsStore } from '@/data/persons/persons.store'
const lodash = useLodash()

const { t } = useI18n()

const props = defineProps({
  params: {
    type: Object,
    required: false,
  },
  showPagination: {
    type: Boolean,
    required: false,
  },
})

function adapter(person: IPerson) {
  return {
    displayText: get(person, 'displayName'),
    assiveText: `${t('search_result.followers')}: ${person.followerCount} ${t('search_result.following')}: ${
      person.followingCount
    }`,
    avatar: get(person, 'avatar.path'),
  }
}

function goToDetail(person: IPerson) {
  router.push(`/profile/${person.id}`)
}

function keyGenerator(person: IPerson, index: number) {
  return `person-${get(person, 'id')}-${index}`
}

const vBind = {
  adapter,
  goToDetail,
  keyGenerator,
  request: usePersonsStore().getAllPersons,
  params: props.params,
  showPagination: props.showPagination,
}
</script>
