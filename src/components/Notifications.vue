<template>
  <div
    class="_absolute _top-0 _left-0 _p-5 _z-50 _flex _flex-col _gap-1 _items-start _w-full _pointer-events-auto _pr-16 _overflow-y-auto _no-scrollbar _fineprint"
    style="transform: translateX(0%)"
  >
    <transition-group name="notif">
      <div
        v-for="n in notifications"
        :key="n.id"
        class="_pointer-events-auto _rounded-lg"
        style="box-shadow: 0 3px 6px 2px rgba(0, 0, 0, 0.1)"
        @click="remove(n.id)"
      >
        <div
          class="_p-3 _bg-metallic-linear _shadow-panel _rounded-lg _flex _gap-[0.75em] _weight-bold _leading-tight"
        >
          <div class="_w-[1em] _flex _items-start _justify-center _flex-shrink-0">
            <img src="../assets/imgs/tilt-head-sm.png" class="_w-full _scale-[1.75]" />
          </div>
          <div>{{ n.message }}</div>
          <div v-if="n.type" class="_w-[1em] _flex _items-center _justify-center">
            <img
              v-if="n.type === 'error'"
              src="../assets/imgs/red-x-glass.png"
              class="_w-full _scale-[1.5]"
            />
            <img
              v-else-if="n.type === 'success'"
              src="../assets/imgs/checkmark-icon-glass.png"
              class="_w-full _scale-[1.5]"
            />
          </div>
        </div>
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
.notif-enter-active {
  transition: all 150ms;
}
.notif-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
</style>
