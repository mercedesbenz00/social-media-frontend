<template>
  <div class="mx-auto max-w-720px w-full">
    <UniversalBackButton :title="t('moderation.posts_moderation')" />
    <slot name="menu"></slot>
    <UniversalSearch v-model="searchValue" :placeholder="t('moderation.search_posts')" class="mb-4" />
    <div class="page-level-tab">
      <PTabView v-model:activeIndex="activeTab">
        <PTabPanel :header="t('moderation.pending_posts')">
          <PendingPosts v-if="activeTab == 0" :search-value="searchValue" />
        </PTabPanel>
        <PTabPanel :header="t('moderation.rejected_posts')">
          <RejectedPosts v-if="activeTab == 1" :search-value="searchValue" />
        </PTabPanel>
      </PTabView>
    </div>
  </div>
</template>
<route lang="yaml">
meta:
  layout: group
</route>
<script setup lang="ts">
const searchValue = ref('')
const { t } = useI18n()
const activeTab = ref(0)
</script>
