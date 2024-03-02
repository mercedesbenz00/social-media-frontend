<template>
  <div class="w-full" :class="floating ? 'border-t-px border-text-primary/20' : ''">
    <div
      class="media-preview w-full relative flex items-center justify-center"
      :class="floating ? 'h-16 py-1' : 'h-24 pb-2'"
      v-if="loading && !media"
    >
      <PSkeleton width="80%" height="1.2rem" />
    </div>
    <div v-if="media" class="media-preview w-full relative" :class="floating ? 'h-16 py-1' : 'h-24 pb-2'">
      <div class="-end-2 -top-2 absolute">
        <p-button class="btn-flat-primary" icon="i-figma:x" @click="clearMedia"></p-button>
      </div>
      <div class="w-full h-full flex overflow-y-auto items-center justify-center">
        <img
          v-if="media.msgtype === 'm.image'"
          :src="media.reversedUrl"
          :alt="media.info.fileName"
          class="h-full rounded-md"
        />
        <img
          v-if="media.msgtype == 'm.sticker' || media.msgtype == 'm.gif'"
          :src="media.url"
          :alt="media.info.fileName"
          class="h-full rounded-md"
        />
        <AudioPlayer
          v-else-if="media.msgtype === 'm.audio'"
          :src="media.reversedUrl"
          class="h-full rounded-md border-px border-text-primary/20"
        />
        <video
          v-else-if="media.msgtype === 'm.video'"
          class="h-full rounded-md border-px border-text-primary/20"
          controls
        >
          <source :src="media.reversedUrl" :type="media.info.mimetype" />
        </video>
        <div
          v-else-if="media.msgtype === 'm.file'"
          class="h-full rounded-md border-px border-text-primary/20 flex items-center"
        >
          <div v-tooltip.bottom="media.info.fileName" class="i-figma:file text-xl cursor-pointer"></div>
          <span>{{ media.info.fileName }}</span>
        </div>
      </div>
    </div>

    <div class="chat-input-box" :class="floating ? 'px-1' : 'px-1 primary-shadow border-1 border-gray-400 rounded-xl'">
      <div class="input-wrapper flex space-x-2 items-center">
        <p-button
          class="btn-flat-primary text-2xl text-primary"
          icon="i-figma-paperclip"
          @click.stop="file_dropdown_rect.toggle($event)"
        />
        <p-textarea
          v-model="text"
          class="textarea"
          :class="floating ? 'px-0 floating' : 'px-2'"
          :rows="floating ? 1 : textareaRow"
          :auto-resize="floating"
          :placeholder="$t('chat.write_message')"
          @keydown="onKeyDownHandler"
          maxlength="3000"
        />
      </div>
      <div class="button-wrapper">
        <div v-if="!floating || displayEmojiStickerAndLoader" class="flex flex-none">
          <p-button class="btn-flat-primary text-2xl text-primary" icon="i-far:face-smile" @click="toggle" />
          <div>
            <POverlayPanel ref="file_dropdown_rect" class="z-999" :autoZIndex="false">
              <FileSelector accept-extensions=".jpg,.png,.svg" :max-file-size="5 * 1024 * 1024" @validated="selectFile">
                <div
                  class="btn-flat-primary rounded-none p-4 cursor-pointer !bg-white !hover:bg-bg-primary-extra-light"
                >
                  <div class="i-figma-image text-xl"></div>
                </div>
              </FileSelector>
              <FileSelector
                accept-extensions=".mp4,.mov,.wmv,.avi"
                :max-file-size="5 * 1024 * 1024"
                @validated="selectFile"
              >
                <div
                  class="btn-flat-primary rounded-none p-4 cursor-pointer !bg-white !hover:bg-bg-primary-extra-light"
                >
                  <div class="pi pi-video text-xl"></div>
                </div>
              </FileSelector>
              <FileSelector
                accept-extensions=".doc,.docx,.xls,.xlsx,.txt,.pdf,.rar,.zip,.html,csv,.htm"
                :max-file-size="5 * 1024 * 1024"
                @validated="selectFile"
              >
                <div
                  class="btn-flat-primary rounded-none p-4 cursor-pointer !bg-white !hover:bg-bg-primary-extra-light"
                >
                  <div class="pi pi-file text-xl"></div>
                </div>
              </FileSelector>
            </POverlayPanel>
          </div>
        </div>
        <p-button
          :disabled="loading"
          v-if="!floating"
          class="btn-send"
          :label="$t('chat.send')"
          @click="sendMessage"
        ></p-button>
      </div>
      <POverlayPanel ref="emoji_rect" class="w-320px z-999" :autoZIndex="false">
        <EmojiStickerWrapper
          :disable-skin-tones="true"
          @close="emoji_rect.hide()"
          @input:emoji="onSelectEmoji"
          @input:sticker="onSelect($event, 'sticker')"
          @input:gif="onSelect($event, 'gif')"
        />
      </POverlayPanel>
      <AudioRecordButton @input="handleRecord"></AudioRecordButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from '@/data/chat/chat.store'
import { useMainStore } from '@/data/main.store'
import { useFileSystemAccess } from '@vueuse/core'
import type { FsValidationResult } from 'vue-file-selector/dist'

const props = defineProps({
  roomId: {
    type: String,
    required: true,
  },
  floating: {
    type: Boolean,
    default: false,
  },
  displayEmojiStickerAndLoader: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['onSendMessage'])
const sanitizeText = (input: any) => {
  const tempElement = document.createElement('div')
  tempElement.textContent = input
  return tempElement.innerHTML
}
const text = ref('')
const loading = ref(false)
const sendMessage = () => {
  if (!text.value.length && !media.value) return
  emits('onSendMessage', sanitizeText(text.value), media.value)
  text.value = ''
  media.value = undefined
}
const clearMedia = () => {
  media.value = undefined
}
const emoji_rect = ref()
const toggle = (event) => {
  emoji_rect.value.toggle(event)
}
const file_dropdown_rect = ref()

const onSelectEmoji = (emoji) => {
  text.value += emoji.i
}
const onSelect = (sticker, type) => {
  const { item_media, content_description } = sticker
  if (item_media.tinygif) {
    media.value = {
      msgtype: `m.${type}`,
      url: type == 'sticker' ? item_media.tinygif_transparent.url : item_media.tinygif.url,
      info: {
        mimeType: 'image/gif',
        size: type == 'sticker' ? item_media.tinygif_transparent.size : item_media.tinygif.size,
        fileName: content_description,
      },
    }
  }
  emoji_rect.value.hide()
}

const selectedFileType = ref()
const fileType = ref({
  IMAGE: 'image',
  VIDEO: 'video',
  FILE: 'file',
})

const acceptedFileTypes = computed(() => {
  const type = fileType.value
  switch (selectedFileType.value) {
    case type.FILE:
      return {
        description: 'file',
        accept: {
          'application/msword': ['.doc', '.docx'],
          'application/vnd.ms-excel': ['.xls', '.xlsx'],
          'text/plain': ['.txt'],
          'application/pdf': ['.pdf'],
          'application/zip': ['.zip'],
          'application/x-rar-compressed': ['.rar'],
          'application/x-rar': ['.rar'],
          'text/html': ['.html', '.htm'],
          'text/csv': ['.csv'],
          'application/x-compressed': ['.rar'],
          'application/octet-stream': ['.rar'],
          'application/x-zip-compressed': ['.zip'],
          'multipart/x-zip': ['.zip'],
        },
      }
    case type.VIDEO:
      return {
        description: 'video',
        accept: { 'video/*': ['.mp4', '.mov'] },
      }
    case type.IMAGE:
      return {
        description: 'image',
        accept: { 'image/*': ['.jpeg', '.jpg', '.gif'] },
      }
  }
})

const $main = useMainStore()
const chat = useChatStore()
const media = ref(undefined as any)

let timeout
watch(text, (n) => {
  if (n.length) {
    // send typing
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      chat.sendTyping(props.roomId, true)
    }, 500)
  } else {
    // send end typing
    chat.sendTyping(props.roomId, false)
  }
})

const textareaRow = computed(() => {
  const count = [...text.value].filter((c) => c == '\n').length + 1
  return count < 3 ? count : 3
})
const onKeyDownHandler = (e) => {
  const keyIsEnter = e.keyCode === 13 && !e.shiftKey
  const keyIsShiftEnter = e.keyCode === 13 && e.shiftKey

  if (keyIsEnter && !loading.value) {
    e.preventDefault()
    e.stopPropagation()

    sendMessage()
    return
  }

  if (keyIsShiftEnter) {
    text.value += '\n'
    e.preventDefault()
    e.stopPropagation()
    return
  }
}
const dataType = ref('Text') as any
const res = computed(() =>
  useFileSystemAccess({
    dataType,
    types: [acceptedFileTypes.value as any],
    excludeAcceptAllOption: true,
  })
)
const showToast = (msg: any) => {
  $main.toast({
    type: 'warn',
    message: t('toast.error'),
    detail: msg,
  })
}
const { t } = useI18n()
const selectFile = async (result: FsValidationResult, files: File[]) => {
  try {
    loading.value = true
    if (files[0].size > 2e7) {
      showToast(t('chat.file_big'))
      return
    }
    let type = files[0].type?.split('/')[0]
    if (type === 'application' || files[0].type.startsWith('text/')) type = 'file'
    const mediaUrl = await chat.uploadContent(files[0])
    const file = files[0]
    if (mediaUrl) {
      const reversedUrl = chat.client?.mxcUrlToHttp(mediaUrl)
      media.value = {
        msgtype: `m.${type}`, // 'image', 'video', 'file' -> Items are able to update on fileType
        url: mediaUrl,
        reversedUrl,
        info: {
          mimeType: file.type,
          size: file.size,
          fileName: file.name,
        },
      }
    }
  } finally {
    loading.value = false
  }
}

const handleRecord = async (record) => {
  loading.value = true
  if (record) {
    selectedFileType.value = 'audio'
    const mediaUrl = await chat.uploadRecord(record)
    if (mediaUrl) {
      const reversedUrl = chat.client?.mxcUrlToHttp(mediaUrl)
      media.value = {
        msgtype: `m.${selectedFileType.value}`,
        url: mediaUrl,
        reversedUrl: reversedUrl,
        info: {
          mimeType: record.type,
          size: record.size,
          fileName: record.name,
          duration: record.duration.toString(),
        },
      }
      chat.audioArray.push(media.value)
    }
  }
  loading.value = false
}

// const textareaClass = computed(() => {
//   const classList = ['', 'h-8', 'h-12', 'h-16']
//   return classList[textareaRow.value]
// })
</script>

<style scoped lang="scss">
.lazy-image-loader {
  & img {
    width: auto;
    margin: auto;
    height: 100%;
  }
}
.chat-input-box {
  --at-apply: 'w-full flex items-center  overflow-hidden ';

  :deep(.p-editor-container .p-editor-toolbar.ql-snow) {
    display: none !important;
  }
  :deep(.p-editor-container .p-editor-content.ql-snow) {
    --at-apply: 'border-none';
  }
  :deep(.ql-editor) {
    --at-apply: 'p-2 before:text-base';
    p {
      --at-apply: 'text-base';
    }
  }
  :deep(.ql-editor.ql-blank) {
    --at-apply: 'text-xl! placeholder-xl';
  }

  .input-wrapper {
    --at-apply: 'flex-1 position-relative py-1 h-full';

    .textarea {
      --at-apply: 'w-full rounded-none border-none focus-visible:outline-none text-sm h-full min-h-10 max-h-24 overflow-y-auto';
      &.floating {
        --at-apply: 'rounded-2xl max-h-8 min-h-6 py-2 px-4 text-xs me-2';
        border: 1px solid rgb(var(--bg-border-light));
      }
    }
    .p-inputtext:enabled:focus {
      --at-apply: 'filter-none';
    }
  }

  .button-wrapper {
    --at-apply: 'flex items-center';
    .btn-send {
      --at-apply: 'btn-primary text-sm flex-none !min-h-4';
    }
  }
}
:deep(input[type='file']) {
  --at-apply: 'hidden';
}
</style>
