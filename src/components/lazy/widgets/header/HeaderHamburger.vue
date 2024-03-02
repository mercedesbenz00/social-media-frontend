<template>
  <OnClickOutside @trigger="showMenu = false">
    <PButton class="btn-flat-primary text-2xl" @click="toggle" :icon="showMenu ? 'i-figma:x' : 'i-figma:menu'" />
    <div class="menu" :class="showMenu ? 'is-active' : ''">
      <div class="menu-item relative" v-for="(item, index) in items" :key="index" @click="item.action">
        <div class="flex items-center menu-item-content">
          <i v-if="item.icon" :class="item.icon"></i>
          <div>{{ item.title }}</div>
        </div>
        <PDivider v-if="item.divider" />
      </div>
    </div>
  </OnClickOutside>
</template>
<script setup lang="ts">
import { OnClickOutside } from '@vueuse/components'
import PostCreateModal from '@/components/lazy/base/post/create/PostCreateModal.vue'
import StoriesCreateModal from '@/components/auto/modals/Stories/StoriesCreateModal.vue'
import { $vfm } from 'vue-final-modal'

const { t } = useI18n()
const router = useRouter()
const showMenu = ref(false)
const toggle = () => {
  showMenu.value = !showMenu.value
}
const items = computed(() => {
  return [
    {
      title: t('navigation.feed'),
      icon: 'i-figma:grid',
      divider: true,
      action: () => {
        router.push('/')
        showMenu.value = false
      },
    },
    {
      title: t('navigation.groups'),
      icon: 'i-figma:users',
      divider: true,
      action: () => {
        router.push('/groups')
        showMenu.value = false
      },
    },
    {
      title: t('create.post'),
      icon: 'i-figma:plus-square',
      action: (event) => {
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
        showMenu.value = false
      },
    },
    {
      title: t('create.story'),
      icon: 'i-figma:smartphone',
      action: () => {
        $vfm.show({
          component: StoriesCreateModal,
          bind: {},
          on: {
            success: () => {
              $vfm.hideAll()
            },
          },
        })
        showMenu.value = false
      },
    },
  ]
})
</script>
<style scoped lang="scss">
.p-divider {
  --at-apply: 'mt-0 mb-0';
}
.menu {
  --at-apply: 'absolute bg-white -translate-x-full top-16 left-0 transition-250 ease-out w-3/4 bg-bg-primary border border-bg-purple-light/50';
  &.is-active {
    --at-apply: 'translate-x-0';
  }
  &-item-content {
    --at-apply: 'p-4 text-text-primary bg-bg-primary-light cursor-pointer hover:bg-primary hover:text-white';
    & i {
      --at-apply: 'me-2 text-2xl bg-primary';
    }
    &:hover {
      & i {
        --at-apply: 'bg-white';
      }
    }
  }
}
[dir='rtl'] {
  .menu {
    --at-apply: 'right-0 left-auto translate-x-full';
    &.is-active {
      --at-apply: 'translate-x-0';
    }
  }
}
</style>
