<template>
  <a
    @click="goBack"
    class="text-text-primary hover:text-gray-600 font-bold text-xl cursor-pointer display-inline-block"
  >
    <span class="pi pi-arrow-left text-sm font-bold px-2"></span>
    {{ props.title }}
  </a>
</template>

<script lang="ts" setup>
const router = useRouter()

const props = defineProps({
  title: {
    type: String,
    default: 'Go Back',
  },
  to: {
    type: String,
    default: '',
  },
})
const goBack = () => {
  if (!props.to) router.back()
  router.push(props.to)
}
</script>
