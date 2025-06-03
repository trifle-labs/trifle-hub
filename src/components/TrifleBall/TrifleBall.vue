<!-- BallViewer.vue -->
<template>
  <div
    ref="container"
    class="ball-viewer"
    :class="{
      'is-dragging': isDragging,
      'is-loading': !isReady
    }"
  ></div>
</template>

<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount,
  computed,
  watch,
  defineExpose,
  defineEmits,
  nextTick
} from 'vue'
import { BallVisualizer } from './trifle-ball'
import arcadeTexture from './assets/arcade-edit-blur.jpg'
import stickerTexture from './assets/trifle-fidget.png'

const props = defineProps({
  cameraAngle: {
    type: Number,
    default: 0 // 0 = equator, positive = north, negative = south
  },
  mode: {
    type: String,
    default: 'metal', // 'metal', 'glass', or 'glass-inner-wall'
    validator: (value) => ['metal', 'glass', 'glass-inner-wall'].includes(value)
  },
  imageSource: {
    type: String,
    default: null
  },
  animate: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['click'])

const container = ref(null)
const visualizer = ref(null)
const isDragging = ref(false)
const isSpinning = ref(false)
const isReady = ref(false)
const isVisible = ref(true)
let observer = null

const spinFast = () => {
  if (!visualizer.value || isSpinning.value || !isReady.value) return
  isSpinning.value = true
  visualizer.value.spinFast()
  setTimeout(() => {
    isSpinning.value = false
  }, 1000)
}

defineExpose({ spinFast })

const initVisualizer = () => {
  if (visualizer.value) {
    visualizer.value.cleanup()
  }

  isReady.value = false
  visualizer.value = new BallVisualizer(container.value, {
    arcadeTexturePath: arcadeTexture,
    stickerTexturePath: props.mode === 'metal' ? stickerTexture : null,
    imageSource: props.mode !== 'metal' ? props.imageSource : null,
    mode: props.mode,
    cameraAngle: props.cameraAngle,
    spinOnClick: true,
    onDragStateChange: (dragging) => {
      isDragging.value = dragging
      if (dragging) {
        isSpinning.value = false
      }
    },
    onClick: () => {
      emit('click')
    },
    onReady: () => (isReady.value = true)
  })
  visualizer.value.init()
}

// Watch for changes in mode or imageSource
watch(
  [() => props.mode, () => props.imageSource],
  () => {
    initVisualizer()
  },
  { deep: true }
)

onMounted(() => {
  initVisualizer()

  observer = new window.IntersectionObserver(async ([entry]) => {
    isVisible.value = entry.isIntersecting
    if (visualizer.value) {
      if (isVisible.value) {
        if (!props.animate) {
          // wait for ball to render then pause if not supposed to be animating
          await new Promise((resolve) => setTimeout(resolve, 400))
          visualizer.value.pause()
        } else {
          visualizer.value.resume()
        }
      } else {
        visualizer.value.pause()
      }
    }
  })
  if (container.value) observer.observe(container.value)
})

watch(
  () => props.animate,
  (animate) => {
    if (visualizer.value) {
      return animate ? visualizer.value.resume() : visualizer.value.pause()
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  if (visualizer.value) {
    visualizer.value.cleanup()
  }
  if (observer && container.value) observer.unobserve(container.value)
})
</script>

<style scoped>
.ball-viewer {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  /* cursor: grab; set in parent as default */
  opacity: 1;
  transition: opacity 0.3s ease;
  touch-action: none; /* Prevent default touch behaviors */
}

.ball-viewer.is-loading {
  opacity: 0;
  cursor: default;
}

.ball-viewer.is-dragging {
  cursor: grabbing !important;
  user-select: none;
}

.ball-viewer canvas {
  width: 100% !important;
  height: 100% !important;
}

.spin-button {
  padding: 0.5rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  background: #2563eb;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
}

.spin-button:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.spin-button:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}
</style>
