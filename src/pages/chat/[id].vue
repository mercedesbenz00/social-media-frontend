<template>
  <ChatRoom :room-id="roomId" :floating="true" :displayEmojiStickerAndLoader="true" />
</template>
<script setup lang="ts">
const route = useRoute()
const roomId = computed(() => route.params.id)
</script>
