<template>
  <PCarousel v-if="value && value.length > 1" :value="value">
    <template #item="slotProps">
      <div
        v-if="slotProps.data.mimeType.startsWith('image')"
        class="post-media bg-cover bg-center cursor-pointer"
        :class="mediaClass"
        :style="`background-image: url(${slotProps.data.path})`"
      ></div>
      <div v-if="slotProps.data.mimeType.startsWith('video')" class="post-media">
        <video-player
          class="w-full"
          :src="slotProps.data.path"
          controls
          :type="slotProps.data.mimeType"
        >
        </video-player>
      </div>
    </template>
  </PCarousel>
  <div v-else :class="fullSize ? '' : 'px-16'">
    <div
      v-if="value[0].mimeType.startsWith('image')"
      class="post-media bg-cover bg-center cursor-pointer"
      :class="mediaClass"
      :style="`background-image: url(${value[0].path})`"
    ></div>
    <div v-if="value[0].mimeType.startsWith('video')" class="post-media">
      <video-player
        class="w-full"
        :src="value[0].path"
        controls
        :type="value[0].mimeType"
      >
      </video-player>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  value: {
    type: Object,
    required: true,
  },
  fullHeight: {
    type: Boolean,
    default: false,
  },
  fullSize: {
    type: Boolean,
    default: false,
  },
})

const mediaClass = computed(() => {
  return props.fullHeight ? 'full-height' : 'default-height'
})
</script>
<style scoped lang="scss">
.full-height {
  height: calc(100vh - 9rem);
}
.default-height {
  width: 100%;
  height: 400px;
}

.post-media {
  video {
    height: 300px;
  }
}
</style>
