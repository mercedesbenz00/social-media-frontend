<template>
  <div class="post-item-header" :class="isSmall ? 'isSmall' : ''">
    <div class="flex items-center post-item-name">
      <Avatar :person-id="post.authorId" class="!w-16 !h-16 me-4 avatar" />
      <router-link @click.stop :to="`/profile/${post.authorId}`">
        <div class="font-bold cursor-pointer text-base">{{ post.authorDisplayName }}</div>
        <div class="date">{{ date }}</div>
      </router-link>
    </div>
    <div class="post-item-trailing flex gap-2 justify-between">
      <PostStatus :post="post" :group="group" />
      <PostActionMenu
        class="post-item-actions"
        @refresh="$emit('refresh')"
        @update="(v) => $emit('update', v)"
        @remove="(v) => $emit('remove', v)"
        :post="post"
        :permission="get(group, 'postingPermission', 'ALL')"
      />
    </div>
    <div v-if="loading" class="flex items-center">
      <div class="text-xs text-text-primary/60">{{ t('sending.posted_from') }}</div>
      <PSkeleton class="border-4 border-white" width="36px" height="36px" shape="circle" />
      <PSkeleton width="40%" height="1rem" />
    </div>
    <div
      v-else-if="post.repostedFromId"
      class="text-xs text-text-primary/60 flex space-x-2 items-center post-item-group"
    >
      <div class="text-xs text-text-primary/60">{{ t('sending.posted_from') }}</div>
      <Avatar :src="groupAvatar || assetImage('no-group.svg')" :group-id="group.id" class="w-7 h-7" />
      <div v-if="group.name" class="bold text-text-primary text-xs font-semibold">
        {{ group.name.length > 15 ? `${group.name.substring(0, 15)}...` : group.name }}
      </div>
      <div class="text-text-primary/60 text-xs">{{ t('by') }}</div>
      <div class="flex items-center space-x-2">
        <Avatar :src="repostedPerson.avatar?.path ?? undefined" class="w-7 h-7" />
        <div v-if="repostedPerson.displayName" class="text-xs font-semibold text-text-primary">
          {{ repostedPerson.displayName }}
        </div>
        <div v-else class="text-xs font-semibold text-text-primary">
          {{ repostedPerson.firstName }} {{ repostedPerson.lastName }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import moment from 'moment-with-locales-es6'
import type { IPost } from '@/data/posts/posts.interface'
import type { PropType } from 'vue'
import { usePostsStore } from '@/data/posts/posts.store'
import { useGroupsStore } from '@/data/groups/groups.store'
import type { IGroup } from '@/data/groups/groups.interface'
import { usePersonsStore } from '@/data/persons/persons.store'
import type { IPerson } from '@/data/persons/persons.interface'
import { get } from 'lodash'
import { useAssets } from '@/composables/useAssets'
const { t, locale } = useI18n()
const props = defineProps({
  post: {
    type: Object as PropType<IPost>,
    required: true,
  },
  isSmall: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const loading = ref(false)
const sharedPost = ref({} as IPost)
const group = ref({} as IGroup)
const repostedPerson = ref({} as IPerson)
const groupAvatar = computed(() => group.value?.avatar?.path ?? undefined)
const $posts = usePostsStore()
const $groups = useGroupsStore()
const $persons = usePersonsStore()
defineEmits(['refresh', 'update', 'remove'])
const assetImage = useAssets
const date = computed(() => {
  if (props.post.publishedAt) return moment(props.post.publishedAt).locale(locale.value).fromNow()
})

const fetch = async () => {
  loading.value = true
  try {
    const response = await $posts.getPost(props.post.repostedFromId as number)
    if (response) {
      sharedPost.value = response
      const [pR, gR] = await Promise.all([
        $persons.getPersonById(response.authorId),
        $groups.getGroupById(response.userGroupId),
      ])
      if (pR) repostedPerson.value = pR
      if (gR) group.value = gR
    }
    loading.value = false
  } catch (error) {
    loading.value = false
  } finally {
    loading.value = false
  }
}
const fetchGroupById = async () => {
  group.value = await $groups.getGroupById(props.post.userGroupId)
}
onMounted(() => {
  if (props.post.repostedFromId) fetch()
  fetchGroupById()
})
</script>
<style scoped lang="scss">
.date {
  --at-apply: 'text-sm text-text-primary-light';
}
.post-item-header {
  --at-apply: 'flex relative flex-col-reverse sm:items-center sm:justify-between sm:flex-row';

  .post-item-leading {
    --at-apply: 'flex items-center space-x-2';
    .avatar {
      --at-apply: 'h-16 w-16 cursor-pointer rounded-full bg-text-primary/50';
    }
    .name {
      --at-apply: 'text-base';
    }
    .date {
      --at-apply: 'text-sm text-text-primary-light';
    }
  }
  .post-item-trailing {
    // --at-apply: 'absolute top-0 end-0';
  }
}
.isSmall {
  --at-apply: 'flex relative flex-col-reverse flex-start';
  align-items: stretch;
  .avatar {
    --at-apply: 'w-10 h-10 me-2  cursor-pointer ';
  }
  .name {
    --at-apply: 'text-sm';
  }
  .date {
    --at-apply: 'text-xs';
  }
}

@media screen and (max-width: 575px) {
  .post-item-header {
    --at-apply: 'flex flex-col mt-2';
    .post-item-name {
      --at-apply: 'order-0 px-4';
      .avatar {
        --at-apply: '!w-10 !h-10 me-2';
        & ~ a {
          & > div {
            --at-apply: '!text-xs';
          }
          .date {
            --at-apply: 'text-10px';
          }
        }
      }
    }
    .post-item-trailing {
      --at-apply: 'order-0 px-4 bg-bg-purple-light/50 my-4 py-2';
      .post-item-actions {
        --at-apply: 'absolute top-0 right-4';
      }
    }
  }
}
[dir='rtl'] {
  @media screen and (max-width: 575px) {
    .post-item-trailing {
      .post-item-actions {
        --at-apply: 'absolute top-0 left-4 right-auto';
      }
    }
  }
}
.dark-mode {
  .post-item-trailing {
    --at-apply: 'bg-bg-primary';
  }
}
</style>
