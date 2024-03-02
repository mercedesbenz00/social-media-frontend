<template>
  <div class="mx-auto max-w-720px w-full">
    <UniversalBackButton :title="$t('moderation.admin_panel')" />
    <slot name="menu"></slot>
    <div class="border border-bg-purple-light/50 lg:rounded-2xl p-6 mt-1">
      <GroupAdminPanel />
    </div>
  </div>
</template>
<route lang="yaml">
meta:
  layout: group
</route>
<script setup lang="ts"></script>
