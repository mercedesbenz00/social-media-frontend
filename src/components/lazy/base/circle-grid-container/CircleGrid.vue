<template>
  <div id="circle-container" class="circle-container"></div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { D3CirclesWithGravityAndNoOverlap, DummyNodes } from './d3-circles-with-gravity-and-no-overlap'
import type { INode } from './d3-circles-with-gravity-and-no-overlap'

const emit = defineEmits(['selectedCircles', 'allCircles', 'unselectedCircles', 'selectCircle', 'unselectCircle'])

const circleMap = ref<D3CirclesWithGravityAndNoOverlap>()

const props = defineProps({
  nodes: {
    type: Object as PropType<INode[] | any>,
    default: DummyNodes,
  },
  adapter: {
    type: Function,
    default: (data) => data,
  },
  height: {
    type: Number,
    default: 700,
  },
})

onMounted(async () => {
  const container = document.querySelector('#interests-container') as HTMLElement
  circleMap.value = new D3CirclesWithGravityAndNoOverlap({
    nodes: props.adapter(props.nodes),
    height: props.height,
    width: container && container.clientWidth ? container.clientWidth * 0.9 : window.innerWidth * 0.9,
    appendTo: '#circle-container',
    listener: (nodes, currentNode) => {
      emit(
        'allCircles',
        nodes.map((n) => n.data)
      )
      emit(
        'selectedCircles',
        nodes.filter((n) => n.selected).map((n) => n.data)
      )
      emit(
        'unselectedCircles',
        nodes.filter((n) => !n.selected).map((n) => n.data)
      )
      if (currentNode.selected) {
        emit('selectCircle', currentNode.data)
      } else {
        emit('unselectCircle', currentNode.data)
      }
    },
  })
  circleMap.value.initialize().start()
})

watch(props, () => {
  if (props.nodes) {
    circleMap.value?.setNodes(props.adapter(props.nodes)).initialize().start()
  }
})
</script>

<style lang="scss">
.circle-container {
  --at-apply: 'flex-center-none w-full';
}
.circle-group {
  cursor: pointer;
  overflow: hidden;
}

.circle-item {
  transition: fill 0.2s ease-in-out;
}
</style>
