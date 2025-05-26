<template>
  <div class="_flex-1 _overflow-y-scroll _w-full _flex _flex-col">
    <header class="_px-5">
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
    </header>
    <div class="_flex-1 _overflow-y-scroll-masked _no-scrollbar">
      <!-- <div class="_grid _grid-cols-2 _gap-4">
        <div
          v-for="i in 16"
          :key="i"
          class="_aspect-square _bg-zinc-400 _rounded-lg _flex _items-center _justify-center"
        >
          Game {{ i }}
        </div>
      </div> -->
      <div class="_space-y-4 _mt-2">
        <template v-for="n in 2" :key="n">
          <section>
            <img src="../../assets/imgs/demo/anybody-banner.png" alt="" class="_w-full" />
            <div class="_flex _justify-center _items-center _-mt-8 _px-4">
              <p
                class="_bg-metalic-cone _px-4 _py-0.5 _rounded _shadow-panel-inset _italic _text-em-sm _opacity-50ff _whitespace-nowrap"
              >
                a daily puzzle-shooter with ETH prizes!
              </p>
              <button
                class="_-ml-1.5 _relative _bg-metalic-cone _shadow-panel _rounded-full _px-8 _py-1.5 _weight-black _tracking-[0.1em] _text-em-xl"
              >
                PLAY
              </button>
            </div>
          </section>
          <section>
            <img src="../../assets/imgs/demo/kudzu-banner.png" alt="" class="_w-full" />
            <div class="_flex _justify-center _items-center _-mt-8 _px-4">
              <p
                class="_bg-metalic-cone _px-4 _py-0.5 _rounded _shadow-panel-inset _italic _text-em-sm _opacity-50ff _whitespace-nowrap"
              >
                burn the most NFTs &rarr; win TIA!
              </p>
              <button
                class="_-ml-1.5 _relative _bg-metalic-cone _shadow-panel _rounded-full _px-8 _py-1.5 _weight-black _tracking-[0.1em] _text-em-xl"
              >
                PLAY
              </button>
            </div>
          </section>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import HubPageHeader from '../../components/HubPageHeader.vue'
</script>
