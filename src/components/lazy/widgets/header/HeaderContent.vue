<template>
  <div class="flex md:flex-1 flex-none items-center px-4">
    <div class="flex-center-none gap-x-4 w-full">
      <component :is="item.to ? 'RouterLink' : 'div'" v-for="(item, i) in menuItems" :key="i" :to="item.to">
        <PButton
          :icon="`${item.icon} text-2xl font-bold text-primary`"
          :label="item.name"
          class="btn-flat-primary text-text-primary-dark !hidden !md:flex"
          @click="(event) => (item.onClick ? item.onClick(event) : null)"
        >
        </PButton>
        <PButton
          :icon="`${item.icon} text-2xl font-bold text-primary`"
          class="btn-flat-primary text-text-primary-dark !md:hidden"
          @click="(event) => (item.onClick ? item.onClick(event) : null)"
        >
        </PButton>
      </component>
      <type-ahead-search class="ms-auto" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { $vfm } from 'vue-final-modal'
import PostCreateModal from '@/components/lazy/base/post/create/PostCreateModal.vue'
import StoriesCreateModal from '@/components/auto/modals/Stories/StoriesCreateModal.vue'
import type { IPopupMenuItem } from '@/data/main.interface'

const { t } = useI18n()
const dropdown = ref()
const route = useRoute()
const router = useRouter()
const menuItems = computed(() => [
  {
    name: t('navigation.feed'),
    icon: 'i-figma:grid',
    onClick: () => {
      if (route.fullPath == '/') router.go(0)
      else router.push('/')
    },
  },
  {
    name: t('navigation.groups'),
    icon: 'i-figma:users',
    to: '/groups',
  },
  {
    name: t('navigation.create'),
    icon: 'i-figma:plus-square',
    onClick: () => {
      // toggle(event)
      $vfm.show({
        component: PostCreateModal,
        bind: {
          size: 'small',
        },
        on: {
          onSuccess: () => {
            $vfm.hideAll()
          },
        },
      })
    },
  },
])
</script>

<style lang="scss" scoped></style>
