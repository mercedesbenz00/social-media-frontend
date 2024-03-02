<template>
  <div class="post-item-content mt-4" :class="{ 'font-plex': isRtl }" :dir="isRtl ? 'rtl' : 'ltr'">
    <div class="break-words" @click.stop v-html="isShow || data.length < 500 ? data : sliced"></div>
    <PButton
      class="btn-flat-primary"
      v-if="data.length > 500 && !isShow"
      @click="isShow = true"
      :label="$t('show_more')"
    />
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  content: {
    type: String,
    required: true,
  },
})
// eslint-disable-next-line no-useless-escape
const sliced = computed(() => {
  let slice = data.value.slice(0, 500)
  return (slice += ' ...')
})
const data = computed(() => {
  let content = props.content.replaceAll('\n', '<br>')
  content = content.replace(/(https?:\/\/[^\s<]+)(?![^<]*>)/g, '<a class="cursor-pointer text-info" href="$1">$1</a>')
  content = content.replace(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/g,
    '<a class="cursor-pointer text-info" href="mailto:$&">$&</a>'
  )
  return content
})
const isShow = ref(false)
const arabicTextRegex = /[\u0600-\u06FF]/g
const isRtl = computed(() => arabicTextRegex.test(props.content))
</script>
<style scoped lang="scss">
.post-item {
  --at-apply: 'text-base py-4 break-words overflow-auto max-h-3/6 ';
}
@media screen and (max-width: 575px) {
  .post-item {
    &-content {
      --at-apply: 'px-4 text-xs';
    }
  }
}

</style>
