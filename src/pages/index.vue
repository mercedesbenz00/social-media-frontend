<template>
  <page-wrapper>
    <div class="grid-wrapper">
      <div class="feeds-container">
        <div class="profile">
          <!--<UserProfile></UserProfile> -->
          <ProfileCardSmall :user-data="user" />
        </div>
        <div class="feeds">
          <div class="post-create">
            <PostCreate />
          </div>
          <div>
            <StoriesCarousel />
          </div>
          <div class="post">
            <PostSorting />
            <PostList />
          </div>
        </div>
        <div class="groups">
          <GroupList
            :loading="loading"
            :items="suggestedGroups"
            :title="$t('groups.suggested')"
            class="mb-8"
            type="suggested"
            @joinOrLeave="joinOrLeave"
          />
          <GroupList
            @joinOrLeave="joinOrLeave"
            :loading="loading"
            :items="recentlyJoinedGroups"
            :title="$t('groups.recently')"
          />
        </div>
      </div>
    </div>
  </page-wrapper>
</template>

<script setup lang="ts">
import { useGroupsStore } from '@/data/groups/groups.store'
import type { IGroup } from '@/data/groups/groups.interface'
import { useAuthStore } from '@/data/auth/auth.store'
import { usePostsStore } from '@/data/posts/posts.store'
import { useMainStore } from '@/data/main.store'
const authStore = useAuthStore()
const groupStore = useGroupsStore()
const postStore = usePostsStore()
const $main = useMainStore()
const { t } = useI18n()

let recentlyJoinedGroups = ref<IGroup[]>([])
let suggestedGroups = ref<IGroup[]>([])
const loading = ref(true)

const user = computed(() => authStore.user)

const fetch = async () => {
  loading.value = true

  const [recent, suggested] = await Promise.all([groupStore.getRecentlyJoinedGroups(), groupStore.getSuggestedGroups()])

  loading.value = false

  recentlyJoinedGroups.value = recent.content.map((g: any) => g.group)
  suggestedGroups.value = suggested.content
}

async function joinOrLeave(group: IGroup) {
  if (group.memberState === 'APPROVED') {
    $main.confirm({
      header: t('groups.leave_header'),
      message: t('groups.leave_message'),
      acceptLabel: t('acceptLabel'),
      rejectLabel: t('rejectLabel'),
      accept: async () => {
        loading.value = true
        await groupStore.removeUserFromGroup(group.id)
        fetch()
        postStore.refreshPostList()
      },
      reject: () => {},
    })
  } else {
    loading.value = true
    await groupStore.joinGroup(group.id)
    fetch()
    postStore.refreshPostList()
  }
}

onMounted(fetch)
</script>

<style lang="scss" scoped>
.grid-wrapper {
  display: flex;
  justify-content: center;
}
.feeds-container {
  --at-apply: 'grid m-auto grid-cols-1 lg:grid-cols-[240px_720px_240px]  md:grid-cols-[240px_1fr] pt-4';
  & .profile {
    --at-apply: 'hidden md:block sticky top-4 ';
    height: calc(100vh - 4rem);
  }

  & .feeds {
    --at-apply: 'md:px-4 px-1 z-1';
    & .post-create {
      --at-apply: 'h-max m-auto md:max-w-720px w-full';
    }
  }

  & .groups {
    --at-apply: 'hidden md:block sticky top-4 z-0';
    height: calc(100vh - 4rem);
  }
}
</style>
