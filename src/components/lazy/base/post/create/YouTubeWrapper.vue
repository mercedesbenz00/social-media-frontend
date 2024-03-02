<template>
  <iframe
    sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
    v-if="link"
    class="w-full rounded-2xl min-h-[300px]"
    :src="link"
    frameborder="0"
    allowfullscreen
    alt="Youtube video"
  ></iframe>
</template>
<script setup lang="ts">
const props = defineProps({
  src: {
    type: String || undefined,
    required: false,
    default: '',
  },
})
const regex = /v=([^&]+)/
const link = computed(() => {
  const match = props.src.match(regex)
  if (!match) return undefined
  const id = match[1]
  if (!id) return undefined
  return 'https://www.youtube.com/embed/' + id
})
</script>
