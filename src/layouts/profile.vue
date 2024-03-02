<template>
  <default>
    <div class="w-full max-w-720px mx-auto mt-4">
      <router-view v-slot="{ Component }">
        <loader-spinner v-if="loading" class="!flex m-auto" />
        <component v-else-if="!loading && data.person" :is="Component" :data="data" @update="update" />
        <div v-else>data empty</div>
      </router-view>
    </div>
  </default>
</template>
<script setup lang="ts">
import { useAuthStore } from '@/data/auth/auth.store'
import type { IPerson } from '@/data/persons/persons.interface'
import { usePersonsStore } from '@/data/persons/persons.store'
const $auth = useAuthStore()
const $persons = usePersonsStore()
const route = useRoute()
const loading = ref(false)
const id = computed(() => Number(route.params.id))

const data = reactive({
  id: computed(() => id.value),
  me: computed(() => $auth.user && $auth.user.id === id.value),
  person: ref(null),
  isFollowing: computed(() => (data.me.value ? undefined : $auth.isFollowing(id.value))),
  isBlocked: computed(() => (data.me.value ? undefined : $persons.isBlocked(id.value))),
  isMuted: computed(() => (data.me.value ? undefined : $persons.isMuted(id.value))),
})

const handlePerson = async () => {
  try {
    loading.value = true
    if (!data.me) data.person = await $persons.getPersonById(Number(route.params.id))
    else data.person = (await $auth.me()) as IPerson
  } finally {
    loading.value = false
  }
}

const update = async () => {
  data.person = (await $auth.me(true)) as IPerson
}

watch(route, handlePerson, { immediate: true })
</script>
