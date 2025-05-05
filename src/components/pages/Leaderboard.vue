<template>
  <div class="flex-1 overflow-y-scroll px-5 w-full flex flex-col">
    <HubPageHeader>
      <template #icon>
        <img src="../../assets/imgs/trifle-trophyy-sm.png" alt="🏆" class="size-[1.5em]" />
      </template>
      leaderboard
    </HubPageHeader>
    <!-- tabs -->
    <nav class="gap-[0.45rem] mt-4 grid grid-cols-2">
      <button
        class="bubble-btn p-4.5"
        @click="selectedTab = 'monthly'"
        :style="selectedTab === 'monthly' ? 'filter: hue-rotate(-345deg) saturate(2.5)' : ''"
      >
        This Week
      </button>
      <button
        class="bubble-btn p-4.5"
        @click="selectedTab = 'allTime'"
        :style="selectedTab === 'allTime' ? 'filter: hue-rotate(103deg) saturate(2)' : ''"
      >
        All Time
      </button>
    </nav>
    <div class="flex-1 overflow-y-scroll-masked no-scrollbar no-scrollbar">
      <!-- leaderboard list -->
      <div class="space-y-2">
        <div v-for="i in 25" :key="i" class="flex items-center gap-3 p-3 bg-zinc-200 rounded-lg">
          <div class="font-mono w-6 text-right">{{ i }}.</div>
          <div class="size-8 rounded-full bg-zinc-400"></div>
          <div class="flex-1">Player {{ i }}</div>
          <div class="font-mono">
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
