<template>
  <div
    :class="loading ? 'animate-pulse' : ''"
    class="rounded-full h-12 w-12 flex flex-none items-center justify-center overflow-hidden bg-bg-primary border-primary border-2"
  >
    <img
      class="rounded-full cursor-pointer w-full h-full object-cover"
      :src="avatar || assetImage('no-avatar.svg')"
      @click.stop="!disallowLink ? gotoProfile() : $emit('open')"
    />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { useAssets } from '@/composables/useAssets'
import { usePersonsStore } from '@/data/persons/persons.store'
import { useRouter } from 'vue-router'
import { useGroupsStore } from '@/data/groups/groups.store'
import { useSizedImage } from '@/composables/useSizedImage'
const $person = usePersonsStore()
const $group = useGroupsStore()

const router = useRouter()
defineEmits(['open'])
const props = defineProps({
  personId: {
    type: [Number, String],
    default: undefined,
  },
  groupId: {
    type: [Number, String] as PropType<string | number | undefined>,
    default: undefined,
  },
  src: {
    type: String,
  },
  disallowLink: {
    type: Boolean,
    default: false,
  },
})

const loading = ref(false)

if (!props.src && props.personId) {
  $person.getPersonById(props.personId).finally(() => {
    loading.value = false
  })
}
if (!props.src && props.groupId) {
  $group.getGroupById(props.groupId).finally(() => {
    loading.value = false
  })
}
if (props.src) {
  loading.value = false
}

const person = computed(() => {
  if (props.personId) return $person.users[props.personId]
})
const group = computed(() => {
  if (props.groupId) return $group.groups[props.groupId]
})
const assetImage = useAssets

const avatar = computed(() => {
  let avatar: any
  if (props.src && props.src.length) return props.src
  if (person.value) avatar = person.value?.avatar?.path
  if (group.value) avatar = group.value?.avatar?.path
  return avatar
})

const gotoProfile = () => {
  if (props.personId) router.push(`/profile/${props.personId}`)
  if (props.groupId) router.push(`/groups/${props.groupId}`)
}
</script>

<style scoped></style>
