<template>
  <div class="max-w-[35%] w-full">
    <div v-if="isPause && isGif" class="relative cursor-pointer" @click="onToggleImage">
      <div class="i-figma:pause absolute inset-0 m-auto bg-bg-primary-light"></div>
      <img :src="imgSrc" alt="img" />
    </div>
    <img v-else-if="!isPause && isGif" :src="data?.path" alt="gif" @click="onToggleImage" class="cursor-pointer" />
    <div v-else-if="isImage" class="relative">
      <img :src="imgSrc" alt="img" @click="openImage" class="cursor-pointer" />
    </div>
    <div v-else-if="isVideo" class="post-media">
      <video class="mb-4 w-full" controls>
        <source :src="data.path" :type="data.mimeType" />
      </video>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})
const isPause = ref(false)
const imgSrc = ref()

function onToggleImage() {
  isPause.value = !isPause.value
}

const isGif = computed(() => (props.data && props.data?.mimeType?.startsWith('image/gif')) ?? false)
const isImage = computed(() => (props.data && props.data?.mimeType?.startsWith('image')) ?? false)
const isVideo = computed(() => (props.data && props.data?.mimeType?.startsWith('video')) ?? false)

const generateCanvas = () => {
  if (props.data.mimeType.startsWith('image')) {
    const image = document.createElement('img')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    image.src = props.data?.path
    image.crossOrigin = 'Anonymous'
    image.addEventListener('load', () => {
      canvas.width = image.width
      canvas.height = image.height
      ctx!.drawImage(image, 0, 0)
      imgSrc.value = canvas.toDataURL()
    })
  }
}

const openImage = () => {
  const { $vfm } = useGlobals()
  const component = resolveComponent('FullSizeImage')
  $vfm.show({
    component,
    bind: {
      drag: false,
      size: 'auto',
      noActions: true,
      adaptive: false,
      url: imgSrc.value,
    },
    on: {
      close: () => {
        $vfm.hideAll()
      },
    },
  })
}

onMounted(generateCanvas)
</script>
