<template>
  <div class="mx-auto max-w-720px w-full">
    <UniversalBackButton :title="$t('moderation.group_settings')" />
    <slot name="menu"></slot>
    <div class="border border-bg-purple-light/50 mx-px p-4 lg:border-none lg:card-defaults lg:p-6">
      <UpdateGroup />
    </div>
  </div>
</template>
<route lang="yaml">
meta:
  layout: group
</route>
<script setup lang="ts"></script>
