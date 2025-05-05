<template>
  <div class="flex-1 overflow-y-scroll px-5 w-full flex flex-col">
    <HubPageHeader>
      <template #icon>
        <img src="../../assets/imgs/disco-ball-on-graph.png" alt="📈🪩" class="h-[1.75em]" />
      </template>
      earn
    </HubPageHeader>
    <div class="space-y-4 mt-4">
      <div class="p-4 bg-zinc-200 rounded-lg">
        <div class="text-lg font-semibold">Current Balance</div>
        <div class="text-3xl font-mono">1,234</div>
      </div>
      <div class="space-y-2">
        <div v-for="i in 3" :key="i" class="flex items-center gap-3 p-3 bg-zinc-200 rounded-lg">
          <div class="size-8 rounded-full bg-zinc-400"></div>
          <div class="flex-1">
            <div class="font-medium">Earn Method {{ i }}</div>
            <div class="text-sm text-gray-600">Complete tasks to earn rewards</div>
          </div>
          <div class="font-mono">+100</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import HubPageHeader from '../../components/HubPageHeader.vue'
</script>
