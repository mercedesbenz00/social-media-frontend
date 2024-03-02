<template>
  <div class="mb-4 font-bold text-3xl justify-between px-8 hidden lg:flex">
    <span>{{ $t('settings.title') }}</span>
  </div>
  <div class="card-defaults p-6 w-full flex flex-col gap-y-4 max-w-[720px] h-max">
    <div class="">
      <div class="font-bold text-lg pb-4">{{ $t('settings.language_title') }}</div>
      <LocaleModeSettings :text-size="'sm'" class="space-y-3" />
    </div>
    <PDivider />
    <div>
      <div class="font-bold text-lg pb-4">{{ $t('settings.appereance_title') }}</div>
      <ThemeModeSettings :text-size="'sm'" class="space-y-3" />
    </div>
  </div>
</template>
<route lang="yaml">
meta:
  layout: settings
</route>
<script setup lang="ts"></script>
<style scoped>
:deep(.p-component) {
  --at-apply: 'w-auto';
}
:deep(.p-radiobutton .p-radiobutton-box .p-radiobutton-icon) {
  transition-duration: 0.2s;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 2px solid rgb(var(--bg-primary-light-color));
  background: rgb(var(--bg-primary));
}
.border-bottom {
  --at-apply: 'border-b-px border-border-light/50';
}
</style>
