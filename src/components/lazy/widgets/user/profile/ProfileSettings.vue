<template>
  <p-menu :model="items" class="p-4 min-w-12 w-full">
    <template #start>
      <slot name="start" />
    </template>
    <template #item="{ item }">
      <component
        :is="item.component ? item.component : 'router-link'"
        :to="item.path"
        class="flex items-start"
        :class="{ 'mb-2.5': item.path }"
      >
        <i :class="item.icon" class="text-primary text-lg me-2"></i>
        <div class="text-sm">{{ item.label }}</div>
      </component>
    </template>
    <template #end>
      <slot name="end" />
    </template>
  </p-menu>
</template>
<script setup lang="ts">
const { t } = useI18n()
const items = computed(() => {
  return [
    { separator: true },
    {
      path: '/groups/details?type=my_groups',
      icon: 'i-figma:interests',
      label: t('profile_dropdown.my_groups'),
    },
    {
      path: '/groups/manage-groups',
      icon: 'i-figma:users',
      label: t('profile_dropdown.manage_groups'),
    },
    {
      path: '/settings',
      icon: 'i-figma:settings',
      label: t('profile_dropdown.settings'),
    },
    { separator: true },
    { component: 'LocaleModeSettings' },
    { separator: true },
    { component: 'ThemeModeSettings' },
    { separator: true },
  ]
})
</script>
