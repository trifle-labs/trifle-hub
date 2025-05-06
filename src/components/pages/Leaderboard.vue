<template>
  <div class="_flex-1 _overflow-y-scroll _px-5 _w-full _flex _flex-col">
    <HubPageHeader>
      <template #icon>
        <img src="../../assets/imgs/trifle-trophyy-sm.png" alt="🏆" class="_h-[1.75em]" />
      </template>
      leaderboard
    </HubPageHeader>
    <!-- tabs -->
    <nav class="_gap-[0.45rem] _mt-4 _grid _grid-cols-2">
      <button
        class="_bubble-btn _p-4.5"
        @click="selectedTab = 'monthly'"
        :style="selectedTab === 'monthly' ? 'filter: hue-rotate(-345deg) saturate(2.5)' : ''"
      >
        This Week
      </button>
      <button
        class="_bubble-btn _p-4.5"
        @click="selectedTab = 'allTime'"
        :style="selectedTab === 'allTime' ? 'filter: hue-rotate(103deg) saturate(2)' : ''"
      >
        All Time
      </button>
    </nav>
    <div class="_flex-1 _overflow-y-scroll-masked _no-scrollbar _no-scrollbar">
      <!-- leaderboard list -->
      <div class="_space-y-2">
        <div v-for="i in 25" :key="i" class="_flex _items-center _gap-3 _p-3 _bg-zinc-200 _rounded-lg">
          <div class="_font-mono _w-6 _text-right">{{ i }}.</div>
          <div class="_size-8 _rounded-full _bg-zinc-400"></div>
          <div class="_flex-1">Player {{ i }}</div>
          <div class="_font-mono">
            {{ selectedTab === 'monthly' ? 100 - i * 10 : 1000 - i * 100 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HubPageHeader from '../../components/HubPageHeader.vue'

const selectedTab = ref('monthly')
</script>
