<template>
  <div class="max-h-[500px] overflow-auto result" v-if="!loading && result">
    <div v-for="(resultItem, index) in mappedResult" :key="index" class="result__item">
      <h3 class="text-bold mb-2">
        {{ resultItem.title }}:
        <span class="font-normal text-sm">{{ resultItem.data.totalElements }} {{ $t('search_result.in_total') }}</span>
      </h3>
      <TypeAheadResultItem
        v-for="item in resultItem.data.content"
        :data="item"
        :key="item.id"
        :adapter="resultItem.adapter"
      ></TypeAheadResultItem>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSearchStore } from '@/data/search/search.store'
import type { IPost } from '@/data/posts/posts.interface'
import type { IGroup } from '@/data/groups/groups.interface'
import type { IPerson } from '@/data/persons/persons.interface'
import { usePersonsStore } from '@/data/persons/persons.store'

const { t } = useI18n()

const $personStore = usePersonsStore()

const loading = computed(() => useSearchStore().loading)
const result = computed(() => useSearchStore().resultMapped)

const resultOrder = [
  {
    title: 'posts',
    adapter: postAdapter,
  },
  {
    title: 'groups',
    adapter: groupAdapter,
  },
  {
    title: 'people',
    adapter: personAdapter,
  },
]

const mappedResult = computed(() => {
  const mapOrder = resultOrder.filter((o) => (result.value as object)[o.title])
  return mapOrder.map(({ title, adapter }) => {
    return {
      title: t(`search_result.${title}`),
      adapter,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      data: result.value![title],
    }
  })
})

function postAdapter(post: IPost) {
  return {
    avatarPath: post.author?.avatar?.path,
    linkPath: `/posts/${post.id}`,
    title: `${t('search_result.posted_by')} ${post.authorDisplayName}`,
    subtitle: post.content,
  }
}

function groupAdapter(group: IGroup) {
  return {
    avatarPath: group?.avatar?.path,
    linkPath: `/groups/${group.id}`,
    title: group.name,
    subtitle: `${group.stats?.membersCount} ${t('search_result.members')}`,
  }
}

function personAdapter(person: IPerson) {
  return {
    avatarPath: person.avatar?.path,
    linkPath: `/profile/${person.id}`,
    title: person.displayName || person.username,
    subtitle: `${t('search_result.followers')}: ${person.followerCount} ${t('search_result.following')}: ${
      person.followingCount
    }`,
  }
}
</script>

<style lang="scss" scoped>
.result {
  &__item {
    h3 {
      font-weight: bold;
    }
  }
}
</style>
