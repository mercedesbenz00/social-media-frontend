<template>
  <DefaultLayout>
    <div class="settings-container">
      <div class="sidebar">
        <GoBack class="mb-4" :title="$t('profile_dropdown.settings')" to="/" />
        <SettingsSidebar />
      </div>
      <div class="settings-content">
        <RouterView />
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from './default.vue'
</script>
<style lang="scss" scoped>
.settings-content {
  --at-apply: 'mt-8 lg:mt-0 lg:p-4 h-fit';
}
.settings-container {
  --at-apply: 'grid m-auto grid-cols-1 lg:grid-cols-[240px_720px_240px] max-w-1200px md:grid-cols-[240px_1fr] mt-8 w-full';
}
.sidebar {
  --at-apply: 'relative lg::sticky lg::block lg:top-4 h-auto lg::h-[calc(100vh-4rem)]';
}
</style>
