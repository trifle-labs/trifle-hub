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
    <div class="_mt-6 _-space-y-5">
      <template v-for="game in games" :key="game.name">
        <section>
          <a
            :href="game.link"
            target="_blank"
            class="_block _pointer-events-auto _cursor-pointer mouse:hover:_scale-[1.05] _duration-500"
          >
            <figure
              class="masked-oval _relative _flex _items-center _justify-center _pointer-events-none"
              style="aspect-ratio: 14/9"
            >
              <video
                v-if="game.bgVideo"
                :src="game.bgVideo"
                autoplay
                muted
                playsinline
                webkit-playsinline
                preload="auto"
                loop
                class="_absolute _top-0 _left-0 _w-full _h-full _object-cover"
                :style="{
                  filter: game.bgBlur ? `blur(${game.bgBlur}px)` : 'none'
                }"
              ></video>
              <img
                v-else
                :src="game.image"
                alt=""
                class="_w-full _scale-y-[1.4] mouse:hover:_scale-y-[1.45] mouse:hover:_scale-x-[1.05] _cursor-pointer _duration-500"
              />
              <img v-if="game.titleImg" :src="game.titleImg" class="_relative _z-10 _w-[75%]" />
            </figure>
          </a>
          <div class="_px-2 _mx-6 _flex _justify-center _-mt-5 _relative _p-2">
            <div
              class="_bg-metalic-linearff _shadow-panel-insetff _rounded-lg _flex _items-center _w-fullff _justify-between _flex-col _gap-1 _shadow-panel-insetff _rounded-full _w-full _pb-5"
            >
              <a
                :href="game.link"
                target="_blank"
                class="_-mt-7 _relative _bg-metalic-cone _shadow-panel _rounded-full _px-8 _py-1.5 _weight-black _tracking-[0.2em] _text-em-2xl mouse:hover:_scale-[1.05] _duration-150"
              >
                PLAY
              </a>
              <p
                class="_px-5 _leading-none _py-4.5 _-mt-3.5 _italic _text-em-sm _opacity-50ff _whitespace-nowrap _text-stroke-lg ff_bg-metalic-linear _shadow-panel-inset _rounded-md"
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
import anybodyTitleImg from '../../assets/imgs/anybody-title.png'

// use cloudinary for videos so they're cached across domains for users
const games = [
  {
    name: 'anybody',
    description: 'a daily puzzle-shooter with ETH prizes',
    link: 'https://anybody.gg',
    bgVideo:
      'https://res.cloudinary.com/dsiwc6udm/video/upload/c_scale,f_auto,q_auto:eco,w_400/v1748287290/anybody-gameplay-clip-2_cf6p3x.mov',
    titleImg: anybodyTitleImg,
    bgBlur: 2
  },
  {
    name: 'kudzu',
    link: 'https://kudzu.rodeo',
    description: 'burn the most Kudzu NFTs → win TIA',
    bgVideo:
      'https://res.cloudinary.com/dsiwc6udm/video/upload/ac_none,c_scale,q_auto:best,w_600/v1748286440/fdckedgxrgrfkmlb4ech.webm',
    bgBlur: 0
  }
]
</script>

<style scoped>
.masked-oval {
  --oval-mask: radial-gradient(
    ellipse 80% 48% at 50% 50%,
    rgba(0, 0, 0, 1) 70%,
    rgba(0, 0, 0, 0.7) 78%,
    rgba(0, 0, 0, 0.4) 86%,
    rgba(0, 0, 0, 0.15) 93%,
    rgba(0, 0, 0, 0) 100%
  );
  -webkit-mask-image: var(--oval-mask);
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-image: var(--oval-mask);
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
}
</style>
