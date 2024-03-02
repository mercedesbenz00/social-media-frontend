<template>
  <p-tab-view v-model:activeIndex="activeTab">
    <p-tab-panel v-for="(list, index) in lists" :key="index" :header="t(`group.${list}`)">
      <keep-alive>
        <group-tab ref="itemRefs" :type="list" v-if="activeTab == index" />
      </keep-alive>
    </p-tab-panel>
  </p-tab-view>
</template>
<script setup lang="ts">
const { t } = useI18n()
const activeTab = ref(0)
const lists = ['suggested', 'top', 'popular']
</script>
