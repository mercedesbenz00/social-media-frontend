<template>
  <BaseRenderlessModal :title="$t('chat.search_a_user_to_chat')">
    <div class="flex flex-col items-center justify-center gap-y-4">
      <PAutoComplete
        class="mt-4 w-full"
        forceSelection
        :placeholder="$t('chat.search_a_user_to_chat')"
        v-model="selectedPerson"
        :suggestions="suggestions"
        @complete="searchPersonByDisplayName($event)"
        field="displayName"
      >
        <template #item="slotProps">
          <div class="flex items-center">
            <img
              class="rounded-full w-10 h-10"
              :src="
                !!slotProps.item.avatar && !!slotProps.item.avatar.path
                  ? slotProps.item.avatar.path
                  : useAssets('no-avatar.svg')
              "
            />
            <div class="ml-2">{{ slotProps.item.displayName }}</div>
          </div>
        </template>
      </PAutoComplete>
      <PButton
        :label="$t('chat.start_to_chat')"
        :loading="chatStore.initRoomLoading"
        :disabled="userId === null"
        @click="openChat"
      />
    </div>
  </BaseRenderlessModal>
</template>

<script setup lang="ts">
import { usePersonsStore } from '@/data/persons/persons.store'
import { useAssets } from '@/composables/useAssets'
import { useChatStore } from '@/data/chat/chat.store'

const emit = defineEmits(['close'])
const props = defineProps({
  isFloatingView: {
    type: Boolean,
    default: true,
  },
})
const selectedPerson = ref()
const persons = ref()
const searchPersonByDisplayName = async (e) => {
  const params = { displayNameQuery: e.query }
  const showError = !navigator?.onLine
  persons.value = await usePersonsStore().getAllPersons(params, undefined, showError)
}
const suggestions = computed(() => {
  return persons.value?.content ?? null
})

const userId = computed(() => {
  return selectedPerson.value?.id ?? null
})

const chatStore = useChatStore()

const openChat = async () => {
  await chatStore.initRoom(userId.value, props.isFloatingView)
  emit('close')
}
</script>

<style scoped></style>
