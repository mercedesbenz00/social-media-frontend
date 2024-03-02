<template>
  <div class="flex flex-none space-x-1 items-center">
    <p-button
      class="btn-flat-primary text-2xl text-primary"
      :icon="!isRecording ? 'i-figma:mic' : 'i-fas:stop'"
      @click="toggleRecorder()"
    />
    <span v-if="recordTime && isNumber(recordTime)" class="w-12 flex-center-none">{{
      moment.utc(recordTime * 1000).format('mm:ss')
    }}</span>
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from '@/data/main.store'
import { isNumber } from 'lodash'
import moment from 'moment-with-locales-es6'
import Recorder from 'opus-recorder'
import encoderPath from 'opus-recorder/dist/waveWorker.min.js?url'

const { t } = useI18n()
const $main = useMainStore()
let audioRecorder = ref<Recorder | null>(null)
const audioChunks = ref<Blob[]>([])
const isRecording = ref(false)
let timer
const recordTime = ref<number>(0)
const emits = defineEmits(['input'])

const toggleRecorder = () => {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}

const stopRecording = () => {
  if (timer) clearInterval(timer)
  if (audioRecorder.value && isRecording.value) {
    isRecording.value = false
    audioRecorder.value.stop()
    audioRecorder.value.ondataavailable = (arrayBuffer: any) => {
      if (arrayBuffer.byteLength > 0) audioChunks.value.push(arrayBuffer)
    }
    audioRecorder.value.onstop = () => {
      // Create a Blob URL for audioBlob
      const audioBlob = new Blob(audioChunks.value, { type: 'audio/wav' })
      const audioBlobURL = URL.createObjectURL(audioBlob)
      // Create a File object
      const fileName = `Audio ${moment().format('HH:mm DD-MM-YYYY')}.wav`
      const file = new File([audioBlob], fileName, {
        type: audioBlob.type,
        lastModified: Date.now(),
      })
      // Create an Audio element to get audio metadata
      const audioObject = new Audio(audioBlobURL)
      audioObject.addEventListener('loadedmetadata', () => {
        const duration = audioObject.duration
        const record = {
          file: file,
          time: recordTime.value,
          name: fileName,
          size: audioBlob.size,
          type: audioBlob.type,
          duration: duration,
        }
        emits('input', record)
        recordTime.value = 0
        URL.revokeObjectURL(audioBlobURL)
      })
    }
  }
}

const startRecording = async () => {
  try {
    recordTime.value = 0
    if (timer) clearInterval(timer)
    timer = setInterval(() => {
      recordTime.value++
    }, 1000)
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    audioRecorder.value = new Recorder({ encoderPath })
    audioChunks.value = []
    await audioRecorder.value.start(stream)
    isRecording.value = true
  } catch (error) {
    console.error('Error starting recording:', error)
  }
}

watch(recordTime, (v) => {
  if (v > 600) toggleRecorder()
})

onBeforeUnmount(() => {
  audioRecorder.value?.stop()
  if (timer) clearInterval(timer)
})
</script>

<style lang="scss" scoped></style>
