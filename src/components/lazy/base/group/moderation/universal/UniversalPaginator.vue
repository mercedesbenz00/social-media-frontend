<template>
  <PPaginator :rows="10" :totalRecords="totalRecords" @page="onPage" />
</template>
<script setup lang="ts">
const props = defineProps({
  totalRecords: {
    type: Number,
    required: true,
  },
})
const route = useRoute()
const page = computed(() => route.query.page)
const router = useRouter()
const onPage = (event) => {
  const { page } = event
  if (event.page >= 1) router.push({ query: { page: page + 1 } })
  else router.push({ query: {} })
}

watch(page, () => {
  if (Number(page.value) == 0) router.push({ query: {} })
})
</script>
