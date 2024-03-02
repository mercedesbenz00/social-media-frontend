<template>
  <div v-if="!loading" class="user-profile">
    <div class="user-cover" :style="coverStyle"></div>
    <PAvatar :image="noAvatarImage" class="user-avatar" shape="circle" />
    <div class="user-text">
      <h3>{{ userStore.user?.displayName }}</h3>
      <p>{{ userStore.user?.username }}</p>
    </div>
    <div class="px-4">
      <PDivider></PDivider>
    </div>
    <div class="px-4">
      <div class="user-info">
        <div class="i-heroicons-solid:heart icon"></div>
        <p>Followers</p>
        <span>{{ userStore.user?.followerCount }}</span>
      </div>
      <div class="user-info">
        <div class="i-heroicons-solid:user-add icon"></div>
        <p>Followings</p>
        <span>{{ userStore.user?.followingCount }}</span>
      </div>
      <div class="user-info">
        <div class="i-heroicons-solid:users icon"></div>
        <p>Member in Groups</p>
        <span>{{ groupsStore.memberInGroups }}</span>
      </div>
    </div>
  </div>
  <UserProfileSkeleton v-else></UserProfileSkeleton>
</template>

<script setup lang="ts">
import { useAssets } from '@/composables/useAssets'
import { useAuthStore } from '@/data/auth/auth.store'
import { useGroupsStore } from '@/data/groups/groups.store'

const noAvatarImage = useAssets('no-avatar.svg')
const userStore = useAuthStore()
const groupsStore = useGroupsStore()

const coverStyle = computed(() => {
  const noCoverImage = 'https://snp.creativeadvtech.ml/assets/icons/ic-default-image.svg'
  return {
    backgroundImage: `url('${userStore.user?.avatar?.path || noCoverImage}')`,
  }
})

const loading = computed(() => {
  return groupsStore.memberInGroups === null
})

onMounted(async () => {
  if (groupsStore.memberInGroups === null) {
    await groupsStore.getRecentlyJoinedGroups()
  }
})
</script>

<style lang="scss" scoped>
.user-profile {
  box-shadow: 0 0 16px rgb(66 66 66 / 25%);
  position: relative;
  --at-apply: ' rounded-xl w-full mb-8 overflow-hidden relative bg-bg-primary';

  .user-cover {
    --at-apply: 'mb-20 h-20% bg-black/50 min-h-72px bg-no-repeat bg-center bg-cover';
  }

  .user-avatar {
    --at-apply: '!w-20 !h-20 absolute top-40px left-50% transform -translate-x-50% border-2px border-bg-primary';
  }

  .user-text {
    text-align: center;

    h3 {
      --at-apply: ' font-bold text-lg text-text-primary mb-2';
    }

    p {
      --at-apply: '  text-sm text-text-primary-light/50';
    }
  }

  .user-info {
    --at-apply: 'flex items-center font-400 text-sm mb-16px';
    .icon {
      --at-apply: 'text-primary text-xl  me-4 ';
    }

    p {
      --at-apply: 'text-text-primary-light';
    }

    span {
      --at-apply: 'text-primary ms-auto';
    }
  }
}
</style>
