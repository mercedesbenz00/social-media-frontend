<template>
  <div>
    <div class="card-defaults overflow-hidden p-6">
      <div class="flex items-center justify-between">
        <div class="text-text-primary-dark font-bold text-sm">{{ $t('group.rules') }}</div>
        <div v-if="isAdmin" class="flex items-center gap-1 text-primary hover:text-secondary cursor-pointer">
          <div class="i-figma-edit text-primary"></div>
          <a @click="editRules">{{ $t('group.edit_rules') }}</a>
        </div>
      </div>
      <div
        ref="textBox"
        class="text-xs mt-2"
        :class="showAll ? 'overflow-visible h-auto' : 'overflow-hidden h-12'"
        v-html="rules"
      ></div>
      <div class="text-primary mt-2 cursor-pointer text-xs" v-if="computedShowMore" @click="showAll = !showAll">
        {{ showAll ? $t('group.rule_read_less') : $t('group.rule_read_more') }}
      </div>
    </div>
    <GroupRulesEdit ref="ruleEdit" @update="() => emits('update')" :group-data="group" />
  </div>
</template>
<script setup lang="ts">
import type { IGroup } from '@/data/groups/groups.interface'
import type { PropType } from 'vue'
const props = defineProps({
  group: {
    type: Object as PropType<IGroup>,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
})
const emits = defineEmits(['update'])
const ruleEdit = ref()
const textBox = ref<HTMLDivElement>()
const editRules = () => {
  ruleEdit.value.show()
}
const computedShowMore = computed(() => {
  if (textBox.value) {
    const height = textBox.value.scrollHeight
    return height > 48
  }
})
const rules = computed(() => props.group.rules?.replace(/\n/g, '<br />'))
const showAll = ref(false)
</script>
