<template>
  <div class="flex items-center gap-x-2 md:gap-x-4">
    <component
      v-for="(item, index) in items"
      :is="item.to ? 'router-link' : 'div'"
      @click="item.action"
      :key="index"
      class="flex items-center"
      :to="item.to"
    >
      <i :class="item.icon" class="bg-primary/60 w-4 h-4 md:w-6 md:h-6 me-1 cursor-pointer"></i>
      <div class="text-xs md:text-sm">{{ item.value }}</div>
    </component>
  </div>
</template>
<script setup lang="ts">
import type { PropType } from 'vue'
const props = defineProps({
  data: {
    type: Object as PropType<IVote>,
    required: false,
    default: {},
  },
})

const emits = defineEmits(['remove', 'update'])
interface IVote {
  upvotesTotal: number
  downvotesTotal: number
  commentsCount: number
  voteValue: 0 | 1 | 2
}

const voteValue = ref(props.data.voteValue ?? 0)
const upvotes = ref(voteValue.value === 1 && props.data.upvotesTotal === 0 ? 1 : props.data.upvotesTotal ?? 0)
const downvotes = ref(voteValue.value === 2 && props.data.downvotesTotal === 0 ? 1 : props.data.downvotesTotal ?? 0)

const items = computed(() => {
  return [
    {
      icon: voteValue.value === 1 ? 'i-figma:thumbs-up-filled' : 'i-figma:thumbs-up',
      value: upvotes.value,
      action: () => {
        if (voteValue.value !== 1) {
          upVote()
        } else removeVote()
      },
    },
    {
      icon: voteValue.value === 2 ? 'i-figma:thumbs-down-filled' : 'i-figma:thumbs-down',
      value: downvotes.value,
      action: () => {
        if (voteValue.value !== 2) {
          downVote()
        } else removeVote()
      },
    },
  ]
})

const upVote = () => {
  if (voteValue.value !== 0) removeVote()
  upvotes.value++
  voteValue.value = 1
  updateVote('UPVOTE')
}

const downVote = () => {
  if (voteValue.value !== 0) removeVote()
  downvotes.value++
  voteValue.value = 2
  updateVote('DOWNVOTE')
}

const removeVote = async () => {
  if (voteValue.value === 1 && upvotes.value - 1 >= 0) upvotes.value--
  else if (voteValue.value === 2 && downvotes.value - 1 >= 0) downvotes.value--
  voteValue.value = 0
  emits('remove')
}
const updateVote = async (voteType: 'UPVOTE' | 'DOWNVOTE') => {
  emits('update', voteType)
}
</script>
