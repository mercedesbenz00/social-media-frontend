<template>
  <div v-if="!loading" class="profile-card-small">
    <div
      class="cover"
      :style="[cover ? `background-image: url(${cover}); background-size: cover` : '']"
      :class="[{ 'cursor-pointer': isAuthUser }]"
      @click="isAuthUser ? router.push('/profile/' + user.id) : null"
    ></div>
    <div v-if="user" class="content">
      <div class="flex justify-between flex-col">
        <div class="flex flex-col">
          <Avatar :src="user.avatar?.path" :person-id="user.id" class="avatar"></Avatar>
          <div class="px-3">
            <div class="name">{{ userData?.displayName }}</div>
            <div class="location">{{ userCityName }}</div>
          </div>
        </div>
        <hr class="text-gray-200 my-4" :class="{ block: !isAuthUser }" />
        <div class="text-center">
          <div v-if="!isAuthUser" class="flex items-center">
            <PButton
              class="btn-flat-primary text-2xl !mr-2"
              icon="i-figma-mail"
              @click="chatStore.initRoom(user.id)"
              :loading="chatStore.initRoomLoading"
            />
            <FollowUnFollowButton
              :following-display-name="user?.displayName"
              :following-id="user?.id"
              @refresh="refresh"
            />
          </div>
        </div>
      </div>
      <div v-if="isAuthUser">
        <div class="flex gap-4 mt-1 flex-col">
          <ProfileInfo
            class="cursor-pointer"
            :title="t('profile_card.followers')"
            :value="user.followerCount"
            icon="i-figma-heart"
            @click="router.push(`/profile/${user.id}/followers`)"
          />
          <ProfileInfo
            class="cursor-pointer"
            :title="t('profile_card.following')"
            :value="user.followingCount"
            icon="i-figma-user-plus"
            @click="router.push(`/profile/${user.id}/following`)"
          />
          <ProfileInfo
            class="cursor-pointer"
            :title="$t('profile_card.groups')"
            :value="user.groupCount"
            icon="i-figma-users"
            @click="router.push(`/profile/${user.id}/groups`)"
          />
          <ProfileInfo
            class="cursor-pointer"
            :title="t('profile_card.collections')"
            icon="i-figma-interests"
            @click="router.push(`/profile/${user.id}/collections`)"
          />
        </div>
      </div>
    </div>
  </div>
  <UserProfileSkeleton v-else></UserProfileSkeleton>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { IUser } from '@/data/auth/auth.interface'
import { useCitiesStore } from '@/data/cities/cities.store'
import { useAuthStore } from '@/data/auth/auth.store'
import { useChatStore } from '@/data/chat/chat.store'
import { useGroupsStore } from '@/data/groups/groups.store'
import { usePostsStore } from '@/data/posts/posts.store'
import type { IPage } from '@/data/main.model'
import type { ICollection } from '@/data/posts/posts.interface'

const router = useRouter()
const { t } = useI18n()
const props = defineProps({
  userData: {
    type: Object as PropType<IUser | undefined | null>,
    default: null,
  },
})
const $posts = usePostsStore()
const emit = defineEmits(['refresh'])

const isAuthUser = computed(() => props.userData?.id === useAuthStore()?.user?.id ?? false)
const user = computed(() => (isAuthUser.value ? useAuthStore().user : props.userData))
const cover = computed(() => props.userData?.cover?.path ?? null)
const userCityName = computed(() => useCitiesStore().getUserCity())
const loading = computed(() => {
  if (isAuthUser.value) return useGroupsStore().memberInGroups === null
  else return false
})

const chatStore = useChatStore()

const refresh = () => {
  emit('refresh')
}
</script>

<style lang="scss" scoped>
.profile-card-small {
  --at-apply: 'w-auto max-w-60 rounded-lg overflow-hidden bg-bg-primary primary-shadow';
  .cover {
    --at-apply: 'h-18 bg-gray-500 flex justify-center items-center';
  }
  .content {
    --at-apply: 'position-relative h-auto p-5';

    .avatar {
      --at-apply: 'position-relative mx-auto h-16 w-16 -mt-12 flex justify-center items-center';
      --at-apply: 'rounded-full overflow-hidden';
    }

    .name {
      --at-apply: 'font-bold text-sm text-center';
    }
    .location {
      --at-apply: 'text-xs font-normal py-1 text-text-primary-light/60 text-center';
    }

    .icon {
      font-size: 4rem;
    }
  }
}
</style>
