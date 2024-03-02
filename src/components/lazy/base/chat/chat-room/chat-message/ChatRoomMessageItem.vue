<template>
  <div
    id="content"
    ref="target"
    v-intersection-observer.once="onIntersectionObserver"
    class="content"
    :class="[
      innerEvent.sender == chat.myId ? 'my-message' : 'others-message',
      innerEvent.content.msgtype == 'm.sticker' || innerEvent.content.msgtype == 'm.gif'
        ? '!shadow-none !bg-transparent'
        : '',
      ,
    ]"
    @click="receipt"
  >
    <div v-if="innerEvent.content.msgtype == 'm.text'" class="item">
      <div v-if="mediaText">
        <img v-if="mediaText.type === 'image'" :src="mediaText.url" :alt="innerEvent.content.body" />
      </div>
      <div v-else>
        <div v-if="/<\/?[a-z][\s\S]*>/i.test(innerEvent.content.body)" v-html="innerEvent.content.body"></div>
        <p v-else>{{ innerEvent.content.body }}</p>
      </div>
    </div>
    <div v-else-if="innerEvent.content.msgtype == 'm.image'" class="item">
      <img
        @click="openImage(media.url)"
        v-if="media"
        :src="media.url"
        :alt="innerEvent.content.body"
        class="rounded-md cursor-pointer"
      />
    </div>
    <div v-else-if="innerEvent.content.msgtype == 'm.audio'" class="item">
      <AudioPlayer v-if="media" :src="media.url" :size="media.duration"></AudioPlayer>
      <p v-if="innerEvent.content.body">{{ innerEvent.content.body }}</p>

      <!-- <audio v-if="media" controls>
        <source :src="media.url" :type="innerEvent.content.info.mimetype" />
      </audio> -->
    </div>
    <div v-else-if="innerEvent.content.msgtype == 'm.video'" class="item">
      <video v-if="media" controls>
        <source :src="media.url" />
      </video>
      <p v-if="innerEvent.content.body">{{ innerEvent.content.body }}</p>
    </div>
    <div v-else-if="innerEvent.content.msgtype == 'm.file'" class="item">
      <div class="flex items-center gap-x-2">
        <div v-tooltip.bottom="media.filename" class="i-figma:download cursor-pointer" @click="download(media)"></div>
        <div class="text-xs">{{ media.filename }}</div>
      </div>
      <p v-if="innerEvent.content.body">{{ innerEvent.content.body }}</p>
    </div>
    <div
      v-else-if="innerEvent.content.msgtype == 'm.gif' || innerEvent.content.msgtype == 'm.sticker'"
      class="item w-1/2 ms-auto"
    >
      <img :src="innerEvent.content.url" :alt="innerEvent.content.body" class="rounded-md ms-auto" />
      <p v-if="innerEvent.content.body">{{ innerEvent.content.body }}</p>
    </div>
    <div v-else-if="innerEvent.content.msgtype == 'm.image-shared'" class="item">
      <img
        @click="router.push(innerEvent.content.originalLink)"
        v-if="media"
        :src="media.url"
        :alt="innerEvent.content.body"
        class="rounded-md cursor-pointer"
      />
      <p v-if="innerEvent.content.body">{{ innerEvent.content.body }}</p>
    </div>
    <div v-else-if="innerEvent.content.msgtype == 'm.video-shared'" class="item">
      <video v-if="media" controls>
        <source :src="media.url" :type="innerEvent.content.info.mimetype" />
      </video>
      <p @click="router.push(innerEvent.content.originalLink)" v-if="innerEvent.content.body">
        {{ innerEvent.content.body }}
      </p>
    </div>
    <div v-else>
      <pre>{{ event }}</pre>
    </div>
    <div
      :class="
        innerEvent.content.msgtype == 'm.sticker' || innerEvent.content.msgtype == 'm.gif'
          ? ' w-full p-1 rounded-2xl max-w-max bg-primary-dark/75'
          : ''
      "
      class="flex justify-end items-center chatroom-info"
    >
      <!--<div>{{ chat.users[innerEvent.sender]?.profile?.displayName ?? 'Unknown' }}-{{ innerEvent.sender }}</div>-->
      <div class="chatroom-time" :class="innerEvent.sender !== chat.myId ? 'text-gray-400' : ''">
        {{ formattedTime }}
      </div>
      <div v-if="innerEvent.sender == chat.myId" class="pl-1 text-xs text-white">
        <div v-if="isUnread" class="i-fas:check"></div>
        <div v-else class="i-fas:check-double"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useChatStore } from '@/data/chat/chat.store'
import { vIntersectionObserver } from '@vueuse/components'
import moment from 'moment-with-locales-es6'

const chat = useChatStore()
const router = useRouter()
const { locale } = useI18n()

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
  room: {
    type: Object,
    required: true,
  },
})
onMounted(() => {
  if (props.event.event.content.msgtype === 'm.audio') {
    const item = props.event.event.content
    item.room_id = props.event.event.room_id
    item.isPlaying = false
    useChatStore().audioArray.push(item)
  }
})

onUnmounted(() => {
  useChatStore().audioArray = useChatStore().audioArray.filter((audio) => audio.room_id !== props.event.event.room_id)
})
const openImage = (mediaUrl) => {
  const { $vfm } = useGlobals()
  const component = resolveComponent('FullSizeImage')
  $vfm.show({
    component,
    bind: {
      drag: false,
      size: 'auto',
      noActions: true,
      adaptive: false,
      url: mediaUrl,
    },
    on: {
      close: () => {
        $vfm.hideAll()
      },
    },
  })
}

const innerEvent = computed(() => {
  return props.event.event
})

const target = ref(null)
let isVisible = false

const visibleOnce = () => {
  isVisible = true

  setTimeout(() => {
    chat.handleEventVisible(props.event)
  }, 300)
}

const receipt = () => {
  chat.tryReceipt(props.event, props.room)
}

const formattedTime = computed(() => {
  const messageDate = moment(innerEvent.value.origin_server_ts)
  const now = moment()
  const diff = now.diff(messageDate, 'days')

  if (diff > 0) {
    return moment(innerEvent.value.origin_server_ts).locale(locale.value).format('hh:mm A')
  }
  return moment(innerEvent.value.origin_server_ts).locale(locale.value).fromNow()
})

const isUnread = computed(() => {
  if (!props.room.lastFullyReadTime) return true
  return props.room.lastFullyReadTime < innerEvent.value.origin_server_ts
})

const media = computed(() => {
  if (
    (innerEvent.value.content.msgtype === 'm.image' || innerEvent.value.content.msgtype === 'm.image-shared') &&
    chat.client
  )
    return {
      type: 'image',
      filename: innerEvent.value.content.info.fileName,
      url: chat.client.mxcUrlToHttp(innerEvent.value.content.url),
    }
  if (innerEvent.value.content.msgtype === 'm.video-shared') {
    return {
      filename: innerEvent.value.content.info.fileName,
      type: 'video',
      url: chat.client.mxcUrlToHttp(innerEvent.value.content.url),
    }
  }
  if (innerEvent.value.content.msgtype === 'm.audio' && chat.client)
    return {
      type: 'audio',
      filename: innerEvent.value.content.info.fileName,
      all: innerEvent.value.content,
      url: chat.client.mxcUrlToHttp(innerEvent.value.content.url),
    }

  if (innerEvent.value.content.msgtype === 'm.video' && chat.client)
    return {
      filename: innerEvent.value.content.info.fileName,
      type: 'video',
      url: chat.client.mxcUrlToHttp(innerEvent.value.content.url),
    }
  if (innerEvent.value.content.msgtype === 'm.file' && chat.client)
    return {
      type: 'file',
      filename: innerEvent.value.content.info.fileName,

      url: chat.client.mxcUrlToHttp(innerEvent.value.content.url),
    }
  return
})

function download(m) {
  const fileName = m.filename
  var el = document.createElement('a')
  el.setAttribute('href', m.url)
  el.setAttribute('download', fileName)
  el.setAttribute('target', '_blank')
  document.body.appendChild(el)
  el.click()
  el.remove()
}

const mediaText = computed(() => {
  const text = `${innerEvent.value.content.body}`
  if (text.startsWith('data:image') || !!text.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp)$/gi))
    return {
      type: 'image',
      url: text,
    }
})

function onIntersectionObserver([e]) {
  if (e.isIntersecting && !isVisible) visibleOnce()
}
</script>

<style lang="scss" scoped>
.content {
  --at-apply: 'my-2  p-3 max-w-80% min-w-200px w-auto overflow-y-auto overflow-x-hidden relative my-2 primary-shadow';

  .item {
    --at-apply: 'pb-4 text-sm break-words	';
    p {
      --at-apply: 'whitespace-pre-line';
    }
  }
  .chatroom-info {
    --at-apply: 'position-absolute bottom-1 right-3';
    .chatroom-time {
      font-size: 10px;
    }
  }
}
.my-message {
  --at-apply: 'bg-primary-dark/75 text-white self-end rounded-4 rounded-br-0 me-2 ms-auto';
}
.others-message {
  --at-apply: 'bg-bg-primary-light text-text-primary rounded-4 rounded-bl-0 ms-2 me-auto';
}
</style>
