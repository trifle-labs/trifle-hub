<template>
  <div class="_p-5 _pb-0 _bodytext _w-full _flex _flex-col">
    <nav class="_flex _gap-0.5 _w-full">
      <button
        class="_bubble-btn _p-4 _flex-1"
        @click="activeTab = 'typography'"
        :style="activeTab === 'typography' ? 'filter: hue-rotate(-345deg) saturate(2.5)' : ''"
      >
        Typography
      </button>
      <button
        class="_bubble-btn _p-4 _flex-1"
        @click="activeTab = 'components'"
        :style="activeTab === 'components' ? 'filter: hue-rotate(-345deg) saturate(2.5)' : ''"
      >
        Components
      </button>
    </nav>
    <div ref="scrollEl" class="_flex-1 _overflow-y-scroll-masked _no-scrollbar _-mx-5 _px-5">
      <component :is="pages[activeTab]" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TypographyDemo from './TypographyDemo.vue'
import ComponentsDemo from './ComponentsDemo.vue'
import { watch } from 'vue'
const activeTab = ref('typography')

const pages = {
  typography: TypographyDemo,
  components: ComponentsDemo
}

const scrollEl = ref(null)
watch(activeTab, (newVal) => {
  scrollEl.value.scrollTo({ top: 0 })
})
</script>

<style></style>
