<template>
  <div>
    <groups-list-skeleton v-if="loading" />
    <div v-else-if="groups && groups.length > 0">
      <!-- TODO: refactor it in future -->
      <groups-list :type="type" :onboarding="true" :groups="groups" @refresh="findGroups(false)" />
    </div>
    <div v-else class="font-bold text-center">{{ t('group.empty_state') }}</div>
  </div>
</template>
<script setup lang="ts">
import type { IGroup } from '@/data/groups/groups.interface'
import { useGroupsStore } from '@/data/groups/groups.store'
import type { IPage } from '@/data/main.model'
import type { PropType } from 'vue'
const { t } = useI18n()
const props = defineProps({
  type: {
    type: String as PropType<'suggested' | 'popular' | 'top'>,
    required: true,
  },
})
const $groups = useGroupsStore()
const groups = ref<IGroup[] | null>(null)
const loading = ref(false)

const findGroups = async (showLoading = true) => {
  try {
    loading.value = showLoading
    const method = `get${props.type.charAt(0).toUpperCase() + props.type.slice(1)}Groups`
    await $groups[method]().then((r: IPage<IGroup>) => (groups.value = r.content))
  } finally {
    loading.value = false
  }
}
onMounted(findGroups)
</script>
