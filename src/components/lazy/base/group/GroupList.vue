<template>
  <div v-if="!props.loading" class="group-list">
    <h3>{{ props.title }}</h3>
    <PDivider class="divider"></PDivider>
    <template v-if="props.items?.length">
      <div v-for="(item, i) in firstTreeItems" :key="i">
        <div class="group-item cursor-pointer" @click="goToGroupDetails(item.id)">
          <router-link :to="'/groups/' + item.id">
            <Avatar class="me-2" :src="item.avatar?.path || assetImage('no-group.svg')" />
          </router-link>
          <div class="me-2">
            <div class="group-item__title">
              {{ item.name.length > 25 ? item.name.slice(0, 22) + '...' : item.name }}
            </div>
            <div class="group-item__subtitle text-ellipsis overflow-hidden">
              {{ $t('profile_card.groups', { n: item.stats?.membersCount }) }}
            </div>
          </div>
          <PButton
            v-if="item.memberState == 'APPROVED' || item.memberState == 'PENDING'"
            :label="''"
            icon="i-figma:user-minus"
            class="!ms-auto !shrink-0"
            v-tooltip.top="$t('groups.leave')"
            @click.stop="emit('joinOrLeave', item)"
          ></PButton>
          <PButton
            v-else
            :label="''"
            icon="i-figma:user-plus"
            class="!ms-auto !shrink-0 btn-outlined-primary"
            v-tooltip.top="$t('groups.join')"
            @click.stop="emit('joinOrLeave', item)"
          ></PButton>
        </div>
        <PDivider class="divider"></PDivider>
      </div>
    </template>
    <div v-else class="group-item">{{ $t('groups.no_group') }}</div>
    <RouterLink :to="`/groups/details?type=${type}`" v-if="more" class="see-more"> {{ $t('see_more') }} </RouterLink>
  </div>
  <GroupListSkeleton v-else></GroupListSkeleton>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { IGroup } from '@/data/groups/groups.interface'
import { useAssets } from '@/composables/useAssets'
const router = useRouter()

const props = defineProps({
  title: {
    type: String,
    default: 'Groups',
  },
  type: {
    type: String,
    default: 'recent',
  },
  items: {
    type: Array as PropType<IGroup[]>,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['joinOrLeave'])
const assetImage = useAssets
const more = computed(() => {
  return props.items?.length > 3
})

const firstTreeItems = computed(() => props.items?.slice(0, 3))

function goToGroupDetails(id: number) {
  router.push(`/groups/${id}`)
}
</script>

<style lang="scss" scoped>
.group-list {
  --at-apply: ' p-4 w-full defaults bg-bg-primary rounded-xl primary-shadow min-w-240px';

  h3 {
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
  }
}

.group-item {
  display: flex;
  align-items: center;

  &__item {
    font-weight: 700;
    font-size: 12px;
    line-height: 16px;
    margin-bottom: 4px;
  }

  &__title {
    font-weight: 700;
    font-size: 12px;
    line-height: 16px;
  }

  &__subtitle {
    font-weight: 400;
    font-size: 10px;
    line-height: 12px;
    --at-apply: 'text-text-primary-light/50';
  }
}

.divider {
  margin: 0.5rem 0 !important;
}

.see-more {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  --at-apply: 'text-link';
}
</style>
