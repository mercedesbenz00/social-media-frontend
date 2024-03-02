<template>
  <div
    @click.stop="!isAdmin && !notClickable ? openCoverModal(cover) : ''"
    class="h-50 bg-gray-300 flex justify-center items-center overflow-hidden"
    :style="[
      cover
        ? `background-image: url(${cover}); background-size: cover`
        : `background-image:url(${assetImage('no-group-cover.svg')}); background-size: contain`,
    ]"
    :class="[{ 'cursor-pointer': isAdmin }]"
  >
    <CoverUploader v-if="isAdmin" @upload="uploadCoverHandler" class="cover--uploader" :loading="loading" />
  </div>
</template>
<script setup lang="ts">
import { useGroupsStore } from '@/data/groups/groups.store'
import { useAssets } from '@/composables/useAssets'
const props = defineProps({
  isAdmin: {
    type: Boolean,
    required: false,
    default: false,
  },
  cover: {
    type: String,
    required: false,
    default: null,
  },
  groupId: {
    type: Number,
    required: true,
  },
  notClickable: {
    type: Boolean,
    required: false,
    default: false,
  },
})
const assetImage = useAssets
const $groups = useGroupsStore()
const loading = ref(false)
const emits = defineEmits(['update'])
const uploadCoverHandler = async (payload: any) => {
  loading.value = true
  await $groups.setCover({ groupId: props.groupId, payload })
  loading.value = false
  emits('update')
}
const openCoverModal = (path: string) => {
  const { $vfm } = useGlobals()
  const component = resolveComponent('FullSizeImage')
  $vfm.show({
    component,
    bind: {
      drag: false,
      size: 'auto',
      noActions: true,
      adaptive: false,
      url: path,
    },
    on: {
      close: () => {
        $vfm.hideAll()
      },
    },
  })
}
</script>
