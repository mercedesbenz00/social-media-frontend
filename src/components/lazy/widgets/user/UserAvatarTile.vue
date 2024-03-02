<template>
  <div v-if="user" class="flex">
    <Avatar
      class="me-4"
      :person-id="userId"
      :class="{
        'w-10 h-10': size === 'x-small',
        'w-12 h-12': size === 'small',
        'w-16 h-16': size === 'normal',
      }"
    />
    <div class="w-full">
      <div
        @click.stop="onNameClick"
        class="font-bold cursor-pointer"
        :class="{
          'text-xs': size === 'x-small',
          'text-sm': size === 'small',
          'text-xl': size === 'normal',
        }"
        v-if="displayName"
      >
        {{ displayName }}
      </div>
      <div class="date">
        <slot name="note"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IPerson } from '@/data/persons/persons.interface.js'
import { usePersonsStore } from '@/data/persons/persons.store'
import { router } from '@/plugins/0/router.plugin.js'

const $person = usePersonsStore()
const props = defineProps({
  userId: {
    type: [String, Number],
    required: true,
  },
  size: {
    type: String,
    validator: (v: string) => ['small', 'normal', 'x-small'].includes(v),
    default: 'normal',
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})
$person.getPersonById(props.userId)

const user = computed<IPerson>(() => $person.cacheUserById(props.userId))

const onNameClick = () => {
  if (user.value) {
    router.push(`/profile/${user.value.id}`)
  }
}

const displayName = computed(() => $person.cacheUserDisplayNameById(props.userId))
</script>

<style lang="scss" scoped>
.date {
  --at-apply: 'text-sm text-text-primary-light';
}
</style>
