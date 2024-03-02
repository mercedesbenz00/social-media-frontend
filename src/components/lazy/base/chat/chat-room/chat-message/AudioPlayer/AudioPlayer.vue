<template>
  <div class="relative">
    <div v-if="showDuration" class="flex justify-end px-2 top-0 end-0 absolute">
      <span v-if="isPlaying">{{ playedTime }}</span>
      <span v-else>{{ duration }}</span>
    </div>
    <div class="vac-audio-player pt-2">
      <p-button
        class="btn-flat-primary h-8 max-h-8"
        :icon="isAudioPlaying ? 'i-fas:stop' : 'i-fas:play'"
        @click="playback"
      >
      </p-button>
      <AudioControl
        :percentage="progress"
        @change-linehead="onUpdateProgress"
        @hover-audio-progress="$emit('hover-audio-progress', $event)"
      />

      <audio :id="audioSource" :src="audioSource" />
    </div>
  </div>
</template>

<script>
import { useChatStore } from '@/data/chat/chat.store'
export default {
  props: {
    messageId: { type: [String, Number], default: null },
    src: { type: String, default: null },
    size: { type: Number, default: 0 },
    showDuration: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['hover-audio-progress', 'update-progress-time'],

  data() {
    return {
      isPlaying: false,
      duration: this.convertTimeMMSS(0),
      playedTime: this.convertTimeMMSS(0),
      progress: 0,
      player: undefined,
    }
  },

  computed: {
    audioSource() {
      if (this.src) return this.src
      this.resetProgress()
      return null
    },
    audioArr() {
      return useChatStore().audioArray
    },
    calcUrl() {
      const url = this.src?.split('/')
      return url.pop()
    },
    isAudioPlaying() {
      const audio = this.audioArr.find((a) => a.url.includes(this.calcUrl))
      if (audio) return audio.isPlaying
      else return null
    },
  },
  watch: {
    isAudioPlaying(newValue) {
      if (!newValue) this.player.pause()
    },
  },

  mounted() {
    this.player = document.getElementById(this.src)
    const audio = useChatStore().audioArray.find((a) => a.url.includes(this.calcUrl))
    this.player.addEventListener('ended', () => {
      const audio = this.audioArr.find((a) => a.url.includes(this.calcUrl))
      audio.isPlaying = false
    })

    this.player.addEventListener('loadeddata', () => {
      this.resetProgress()
      this.duration = this.convertTimeMMSS(Number(audio?.info?.duration) || this.player.duration)
      this.updateProgressTime()
    })

    this.player.addEventListener('timeupdate', this.onTimeUpdate)
  },
  methods: {
    convertTimeMMSS(seconds) {
      return new Date(seconds * 1000).toISOString().substr(14, 5)
    },
    playback() {
      if (this.messageSelectionEnabled || !this.audioSource) return
      const audio = useChatStore().audioArray.find((a) => a.url.includes(this.calcUrl))
      if (this.isAudioPlaying) {
        this.player.pause()
        audio.isPlaying = false
      } else {
        useChatStore().audioArray.forEach((a) => {
          a.isPlaying = false
        })
        audio.isPlaying = true
        setTimeout(() => this.player.play())
      }
    },

    resetProgress() {
      const audio = useChatStore().audioArray.find((a) => a.url.includes(this.calcUrl))
      if (audio.isPlaying) this.player.pause()

      this.duration = this.convertTimeMMSS(0)
      this.playedTime = this.convertTimeMMSS(0)
      this.progress = 0
      audio.isPlaying = false
      this.updateProgressTime()
    },
    onTimeUpdate() {
      this.playedTime = this.convertTimeMMSS(this.player.currentTime)
      this.progress = (this.player.currentTime / this.player.duration) * 100
      this.updateProgressTime()
    },
    onUpdateProgress(pos) {
      if (pos) this.player.currentTime = pos * this.player.duration
    },
    updateProgressTime() {
      this.$emit('update-progress-time', this.progress > 1 ? this.playedTime : this.duration)
    },
  },
}
</script>
<style lang="scss" scoped>
.vac-audio-player {
  display: flex;

  .vac-svg-button {
    max-width: 18px;
    margin-left: 7px;
  }
}

@media only screen and (max-width: 768px) {
  .vac-audio-player {
    margin: 4px 0 0px;

    .vac-svg-button {
      max-width: 16px;
      margin-left: 5px;
    }
  }
}
</style>
