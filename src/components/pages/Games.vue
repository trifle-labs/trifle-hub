<template>
  <div class="flex-1 overflow-y-scroll px-5 w-full flex flex-col">
    <HubPageHeader>
      <template #icon>
        <img
          src="../../assets/imgs/tilt.png"
          alt="🎮"
          class="h-[105%] -mr-[0.75%] block transform translate-y-[5%]"
        />
      </template>
      games, contests
    </HubPageHeader>
    <div class="flex-1 overflow-y-scroll-masked no-scrollbar">
      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="i in 16"
          :key="i"
          class="aspect-square bg-zinc-400 rounded-lg flex items-center justify-center"
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
