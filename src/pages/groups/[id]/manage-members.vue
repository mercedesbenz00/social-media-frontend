<template>
  <div class="mx-auto max-w-720px w-full">
    <UniversalBackButton :title="t('moderation.manage_members')" />
    <slot name="menu"></slot>
    <UniversalSearch v-model="searchValue" :placeholder="t('moderation.search_members')" class="mb-4" />
    <div class="page-level-tab">
      <PTabView v-model:activeIndex="activeTab" @tab-change="clearRoute">
        <PTabPanel :header="t('moderation.requests')">
          <RequestsList v-if="activeTab == 0" :search-value="searchValue" />
        </PTabPanel>
        <PTabPanel :header="t('moderation.members')">
          <MemberList v-if="activeTab == 1" :search-value="searchValue" />
        </PTabPanel>
        <PTabPanel :header="t('moderation.mutual')">
          <MutualList v-if="activeTab == 2" :search-value="searchValue" />
        </PTabPanel>
        <PTabPanel :header="t('moderation.invited')">
          <InvitedList v-if="activeTab == 3" :search-value="searchValue" />
        </PTabPanel>
        <PTabPanel :header="t('moderation.invite')">
          <InviteList v-if="activeTab == 4" :search-value="searchValue" />
        </PTabPanel>
        <PTabPanel :header="t('moderation.muted')">
          <MutedList v-if="activeTab == 5" :search-value="searchValue" />
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
import { useDeviceDetector } from '@/utils/device-detector.utils'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const searchValue = ref('')
const clearRoute = () => {
  router.push(route.path)
}
const activeTab = ref(0)

onMounted(() => {
  if (route.query.page) router.push({ query: {} })
})
</script>
