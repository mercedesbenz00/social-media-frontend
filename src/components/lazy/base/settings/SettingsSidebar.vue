<template>
  <div class="left-sidebar">
    <router-link v-for="(item, index) in items" :key="index" :to="item.to" class="left-sidebar__item">
      <i :class="item.icon" class="text-xl md:me-2 text-primary"></i>
      <div class="hidden md:block">{{ item.label }}</div>
    </router-link>
  </div>
</template>
<script setup lang="ts">
const { t } = useI18n()
const items = computed(() => {
  return [
    {
      to: '/settings',
      icon: 'i-figma:users',
      label: t('settings.edit_my_profile'),
    },
    {
      to: '/settings/manage-interests',
      icon: 'i-figma:star',
      label: t('settings.manage_interests'),
    },
    {
      to: '/settings/settings',
      icon: 'i-figma:settings',
      label: t('settings.title'),
    },
    {
      to: '/settings/invite-friends',
      icon: 'i-figma:user-plus',
      label: t('settings.invite_friends'),
    },
  ]
})
</script>

<style lang="scss" scoped>
.left-sidebar {
  --at-apply: 'pt-4 pb-2 card-defaults lg:p-4 max-h-300px';
  &__item {
    --at-apply: 'flex items-center cursor-pointer mb-5';
  }
}

@media screen and (max-width: 768px) {
  .left-sidebar {
    --at-apply: 'flex items-center justify-around';
    &__item {
      --at-apply: 'mb-0 border-b-4 border-transparent pb-2';
      &.router-link-active {
        --at-apply: 'border-b-4 border-primary';
        & div {
          --at-apply: 'text-primary';
        }
      }
      & div {
        --at-apply: 'm-0 w-6 h-6 text-gray-300';
      }
      & p {
        --at-apply: 'hidden';
      }
    }
  }
}
</style>
