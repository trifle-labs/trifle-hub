<template>
  <div class="_flex-1 _overflow-y-scroll-masked _no-scrollbar _w-full">
    <header class="_px-5 _-mt-3.5">
      <HubPageHeader>
        <template #icon>
          <img
            src="../../assets/imgs/tilt.png"
            alt="🎮"
            class="_h-[105%] _block _transform _translate-y-[5%]"
          />
        </template>
        games, contests
      </HubPageHeader>
    </header>
    <!-- <div class="_grid _grid-cols-2 _gap-4">
      <div
        v-for="i in 16"
        :key="i"
        class="_aspect-square _bg-zinc-400 _rounded-lg _flex _items-center _justify-center"
      >
        Game {{ i }}
      </div>
    </div> -->
    <div class="_space-y-6 _mt-16">
      <template v-for="game in games" :key="game.name">
        <section class="_shadow-panel-insetff _mx-6ff _rounded-lg">
          <img
            :src="game.image"
            alt=""
            class="_w-full _scale-y-[1.4] mouse:hover:_scale-y-[1.45] mouse:hover:_scale-x-[1.05] _cursor-pointer _duration-500"
          />
          <div class="_px-2 _mx-6 _flex _justify-center _-mt-5 _relative _p-2">
            <div
              class="_bg-metalic-linearff _shadow-panel-insetff _rounded-lg _flex _items-center _w-fullff _justify-between _flex-col _gap-1 _shadow-panel-insetff _rounded-full _w-full _pb-5"
            >
              <button
                class="_-mt-7 _relative _bg-metalic-cone _shadow-panel _rounded-full _px-8 _py-1.5 _weight-black _tracking-[0.2em] _text-em-2xl mouse:hover:_scale-[1.02]"
              >
                PLAY
              </button>
              <p
                class="_px-4 _py-0.5ff _italic _text-em-smff _opacity-50ff _whitespace-nowrap _text-stroke-xl"
                v-html="game.description"
              ></p>
            </div>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup>
import HubPageHeader from '../../components/HubPageHeader.vue'
import anybodyImg from '../../assets/imgs/demo/anybody-banner.png'
import kudzuImg from '../../assets/imgs/demo/kudzu-banner.png'

const games = [
  {
    name: 'anybody',
    description: 'a daily puzzle-shooter with ETH prizes!',
    image: anybodyImg
  },
  {
    name: 'kudzu',
    description: 'burn the most NFTs &rarr; win TIA!',
    image: kudzuImg
  },
  {
    name: 'anybody',
    description: 'a daily puzzle-shooter with ETH prizes!',
    image: anybodyImg
  },
  {
    name: 'kudzu',
    description: 'burn the most NFTs &rarr; win TIA!',
    image: kudzuImg
  }
]
</script>
