<template>
  <div class="_flex-1 _overflow-y-scroll _px-5 _w-full _flex _flex-col _border">
    <HubPageHeader>
      <template #icon>
        <img
          src="../../assets/imgs/tilt.png"
          alt="🎮"
          class="_h-[105%] _-mr-[0.75%] _block _transform _translate-y-[5%]"
        />
      </template>
      games, contests
    </HubPageHeader>
    <div class="_flex-1 _overflow-y-scroll-masked _no-scrollbar">
      <div class="_grid _grid-cols-2 _gap-4">
        <div
          v-for="i in 16"
          :key="i"
          class="_aspect-square _bg-zinc-400 _rounded-lg _flex _items-center _justify-center"
        >
          Game {{ i }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import HubPageHeader from '../../components/HubPageHeader.vue'
</script>
