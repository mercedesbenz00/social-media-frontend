<template>
  <div class="tab py-4">
    <div class="w-full px-6">
      <div class="p-input-icon-left">
        <i class="i-figma:search w-6 h-6"></i>
        <p-input-text
          class="w-full"
          v-model="searchText"
          @input="search"
          :placeholder="$t('group.search_placeholder')"
        />
      </div>
    </div>
    <PTabView ref="tabview" v-model:activeIndex="activeTab" @tab-change="fetch()">
      <PTabPanel :header="tab" v-for="tab in tabs" :key="tabs[tab]">
        <div v-if="loading" class="mt-4 space-y-4">
          <GroupItemSkeleton v-for="i in 9" :key="i" />
        </div>
        <div v-else-if="groups && groups.length > 0" class="mt-4">
          <div v-for="(group, index) in groups" :key="index">
            <GroupItem
              :group="group"
              @on-click="($event) => emits('onClick', $event)"
              @on-rules="($event) => emits('onRules', $event)"
            />
          </div>
        </div>
        <div v-else class="mt-4 px-8">
          {{ t('groups.no_group') }}
        </div>
      </PTabPanel>
    </PTabView>
  </div>
</template>
<script setup lang="ts">
import type { IGroup } from '@/data/groups/groups.interface'
import { useGroupsStore } from '@/data/groups/groups.store'
import { debounce } from 'lodash'
const $groups = useGroupsStore()
const groups = ref([] as any)
const loading = ref(false)
const emits = defineEmits(['onClick', 'onRules'])
const activeTab = ref(0)
const { t } = useI18n()
const frequentGroups = ref([] as IGroup[])
const tabs = ref([t('group.frequent'), t('group.recent'), t('group.joined')])
const fetch = async (params = {}) => {
  try {
    loading.value = true
    if (activeTab.value === 0) {
      const response = await $groups.getFrequentGroups(params)
      if (response) {
        frequentGroups.value = response as any
        groups.value = frequentGroups.value
      }
    } else if (activeTab.value === 1) {
      const response = await $groups.getMyGroups(params)
      if (response) groups.value = response.content.map((g: any) => g.group)
    } else if (activeTab.value === 2) {
      const response = await $groups.getRecentlyJoinedGroups(params)
      if (response) groups.value = response.content.map((g: any) => g.group)
    }
  } finally {
    loading.value = false
  }
}
const searchText = ref('')
const search = debounce(() => {
  if (activeTab.value === 0) groups.value = frequentGroups.value.filter((g) => g.name.includes(searchText.value))
  else fetch({ query: searchText.value })
}, 300)

onMounted(fetch)
</script>
<style lang="scss" scoped>
.tab {
  :deep(.p-tabview) {
    .p-tabview-panels {
      padding: 0;
    }
    .p-tabview-nav {
      border-width: 0 0 1px 0;
      border-bottom: 1px solid rgba(var(--bg-border-light));
    }
    .p-tabview-nav-container {
      --at-apply: 'px-6';
    }
    li {
      &.p-tabview-nav-link {
        border-color: transparent;
      }
      & .p-tabview-nav-link {
        border-bottom: 1px solid rgba(var(--bg-border-light));
        border-width: 0 0 1px 0;
      }
      &.p-highlight .p-tabview-nav-link {
        border-bottom: 2px solid rgba(var(--primary-color));
        border-width: 0 0 2px 0;
      }
    }
  }
}
</style>
