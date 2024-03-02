<script lang="ts" setup>
import { useMainStore } from '@/data/main.store'
import type { PropType } from 'vue'

const $main = useMainStore()
const { t } = useI18n()

const props = defineProps({
  max: Number,
  uploadMsg: {
    type: String,
    default: 'upload.msg',
  },
  maxError: {
    type: String,
    default: 'upload.error.max',
  },
  fileError: {
    type: String,
    default: 'upload.error.file',
  },
  clearAll: {
    type: String,
    default: 'upload.clear_all',
  },
  addMoreItems: {
    type: String,
    default: 'upload.add_more',
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  isSingleMode: {
    type: Boolean,
    default: false,
  },
  previewImgs: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  filesArr: {
    type: Array as PropType<File[]>,
    required: false,
    default: () => [],
  },
  accept: {
    type: String,
    required: false,
    default: 'image/*, video/*',
  },
})

defineExpose({ reset, append, attachFiles })
const loading = ref(false)
const error = ref<string>('')
const files = ref<File[]>(props.filesArr ?? [])
const numberOfDrops = ref(0)
const previewImgs = ref<(string | ArrayBuffer | null)[]>(props.previewImgs)
const uploadInput = ref()

const emit = defineEmits(['changed'])

function dragOver(): void {
  numberOfDrops.value = 2
}

function drag() {}

function drop(e: DragEvent): void {
  let status = true
  let droppedFiles = (e.dataTransfer ? Array.from(e.dataTransfer.files) : []) as File[]
  if (e && droppedFiles) {
    droppedFiles.forEach((file) => {
      if (!(file.type.startsWith('image') || file.type.startsWith('video'))) status = false
    })
    if (status) {
      if (props.max && droppedFiles.length + files.value.length > props.max) {
        error.value = props.maxError ? t(props.maxError) : `Maximum files is` + props.max
      } else {
        files.value.push(...droppedFiles)
        getPreviewImgs(droppedFiles)
      }
    } else {
      error.value = props.fileError ? t(props.fileError) : `Unsupported file type`
    }
  }
  numberOfDrops.value = 0
}

function readAsDataURL(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise(function (resolve, reject) {
    let fr = new FileReader()
    fr.onload = function () {
      resolve(fr.result)
    }
    fr.onerror = function () {
      reject(fr)
    }
    fr.readAsDataURL(file)
  })
}

function append(): void {
  uploadInput.value.click()
}

function reset(): void {
  uploadInput.value.value = null
  previewImgs.value = []
  files.value = []
  totalSize.value = 0
  imagesCount.value = 0
  videosCount.value = 0
  currentPage.value = 0
  emit('changed', files.value)
}

function attachFiles(newFiles: File[]): void {
  loadFiles(newFiles)
}

function deleteImg(index) {
  previewImgs.value.splice(index, 1)
  const file: File = files.value.splice(index, 1)[0]
  totalSize.value -= file.size
  if (file && file.type.startsWith('image')) imagesCount.value -= 1
  else if (file && file.type.startsWith('video')) videosCount.value -= 1
  emit('changed', files.value)
  uploadInput.value.value = null
}

function getVideoCover(file, seekTo = 0.0): Promise<File> {
  return new Promise((resolve, reject) => {
    const videoPlayer = document.createElement('video')
    videoPlayer.setAttribute('src', URL.createObjectURL(file))
    videoPlayer.load()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    videoPlayer.addEventListener('error', (ex) => {
      reject('error when loading video file')
    })
    videoPlayer.addEventListener('loadedmetadata', () => {
      if (videoPlayer.duration < seekTo) {
        reject('video is too short.')
        return
      }
      setTimeout(() => {
        videoPlayer.currentTime = seekTo
      }, 200)
      videoPlayer.addEventListener('seeked', () => {
        const canvas = document.createElement('canvas')
        canvas.width = videoPlayer.videoWidth
        canvas.height = videoPlayer.videoHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height)
        ctx.canvas.toBlob(
          (blob) => {
            resolve(blob as any)
          },
          'image/jpeg',
          0.75
        )
      })
    })
  })
}
const showToast = (msg: any) => {
  $main.toast({
    type: 'warn',
    message: msg,
    detail: msg,
  })
}
const currentPage = ref(0)
const totalSize = ref(0)
const videosCount = ref(0)
const imagesCount = ref(0)
const maxSizeImg = 1e7
const maxSizeVideo = 2e8
const maxTotalSize = 2.5e8
const maxVideos = 1
const maxImages = 25

const onUpload = (event: any) => {
  const newFiles = event?.currentTarget?.files
  if (newFiles && newFiles.length) {
    loadFiles(newFiles)
  }
}
const loadFiles = (newFiles: File[]) => {
  if (!newFiles) {
    return
  }

  if (props.isSingleMode) {
    previewImgs.value = []
    files.value = []
    totalSize.value = 0
    imagesCount.value = 0
    videosCount.value = 0
    currentPage.value = 0
  }
  if (newFiles.length === 1) {
    if (newFiles[0].type.startsWith('image')) {
      if (newFiles[0].size > maxSizeImg) {
        showToast(t('toast.image_max_size'))
        return
      }
      if (totalSize.value + newFiles[0].size > maxTotalSize) {
        showToast(t('toast.post_max_size'))
        return
      }
      if (imagesCount.value === maxImages) {
        showToast(t('toast.image_max_count'))
        return
      }
      imagesCount.value++
      totalSize.value += newFiles[0].size
    }
    if (newFiles[0].type.startsWith('video')) {
      if (newFiles[0].size > maxSizeVideo) {
        showToast(t('toast.video_max_size'))
        return
      }
      if (totalSize.value + newFiles[0].size > maxTotalSize) {
        showToast(t('toast.post_max_size'))
        return
      }
      if (videosCount.value === maxVideos) {
        showToast(t('toast.video_max_count'))
        return
      }
      videosCount.value++
      totalSize.value += newFiles[0].size
    }
  } else {
    newFiles.forEach((file) => {
      if (file.type.startsWith('video')) {
        if (file.size > maxSizeVideo) {
          showToast(t('toast.video_max_size'))
          return
        }
        if (totalSize.value + file.size > maxTotalSize) {
          showToast(t('toast.post_max_size'))
          return
        }
        if (videosCount.value >= maxVideos) {
          showToast(t('toast_video_max_count'))
          return
        }
        videosCount.value++
        totalSize.value += file.size
      }
      if (file.type.startsWith('image')) {
        if (file.size > maxSizeImg) {
          showToast(t('toast.image_max_size'))
          return
        }
        if (totalSize.value + file.size > maxTotalSize) {
          showToast(t('toast.post_max_size'))
          return
        }
        if (imagesCount.value >= maxImages) {
          showToast(t('toast.image_max_count'))
          return
        }
        imagesCount.value++
        totalSize.value += file.size
      }
    })
  }
  getPreviewImgs(newFiles)
}
async function getPreviewImgs(newFiles: File[]) {
  if (props.max && newFiles && newFiles.length + files.value.length > props.max) {
    error.value = props.maxError ? t(props.maxError) : `Maximum files is` + props.max
    return
  }
  if (numberOfDrops.value === 0) files.value.push(...newFiles)
  error.value = ''
  emit('changed', files.value)
  let readers: Promise<string | ArrayBuffer | null>[] = []
  if (!files.value.length) return
  for (let i = 0; i < files.value.length; i++) {
    const currentItem = files.value[i]
    if (currentItem.type.startsWith('video')) {
      try {
        loading.value = true
        readers.push(readAsDataURL(await getVideoCover(currentItem)))
      } finally {
        loading.value = false
      }
      continue
    }
    readers.push(readAsDataURL(currentItem))
  }
  Promise.all(readers).then((values) => {
    previewImgs.value = values
  })
}

function getDeleteMessage(index: number): string {
  const item = files[index]
  if (item?.type.startsWith('video')) {
    return t('upload.delete.video')
  } else if (item?.type.startsWith('image')) {
    return t('upload.delete.image')
  }
  return ''
}

const canUploadMedia = computed(() => {
  return (previewImgs.value?.length === 0 && !props.readOnly) ?? false
})

const canUploadMore = computed(() => {
  return (!props.readOnly && !props.isSingleMode) ?? false
})

const hasUploadedMedia = computed(() => {
  return previewImgs.value?.length > 0 ?? false
})
</script>

<template>
  <div class="container" @dragover.prevent="dragOver" @dragleave.prevent="drag" @drop.prevent="drop($event)">
    <div class="drop" v-show="numberOfDrops === 2"></div>
    <!-- Error Message -->
    <div v-show="error" class="error">
      {{ error }}
    </div>
    <!-- To inform user how to upload image -->
    <div v-show="canUploadMedia" class="beforeUpload cursor-pointer">
      <input
        v-if="props.isSingleMode"
        type="file"
        style="z-index: 1"
        :accept="accept"
        ref="uploadInput"
        @change="onUpload"
      />
      <input v-else type="file" style="z-index: 1" :accept="accept" ref="uploadInput" @change="onUpload" multiple />
      <!-- <p class="mainMessage">
        {{ $t(props.uploadMsg) }}
      </p> -->
    </div>
    <LoaderSpinner v-if="loading" class="mx-auto" />
    <div class="imgsPreview" v-else-if="hasUploadedMedia">
      <span
        @click="reset"
        class="i-heroicons-solid:x clearButton pointer text-xl"
        v-tooltip.top="$t(props.clearAll)"
        v-if="!props.readOnly"
      ></span>
      <div v-if="canUploadMore" class="plus-btn" @click="append" v-tooltip.top="$t(props.addMoreItems)">
        <div class="i-heroicons-solid:plus-circle"></div>
      </div>
      <PCarousel :value="previewImgs" :numVisible="3" :page="currentPage" :showNavigators="previewImgs.length >= 3">
        <template #item="{ data, index }">
          <div class="imageHolder">
            <span
              v-if="files[index]?.type.startsWith('video')"
              class="i-heroicons-solid:video-camera isVideo text-xl"
            ></span>
            <img :src="data" />
            <span
              v-if="!props.readOnly"
              class="delete"
              style="color: white"
              @click="deleteImg(index)"
              v-tooltip.top="getDeleteMessage(index)"
            >
              <svg
                class="icon"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </span>
          </div>
        </template>
      </PCarousel>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  position: relative;
}

.drop {
  width: 100%;
  height: 100%;
  top: 0;
  border-radius: 10px;
  position: absolute;
  background-color: #f4f6ff;
  left: 0;
  border: 3px dashed #a3a8b1;
}

.error {
  text-align: center;
  color: red;
  font-size: 15px;
}

.beforeUpload {
  position: relative;
  text-align: center;
}

.icons {
  display: flex;

  & > div {
    display: flex;
  }
}

.beforeUpload input {
  width: 0;
  margin: auto;
  height: 0;
  opacity: 0;
  position: absolute;
  background: red;
  display: block;
}

.beforeUpload input:hover {
  cursor: pointer;
}

.beforeUpload .icon {
  width: 150px;
  margin: auto;
  display: block;
}

.imgsPreview {
  width: calc(100% - 10px);
}

.imgsPreview .imageHolder {
  width: 150px;
  height: 150px;
  background: #fff;
  position: relative;
  border-radius: 10px;
  margin: 5px 5px;
  display: inline-block;

  & .isVideo {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: rgba(255, 255, 255, 0.89);
    font-size: 24px;
  }
}

.imgsPreview .imageHolder img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.imgsPreview .imageHolder .delete {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 29px;
  height: 29px;
  color: #fff;
  background: red;
  border-radius: 50%;
}

.imgsPreview .imageHolder .delete:hover {
  cursor: pointer;
}

.imgsPreview .imageHolder .delete .icon {
  width: 66%;
  height: 66%;
  display: block;
  margin: 4px auto;
}

.plus-btn {
  color: #2d3748;
  background: #f7fafc;
  border-radius: 50%;
  font-size: 21pt;
  height: 30px;
  width: 30px;
  text-align: center;
  border: 1px dashed;
  line-height: 23px;
  position: absolute;
  right: 7px;
  bottom: 7px;
  z-index: 999;
}

.plus-btn:hover {
  cursor: pointer;
}

.clearButton {
  position: absolute;
  top: 7px;
  right: 7px;
  cursor: pointer;
  z-index: 999;
}

.mainMessage {
  font-size: 12px;
  font-weight: 400;
}

.p-input-icon-left {
  i {
    color: #62528f;
    font-size: 24px;
  }
}

[dir='rtl'] {
  .clearButton {
    left: 7px;
    right: auto;
  }
}
</style>
