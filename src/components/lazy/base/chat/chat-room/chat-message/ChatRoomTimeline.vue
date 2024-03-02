<template>
  <div class="chat-timeline" ref="content">
    <div v-if="false" ref="container" class="scroll-container">
      <div v-for="group in room.handler.timeline" :key="get(group, 'key')">
        <!-- Date Separator Begin -->
        <div :key="`date-${get(group, 'key')}`" class="date-separator">
          <span class="">{{ getGroupDate(get(group, 'key')) }}</span>
        </div>
        <!-- Date Separator End -->

        <!-- Messages Begin -->
        <div
          v-for="event in get(group, 'data').filter((e) => e.type === 'm.room.message')"
          :key="event.event_id"
          class="flex w-full"
        >
          <ChatRoomMessageItem v-if="event.type === 'm.room.message'" :event="event" :room="room" />
          <!-- <div v-else-if="event.type === 'm.room.member'" class="w-full flex items-center">
            <span class="h-px border-b border-dashed flex flex-1"></span>
            <span class="px-2">{{ chat.users[event.sender]?.profile?.displayName ?? 'Unknown' }} joined</span>
            <span class="h-px border-b border-dashed flex flex-1"></span>
          </div>
          <div v-else-if="!ignoredEvents.includes(event.type)">
            <p>{{ event.type }}</p>
            <json :value="event" :expand-depth="0"></json>
          </div> -->
        </div>
        <!-- Messages End -->
      </div>
    </div>
    <ul
      ref="container"
      class="overflow-y-scroll overflow-x-hidden scroll-auto absolute inset-0"
      v-reverse-scroll
      @scroll="scroll"
      @v-reverse-scroll:top-reached="loadMore"
      @v-reverse-scroll:mutated="mutated"
    >
      <li
        class="flex w-full"
        :class="i < room.handler.timeline.length - 2 ? 'flex-col' : ''"
        v-for="(event, i) in room.handler.timeline"
        :key="event"
      >
        <ChatRoomSeperator
          :current="event"
          :next="i < room.handler.timeline.length - 2 ? room.handler.timeline[i + 1] : undefined"
        >
        </ChatRoomSeperator>
        <ChatRoomMessageItem v-if="event.event.type === 'm.room.message'" :event="event" :room="room" />
      </li>
      <li
        class="flex w-full bg-bg-primary-light text-text-primary rounded-4 rounded-bl-0 ms-2 me-auto"
        :class="i < room.handler.timeline.length - 2 ? 'flex-col' : ''"
        v-if="get(messager, 'state.typing')"
      >
        {{ $t('typing') }}
      </li>
    </ul>

    <div v-if="!onBottom" class="absolute bottom-4 right-4">
      <PButton class="btn-primary" icon="i-figma:chevron-down" @click="scrollToBottom"></PButton>
    </div>
  </div>
</template>

<script setup>
import { useChatStore } from '@/data/chat/chat.store'
import { get, last } from 'lodash'
const $chat = useChatStore()
// const ignoredEvents = ['m.room.receipt', 'm.receipt']
const props = defineProps({
  room: {
    type: Object,
    required: true,
  },
})
const room = computed(() => {
  return $chat.rooms[props.room.id]
})
const members = computed(() => {
  return room.value.members.map((e) => $chat.users[e.id])
})
const messager = computed(() => members.value.find((e) => e?.id !== $chat.myId))
const container = ref()
const onBottom = ref(true)
let lastEventId
const scroll = (e) => {
  if (e && e.target) {
    const el = e.target
    onBottom.value = !(el.scrollHeight - el.scrollTop - el.clientHeight > 200)
  }
}
const scrollToBottom = () => {
  const el = toRaw(container.value)
  if (el)
    el.scroll({
      top: el.scrollHeight,
      behavior: 'smooth',
    })
}

const mutated = () => {
  const lastEvent = last(props.room.handler?.timeline)?.event
  if (lastEventId !== lastEvent?.event_id) {
    lastEventId = lastEvent?.event_id
    scrollToBottom()
  }
}

const loadMore = async () => {
  await $chat.moreAndMore(props.room.id)
}
</script>

<style lang="scss" scoped>
.chat-timeline {
  --at-apply: 'h-full  relative';
}
</style>
