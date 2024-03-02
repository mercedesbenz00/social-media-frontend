<template>
  <div class="mx-auto max-w-720px w-full">
    <UniversalBackButton :title="t('moderation.reported_content')" />
    <slot name="menu"></slot>
    <!-- <UniversalSearch v-model="searchValue" placeholder="Search members" class="mb-4" /> -->
    <div class="page-level-tab">
      <PTabView v-model:activeIndex="activeTab">
        <PTabPanel :header="t('moderation.reported_posts')">
          <ReportedPosts v-if="activeTab == 0" :search-value="searchValue" />
        </PTabPanel>
        <PTabPanel :header="t('moderation.reported_comments')">
          <ReportedComments v-if="activeTab == 1" :search-value="searchValue" />
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
const activeTab = ref(0)
const { t } = useI18n()
const searchValue = ref('')
</script>
