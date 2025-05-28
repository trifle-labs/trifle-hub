<template>
  <div
    class="fixed top-4 left-1/2 z-50 flex flex-col items-center w-full pointer-events-none"
    style="transform: translateX(0%)"
  >
    <transition-group name="fade" tag="div">
      <div
        v-for="n in notifications"
        :key="n.id"
        class="pointer-events-auto mb-2 px-4 py-2 rounded shadow-lg min-w-[220px] max-w-[90vw] text-center cursor-pointer select-none _finePrint"
        :class="[
          n.type === 'error' ? 'bg-red-100 text-red-800 border border-red-300' : '',
          n.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : '',
          '_text-stroke-xs'
        ]"
        @click="remove(n.id)"
      >
        <span v-if="n.type === 'error'">❌</span>
        <span v-else-if="n.type === 'success'">✅</span>
        <span class="ml-1">{{ n.message }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { inject } from 'vue'
const store = inject('TrifleHub/store')
const notifications = store.notifications
const remove = store.removeNotification
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
