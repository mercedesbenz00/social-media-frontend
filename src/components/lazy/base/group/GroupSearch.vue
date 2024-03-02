<template>
  <div class="defaults bg-bg-primary rounded-xl primary-shadow p-5 mt-6">
    <!-- <PSkeleton class="!w-full !h-12 !rounded-full" /> -->
    <span class="p-input-icon-left">
      <i class="i-figma-search w-4 h-4 text-primary" />
      <p-input-text
        v-model="searchValue"
        class="w-full max-h-[32px] text-xs"
        :placeholder="$t('group.search_button_placeholder')"
      />
    </span>
  </div>
</template>
<script setup lang="ts">
import _ from 'lodash'
const emits = defineEmits(['search'])
const searchValue = ref('')

watch(searchValue, () => {
  onSearch()
})

const onSearch = _.debounce(() => {
  emits('search', searchValue.value)
}, 250)
</script>
