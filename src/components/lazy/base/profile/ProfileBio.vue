<template>
  <div>
    <p-divider />
    <div class="text-sm font-600 mb-2">Bio:</div>
    <div class="text-sm">
      {{ showMore ? bio : content }}
      <span class="cursor-pointer text-xs text-link" v-if="bio.length > 335 && !showMore" @click="showMore = true"
        >Show more</span
      >
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  bio: { type: String, required: true },
})
const showMore = ref(false)
const content = computed(() => (props.bio.length > 335 ? props.bio.slice(0, 335) + '...' : props.bio))
</script>
