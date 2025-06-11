<template>
  <div class="_flex-1 _overflow-y-scroll-masked _no-scrollbar _w-full">
    <header class="_px-5 _-mt-3.5">
      <HubPageHeader>
        <template #icon>
          <img
            src="../assets/imgs/tilt.png"
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
    <div class="_mt-4 _-space-y-3">
      <template v-for="game in games" :key="game.name">
        <section class="_relative _group">
          <a
            :href="game.link"
            target="_blank"
            class="_block _pointer-events-auto _cursor-pointer _scale-[1.05] mouse:hover:_scale-[1.1] _duration-500"
          >
            <figure
              class="masked-oval _relative _flex _items-center _justify-center _pointer-events-none"
              style="aspect-ratio: 14.5/9"
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
          <div class="_px-2.5 _mx-6 _flex _justify-center _-mt-5 _relative _p-2">
            <div
              class="_bg-metallic-linearff _shadow-panel-insetff _rounded-lg _flex _items-center _w-fullff _justify-between _flex-col _gap-1 _shadow-panel-insetff _rounded-full _w-full _pb-5"
            >
              <a
                :href="game.link"
                target="_blank"
                class="_-mt-8 _relative _z-10 _bg-metallic-cone _shadow-panel _rounded-full _px-8 _py-1.5 _weight-black _tracking-[0.2em] _text-em-2xl sm:_text-em-3xl mouse:hover:_scale-[1.05] _duration-150"
                :class="{
                  '_animate-rainbow-wiggle': game.isNewUntil > today
                }"
              >
                <template v-if="game.isNewUntil > today">
                  <span class="mouse:group-hover:_hidden">NEW</span>
                  <span class="mouse:group-hover:_inline _hidden">PLAY</span>
                </template>
                <template v-else> PLAY </template>
              </a>
              <div v-if="game.description" class="_relative _-mt-3 _shadow-panel-inset _rounded-md">
                <p
                  class="_px-4.5 _leading-none _py-4.5 _italic _opacity-50ff _whitespace-nowrap _text-stroke-lg _tracking-[0.01em]"
                  v-html="game.description"
                ></p>
                <!-- (new badge) -->
                <!-- <div
                  v-if="game.isNewUntil > today"
                  class="_absolute _bottom-0 _right-0 _translate-x-[55%] _translate-y-[40%]"
                >
                  <div
                    class="_bg-metallic-cone _shadow-panel _rounded-full _text-em-lg _weight-semibold _tracking-wide _px-[0.75em] _leading-none _pt-[0.2em] _pb-[0.27em] _animate-rainbow-wiggle"
                  >
                    new
                  </div>
                </div> -->
              </div>
            </div>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup>
import HubPageHeader from '../components/HubPageHeader.vue'
import anybodyTitleImg from '../assets/imgs/anybody-title.png'

const today = new Date()

// use cloudinary for videos so they're cached across domains for users
const games = [
  {
    name: 'gm-game',
    link: 'https://gm.trifle.life',
    description: 'find a new gm → win <span class="_not-italic">🪩</span>BALL$',
    bgVideo:
      'https://res.cloudinary.com/dsiwc6udm/video/upload/q_auto:eco/v1749555540/gm-game-clip-optim_ubnztp.mp4',
    bgBlur: 0,
    isNewUntil: new Date('July 15, 2025')
  },
  {
    name: 'anybody',
    description: 'a daily puzzle-shooter, fully onchain!',
    link: 'https://anybody.gg',
    bgVideo:
      'https://res.cloudinary.com/dsiwc6udm/video/upload/c_scale,f_auto,q_auto:eco,w_400/v1748287290/anybody-gameplay-clip-2_cf6p3x.mov',
    titleImg: anybodyTitleImg,
    bgBlur: 2
  },
  {
    name: 'kudzu',
    link: 'https://kudzu.rodeo',
    description: 'burn the most NFTs → win TIA',
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

._animate-rainbow-wiggle {
  animation: rainbow-wiggle 1s ease-in-out infinite;
}

@keyframes rainbow-wiggle {
  0% {
    filter: hue-rotate(0deg) brightness(1) contrast(1) saturate(3);
    transform: rotate(-8deg);
  }
  50% {
    filter: hue-rotate(180deg) brightness(1) contrast(1) saturate(3);
    transform: rotate(8deg);
  }
  100% {
    filter: hue-rotate(360deg) brightness(1) contrast(1) saturate(3);
    transform: rotate(-8deg);
  }
}
</style>
