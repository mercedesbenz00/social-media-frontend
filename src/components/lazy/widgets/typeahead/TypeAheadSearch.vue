<template>
  <div class="search">
    <div class="search-field">
      <TypeAhead
        class="search-input"
        ref="typeAheadRef"
        @query="searchQuery"
        @reset="reset"
        :distinctUntilChanged="false"
        @focus="onFocus"
        @blur="showSearch = false"
        @hide="showSearch = false"
        @keydown.enter="!loading ? seeAll() : ''"
      />
      <POverlayPanel ref="op" class="search-overlay-panel w-[260px] p-4" @click="clear()">
        <Loading v-if="loading" />
        <div v-if="noResult">{{ $t('search_result.no_result') }}</div>
        <TypeAheadResultList />
        <PDivider v-if="!loading && !noResult" layout="horizontal" />
        <div v-if="!loading && !noResult" class="px-4 cursor-pointer see-all" @click.stop="seeAll">
          <i class="i-heroicons-solid:search me-4" />
          <p>{{ $t('search_result.see_all') }}</p>
        </div>
      </POverlayPanel>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Subject, Subscription, switchMap } from 'rxjs'
import type OverlayPanel from 'primevue/overlaypanel'
import { useSearchStore } from '@/data/search/search.store'

defineProps({
  isMob: {
    type: Boolean,
    required: false,
    default: false,
  },
})
const query = ref('')
const typeAheadRef = ref()
const loading = computed(() => useSearchStore().loading)
const noResult = computed(() => useSearchStore().noResult)
const result = computed(() => useSearchStore().result)
const subject = new Subject<string>()

const queryCalls = subject.asObservable().pipe(switchMap((query) => useSearchStore().searchQuery(query)))
const op = ref()

const showSearch = ref(false)

function searchQuery(q: string, event) {
  query.value = q
  subject.next(q)
  ;(op.value as OverlayPanel).show(event, event.target)
}

function reset() {
  op.value.hide()
  query.value = ''
}

function clear() {
  typeAheadRef.value.reset()
  reset()
}

function onFocus(event) {
  if ((loading.value || result.value) && query.value.length >= 2) {
    ;(op.value as OverlayPanel).show(event, event.target)
  }
}

function seeAll() {
  useSearchStore().setPageResult()
  op.value.hide()
}

let sub: Subscription
onMounted(() => {
  sub = queryCalls.subscribe()
})

onUnmounted(() => {
  sub.unsubscribe()
})
</script>

<style lang="scss" scoped>
.search-overlay-panel {
  width: 360px;
}
.see-all {
  display: flex;
  align-items: center;
}

.search {
  &-btn {
    --at-apply: 'lg:hidden btn-flat-primary text-2xl';
  }
  &-field {
    --at-apply: 'hidden lg:flex';
  }
}
</style>
