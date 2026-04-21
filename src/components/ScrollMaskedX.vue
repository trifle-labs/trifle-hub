<template>
  <div
    ref="el"
    class="_overflow-x-scroll _no-scrollbar _scroll-masked-x"
    :style="{
      '--fade-left': atStart ? '0rem' : fade,
      '--fade-right': atEnd ? '0rem' : fade
    }"
    @scroll.passive="update"
  >
    <div ref="inner" class="_scroll-masked-x-inner">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  fade: { type: String, default: '1.5rem' }
})

const el = ref(null)
const inner = ref(null)
const atStart = ref(true)
const atEnd = ref(false)

const update = () => {
  const e = el.value
  if (!e) return
  atStart.value = e.scrollLeft <= 1
  atEnd.value = e.scrollLeft + e.clientWidth >= e.scrollWidth - 1
}

let ro
let mo
onMounted(async () => {
  await nextTick()
  update()
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(update)
    ro.observe(el.value)
    if (inner.value) ro.observe(inner.value)
  }
  if (typeof MutationObserver !== 'undefined' && inner.value) {
    mo = new MutationObserver(update)
    mo.observe(inner.value, { childList: true, subtree: true, characterData: true })
  }
})
onBeforeUnmount(() => {
  ro?.disconnect()
  mo?.disconnect()
})
</script>

<style scoped>
._scroll-masked-x {
  overflow-y: hidden;
  --fade-left: 0rem;
  --fade-right: 0rem;
  --mask: linear-gradient(
    to right,
    transparent 0,
    black var(--fade-left),
    black calc(100% - var(--fade-right)),
    transparent 100%
  );
  mask-image: var(--mask);
  -webkit-mask-image: var(--mask);
}
._scroll-masked-x-inner {
  display: inline-block;
  min-width: 100%;
}
</style>
