<template>
  <div
    class="border border-bg-purple-light/50 mx-px bg-bg-primary lg:mx-0 lg:border-none lg:card-defaults p-4 h-full overflow-auto"
  >
    <ComplaintsUser v-for="complaint in complaints" :key="complaint.id" :complaint="complaint" />
    <div class="flex items-center justify-center lg:hidden">
      <PButton class="bg-primary w-full" @click="emits('back')" :label="t('user.back')" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue'
const { t } = useI18n()
const emits = defineEmits(['back'])
const props = defineProps({
  complaints: {
    type: Array as PropType<any>,
    requred: true,
  },
})
</script>
