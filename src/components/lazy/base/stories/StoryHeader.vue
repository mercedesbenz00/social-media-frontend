<template>
  <div
    class="flex items-center absolute pt-9 px-6 bg-gradient-to-b from-black via-transparent w-full text-text-secondary font-xs"
  >
    <Avatar class="!w-[40px] !h-[40px] me-2" :person-id="person.id" :disallow-link="true"></Avatar>
    <div class="text-text-secondary">
      <div v-if="person.displayName" class="font-bold text-xs">{{ person.displayName }}</div>
      <div v-else class="font-bold text-xs">{{ person.firstName }} {{ person.lastName }}</div>
      <div class="text-10 text-text-secondary/75">{{ moment(new Date(createdAt)).locale(locale).fromNow() }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { IPerson } from '@/data/persons/persons.interface'
import { usePersonsStore } from '@/data/persons/persons.store'
import moment from 'moment-with-locales-es6'
const { locale } = useI18n()
const props = defineProps({
  personId: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['close'])
const person = ref({} as IPerson)
const $persons = usePersonsStore()
const fetchPerson = async () => {
  const personData = await $persons.getPersonById(props.personId)
  if (personData) person.value = personData
}

const onKeyDown = (e) => {
  if (e.keyCode === 27) {
    emit('close')
  }
}

onMounted(() => {
  fetchPerson()
  document.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped lang="scss">
.text-10 {
  font-size: 0.6rem;
  line-height: 0.875rem;
}
</style>
