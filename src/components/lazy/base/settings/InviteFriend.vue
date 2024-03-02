<template>
  <div class="flex items-center justify-center mb-4">
    <div
      @click="invite"
      class="action rounded-2xl w-[198px] h-[184px] bg-bg-purple-light flex flex-col items-center justify-center cursor-pointer"
    >
      <i class="i-figma:user-plus h-20 w-20 mb-4"></i>
      <div class="text-lg">{{ $t('settings.invite_friend') }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import InviteFriendModal from './InviteFriendModal.vue'
const invite = () => {
  const { $vfm } = useGlobals()
  $vfm.show({
    component: InviteFriendModal,
    bind: {
      drag: false,
      size: 'auto',
      adaptive: false,
      noActions: true,
    },
    on: {
      close: () => {
        $vfm.hideAll()
      },
    },
  })
}
</script>
