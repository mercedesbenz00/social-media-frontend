<template>
  <div class="group-item cursor-pointer mb-4" @click="router.push(data.linkPath)">
    <PAvatar
      :image="data.avatarPath || useAssets(data.linkPath.includes('group') ? 'no-group.svg' : 'no-avatar.svg')"
      class="me-2 p-avatar-lg-s"
      shape="circle"
    />
    <div>
      <div class="group-item__title">
        {{ data.title }}
      </div>
      <div class="group-item__subtitle" v-if="data.subtitle">
        {{ data.subtitle.length > 60 ? data.subtitle.slice(0, 60) + '...' : data.subtitle }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAssets } from '@/composables/useAssets'
import type { PropType } from 'vue'

type TAdapter = (data: any) => { avatarPath?: string; linkPath?: string; title?: string; subtitle?: string }

const router = useRouter()
const props = defineProps({
  data: {
    type: Object as any,
    required: true,
  },
  adapter: {
    type: Function as PropType<TAdapter>,
    required: true,
  },
})

const data = props.adapter(props.data)
</script>

<style lang="scss" scoped>
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
</style>
