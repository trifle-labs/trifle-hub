<template>
  <div class="_flex-1 _overflow-y-scroll _px-5 _w-full _flex _flex-col">
    <HubPageHeader>
      <template #icon>
        <img src="../../assets/imgs/disco-ball-on-graph.png" alt="📈🪩" class="_h-[1.75em]" />
      </template>
      earn
    </HubPageHeader>
    <div class="_space-y-4 _mt-4">
      <div class="_p-4 _bg-zinc-200 _rounded-lg">
        <div class="_text-lg _font-semibold">Current Balance</div>
        <div class="_text-3xl _font-mono">1,234</div>
      </div>
      <div class="_space-y-2">
        <div v-for="i in 3" :key="i" class="_flex _items-center _gap-3 _p-3 _bg-zinc-200 _rounded-lg">
          <div class="_size-8 _rounded-full _bg-zinc-400"></div>
          <div class="_flex-1">
            <div class="_font-medium">Earn Method {{ i }}</div>
            <div class="_text-sm _text-gray-600">Complete tasks to earn rewards</div>
          </div>
          <div class="_font-mono">+100</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import HubPageHeader from '../../components/HubPageHeader.vue'
</script>
