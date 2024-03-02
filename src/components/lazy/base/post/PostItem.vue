<template>
  <PostItemWrapper>
    <PostItemHeader
      class="post-header"
      @click="handleRedirect"
      :post="post"
      @refresh="emit('refresh')"
      @update="(v) => emit('update', v)"
      @remove="(v) => $emit('remove', v)"
    />
    <PostItemBody
      @redirect="handleRedirect"
      class="post-media"
      :post="post"
      :class="route.params.id == post.id ? 'mobile-first' : ''"
    />
    <PostContent class="post-content my-2" v-if="post.content" :content="post.content" />
    <PDivider class="order-2 lg:order-0" />
    <slot name="footer">
      <PostItemFooter :post="post" class="post-footer" />
    </slot>
  </PostItemWrapper>
</template>
<script lang="ts" setup>
import type { IPost } from '@/data/posts/posts.interface'
import type { PropType } from 'vue-demi'
const router = useRouter()
const emit = defineEmits(['refresh', 'update', 'remove'])
const props = defineProps({
  post: {
    type: Object as PropType<IPost>,
    required: true,
  },
})
const route = useRoute()
const handleRedirect = () => {
  router.push('/posts/' + props.post.id)
}

const isMobile = computed(() => window?.innerWidth < 575)
</script>
<style scoped lang="scss">
@media screen and (max-width: 575px) {
  .post {
    &-header {
      --at-apply: 'order-0';
    }
    &-content {
      --at-apply: 'order-1';
    }
    &-media {
      --at-apply: 'order-2';
      &.mobile-first {
        --at-apply: 'order-first';
      }
    }
    &-footer {
      order: 3;
      --at-apply: 'order-3 my-2 m-0';
    }
  }
}
</style>
