<template>
  <router-link
    class="text-text-primary hover:text-gray-600 font-bold text-xl cursor-pointer flex items-center mb-4 ps-8 md:ps-0"
    :to="to ?? '/groups/' + id"
  >
    <div class="pi pi-arrow-left text-sm font-bold px-2"></div>
    <div>{{ title }}</div>
  </router-link>
</template>
<script setup lang="ts">
const route = useRoute()
const id = computed(() => route.params.id ?? route.params.id)
const props = defineProps({
  to: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: true,
  },
})
</script>
