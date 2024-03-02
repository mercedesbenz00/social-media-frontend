<template>
  <div class="rounded-full">
    <p-button
      :loading="loading"
      :class="btnOptions.class"
      :icon="btnOptions.icon"
      @click.prevent.stop="fileInput.click()"
    />
    <input ref="fileInput" class="hidden" :id="id" type="file" accept="image/*" @change="upload" />
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  options: {
    type: Object,
    required: false,
    default: {
      aspectRatio: 1 / 1,
    },
  },
  rounded: {
    type: Boolean,
    required: false,
    default: false,
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
  btnOptions: {
    type: Object,
    required: true,
  },
})
interface InputFileEvent extends Event {
  target: HTMLInputElement
}
const emits = defineEmits(['upload'])

const fileInput = ref<any>(null)

const upload = (event: InputFileEvent) => {
  const file = event.target.files?.[0] ?? null
  const reader = new FileReader()
  reader.addEventListener(
    'load',
    () => {
      fileInput.value.value = ''
      if (reader.result) cropImg(reader.result.toString())
    },
    false
  )
  if (file) reader.readAsDataURL(file)
}

const cropImg = (src: string) => {
  const { $vfm } = useGlobals()
  const component = resolveComponent('CropperUploader')
  $vfm.show({
    component,
    bind: {
      title: 'Edit ' + props.id,
      drag: false,
      size: 'auto',
      options: props.options,
      rounded: props.rounded,
      src,
    },
    on: {
      close: () => {
        $vfm.hideAll()
      },
      crop: (canvas: HTMLCanvasElement) => {
        emits('upload', canvas)
        $vfm.hideAll()
      },
    },
  })
}
</script>
