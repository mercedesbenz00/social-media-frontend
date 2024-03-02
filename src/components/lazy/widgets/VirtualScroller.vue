<template>
  <div class="space-y-4" ref="virtualScroller">
    <div v-for="(item, index) in data" :key="index">
      <slot name="item" :item="item"></slot>
    </div>
    <img v-if="loading" class="mx-auto" src="@/assets/images/loading.gif" alt="" />
  </div>
</template>
<script lang="ts" setup>
const virtualScroller = ref(null)
defineProps({
  data: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['loadMore'])

onMounted(() => {
  const body = document.querySelector('.defaults') as HTMLDivElement
  body.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  const body = document.querySelector('.defaults') as HTMLDivElement
  body.removeEventListener('scroll', handleScroll)
})

const handleScroll = () => {
  let element: any = virtualScroller.value
  if (element.getBoundingClientRect().bottom <= window.innerHeight + 500) emit('loadMore')
}
</script>
<style scoped lang="scss"></style>
