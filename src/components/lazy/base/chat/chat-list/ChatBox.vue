<template>
  <div class="mt-12 border-1 rounded border-gray-300 m-3 p-3 flex flex-col gap-3">
    <p-input-text @input="searchUser" v-model="searchUserText" placeholder="Please select a user" class="w-full" />
    <PVirtualScroller :items="userList.content" :itemSize="50" v-if="userList">
      <template #item="{ item, options }">
        <div :class="['scroll-item p-2', { odd: options.odd }]" style="height: 40px">
          <a href="#" @click="selectUser(item)">{{ item.displayName }}</a>
        </div>
      </template>
    </PVirtualScroller>
    <div v-if="user && user.id" class="flex flex-col gap-3">
      <p-input-text v-model="message" placeholder="Please enter a message" class="w-full" />
      <p-button
        class="p-button-primary"
        label="Start Chat"
        :disabled="!message.length"
        @click="$emit('onSend', { user, message })"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLodash } from '@/plugins/1/lodash.plugin'
import { usePersonsStore } from '@/data/persons/persons.store'

const userList = ref() as any
const loading = ref(false)
const user = ref()
const searchUserText = ref('')
const message = ref('')
defineEmits(['onSend'])

const lodash = useLodash()
const searchUser = lodash.debounce((e) => {
  const query = e.target.value
  fetchUsers({ query, followingFirst: true })
}, 500)

const fetchUsers = async (params = {}) => {
  loading.value = true
  user.value = undefined
  userList.value = await usePersonsStore().getAllPersons(params)
  loading.value = false
}

const selectUser = (u) => {
  user.value = u
  searchUserText.value = u.displayName
  userList.value = undefined
}
</script>

<style scoped></style>
