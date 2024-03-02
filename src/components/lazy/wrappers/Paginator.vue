<template>
  <PPaginator v-if="paginator && paginator.totalRecords" ref="paginator" class="paginator" template="PageLinks">
    <template #start="slotProps">
      <a v-if="lodash.get(slotProps, 'state.page') > 0" href="#" class="flex items-center" @click.stop="onPrev">
        <span class="pi pi-angle-left" />
        <span class="px-1">{{ $t('paginator.previous') }}</span>
      </a>
      <span v-else class="flex items-center cursor-no-drop text-gray-400">
        <span class="pi pi-angle-left" />
        <span class="px-1">{{ $t('paginator.previous') }}</span>
      </span>
    </template>
    <template #end>
      <span v-if="isLastPage" class="flex items-center cursor-no-drop text-gray-400">
        <span class="px-1">{{ $t('paginator.next') }}</span>
        <span class="pi pi-angle-right" />
      </span>
      <a v-else href="#" class="flex items-center" @click.stop="onNext">
        <span class="px-1">{{ $t('paginator.next') }}</span
        ><span class="pi pi-angle-right" />
      </a>
    </template>
  </PPaginator>
</template>

<script setup lang="ts">
const lodash = useLodash()
const paginator = ref()
const isLastPage = computed(() => {
  if (paginator.value) {
    const lastPage = paginator.value.pageLinks[paginator.value.pageLinks.length - 1]
    const { currentPage } = paginator.value
    return currentPage === lastPage
  }
  return false
})

const onNext = (e) => {
  paginator.value.changePageToNext(e)
}
const onPrev = (e) => {
  paginator.value.changePageToPrev(e)
}
</script>

<style lang="scss">
.paginator {
  --at-apply: 'rtl:justify-between card-defaults';
  .p-paginator-left-content {
    --at-apply: 'rtl:mr-0';
    .pi {
      --at-apply: 'rtl:rotate-180';
    }
  }
  .p-paginator-right-content {
    --at-apply: 'rtl:ml-0';
    .pi {
      --at-apply: 'rtl:rotate-180';
    }
  }
}
.paginator.p-paginator .p-paginator-pages .p-paginator-page {
  --at-apply: '!rounded-2xl';
}
.paginator.p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
  --at-apply: '!text-primary-text   !bg-primary/80 ';
}
</style>
