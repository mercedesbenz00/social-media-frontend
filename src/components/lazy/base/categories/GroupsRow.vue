<template>
  <section>
    <GroupCategoriesSkeleton v-if="loading"></GroupCategoriesSkeleton>
    <div v-else-if="groups.length > 0" class="grid grid-cols-3 grid-gap-4 mt-4">
      <GroupSmall v-for="group in groups" :key="`group-${group.id}`" :group="group" @update="fetch" />
    </div>
    <div v-else class="font-semibold font-sm">{{ $t('group.empty_state') }}</div>
  </section>
</template>
<script setup lang="ts">
import type { IGroup } from '@/data/groups/groups.interface'
import { useGroupsStore } from '@/data/groups/groups.store'

const props = defineProps({
  categoryId: {
    type: Number,
    required: true,
  },
})
const loading = ref(false)
const $groups = useGroupsStore()
const groups = ref([] as IGroup[])
onMounted(() => {
  fetch()
})
const fetch = async (isShowLoading = true) => {
  loading.value = isShowLoading
  try {
    loading.value = true
    const { content } = await $groups.getGroupsByCategoryIds(props.categoryId)
    if (content) groups.value = content
  } finally {
    loading.value = false
  }
}
</script>
