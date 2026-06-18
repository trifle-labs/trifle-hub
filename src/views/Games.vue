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
    <!-- category tabs -->
    <nav
      class="_px-5 _gap-[0.45rem] _mt-4 _grid _grid-cols-2 _text-stroke-2xl _text-xl _tracking-wide _mb-3"
    >
      <button
        class="_bubble-btn _px-4.5 _h-16"
        :class="{ '_animate-wiggle-sm': selectedTab === 'games' }"
        @click="selectedTab = 'games'"
        :style="selectedTab === 'games' ? 'filter: hue-rotate(-345deg) saturate(2.5)' : ''"
      >
        games
      </button>
      <button
        class="_bubble-btn _px-4.5 _h-16"
        :class="{ '_animate-wiggle-sm': selectedTab === 'lotteries' }"
        @click="selectedTab = 'lotteries'"
        :style="selectedTab === 'lotteries' ? 'filter: hue-rotate(103deg) saturate(2)' : ''"
      >
        prizes
      </button>
    </nav>
    <!-- <div class="_grid _grid-cols-2 _gap-4">
      <div
        v-for="i in 16"
        :key="i"
        class="_aspect-square _bg-zinc-400 _rounded-lg _flex _items-center _justify-center"
      >
        Game {{ i }}
      </div>
    </div> -->
    <div class="_mt-5 _-space-y-1 _overflow-hidden">
      <transition name="thub-page" mode="out-in">
        <div :key="selectedTab" class="_space-y-1">
          <section v-for="game in currentList" :key="game.name" class="_relative _group">
            <a
              :href="game.linkDisabled ? null : game.link"
              class="_block _pointer-events-auto _scale-[1.05] mouse:hover:_scale-[1.1] _duration-500"
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
                    // imageRendering: 'pixelated'
                  }"
                  loading="lazy"
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
                  :href="game.linkDisabled ? null : game.link"
                  class="_-mt-8 _relative _z-10 _bg-metallic-cone _shadow-panel _rounded-full _px-8 _py-1.5 _weight-black _text-em-2xl sm:_text-em-3xl mouse:hover:_scale-[1.05] _duration-150 _select-none"
                  :class="{
                    '_animate-rainbow-wiggle': game.isNewUntil > today && !game.title,
                    '_animate-rainbow-wiggle-sm': game.isNewUntil > today && game.title,
                    '_tracking-[0.2em]': !game.title,
                    '_tracking-[0.05em]': game.title
                  }"
                >
                  <template v-if="game.title">{{ game.title }}</template>
                  <template v-else-if="game.isNewUntil > today">
                    <span class="mouse:group-hover:_hidden">NEW</span>
                    <span class="mouse:group-hover:_inline _hidden">PLAY</span>
                  </template>
                  <template v-else> PLAY </template>
                </a>
                <div
                  v-if="game.description"
                  class="_relative _-mt-3 _shadow-panel-inset _rounded-md"
                >
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
        </div>
      </transition>

      <section class="_mx-8 _text-center _flex _flex-col _gap-3.5">
        <div class="_mt-4"></div>

        <div class="_opacity-[0.35] _animate-wiggle-sm _mb-0.5 _text-lg _text-stroke-mdff">
          follow for updates
        </div>
        <div class="_grid _grid-cols-2 _gap-2">
          <SocialsButtons />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch } from 'vue'
import HubPageHeader from '../components/HubPageHeader.vue'
import anybodyTitleImg from '../assets/imgs/anybody-title.png'
import SocialsButtons from '../components/SocialsButtons.vue'
// import { sdk } from '@farcaster/miniapp-sdk'
const today = new Date()
const hub = inject('hub')

const selectedTab = ref('games')

// use https://gm-trifle.b-cdn.net for videos so they're cached across domains for users
const games = [
  {
    name: 'snake',
    title: 'SNAKE.rodeo',
    link: 'https://snake.rodeo',
    description: 'MMO-Snake, win <span class="_not-italic">🪩</span> + airdrop',
    bgVideo:
      // 'https://gm-trifle.b-cdn.net/dsiwc6udm/video/upload/q_auto:eco/v1749555540/gm-game-clip-optim_ubnztp.mp4',
      `https://gm-trifle.b-cdn.net/dsiwc6udm/video/upload/q_auto:eco,h_480/v1770644193/chomp-combined-2-titled-end-4frames__110spd_nobxlw.mp4`,
    bgBlur: 0,
    scale: 1,
    isNewUntil: new Date('March 15, 2026')
  },
  {
    name: 'anybody',
    description: 'daily puzzle-shooter, win <span class="_not-italic">🪩</span>',
    // link: anybodyLink,
    link: 'https://anybody.gg',
    bgVideo:
      'https://gm-trifle.b-cdn.net/dsiwc6udm/video/upload/c_scale,f_auto,q_auto:eco,w_400/v1748287290/anybody-gameplay-clip-2_cf6p3x.mov',
    titleImg: anybodyTitleImg,
    bgBlur: 2
  },
  {
    name: 'gm-game',
    title: 'GM GAME',
    // link: 'https://gm.trifle.life',
    link: 'https://gm.trifle.life',
    description: 'write gm\'s → win BALL$ <span class="_not-italic">🪩</span>',
    bgVideo:
      // 'https://gm-trifle.b-cdn.net/dsiwc6udm/video/upload/q_auto:eco/v1749555540/gm-game-clip-optim_ubnztp.mp4',
      'https://gm-trifle.b-cdn.net/dsiwc6udm/video/upload/q_auto:eco,h_480/v1760612566/Screen_Recording_2025-10-16_at_12.58.28_tiytn2.mov',
    bgBlur: 0,
    isNewUntil: new Date('July 15, 2025')
  },
  {
    name: 'kudzu',
    title: 'ENDED',
    link: 'https://kudzu.rodeo',
    description: 'burn NFTs → win $TIA',
    bgVideo:
      'https://gm-trifle.b-cdn.net/dsiwc6udm/video/upload/ac_none,c_scale,q_auto:best,w_600/v1748286440/fdckedgxrgrfkmlb4ech.webm',
    bgBlur: 0
  }
]

const lotteries = [
  {
    name: 'like-lottery',
    title: 'WEEKLY PRIZES',
    link: 'https://trifle.life/prizes',
    description: 'get BALL$ <span class="_not-italic">🪩</span> → win USDC',
    // NOTE THIS ASSET IS ALSO USED ON THE EARN PAGE
    bgVideo:
      'https://gm-trifle.b-cdn.net/dsiwc6udm/video/upload/q_auto:eco/v1757079745/lottery-gif-loop-better-shorter__16-9__240p-400br_f5bx63.mp4',
    bgBlur: 0,
    isNewUntil: new Date('September 30, 2099')
  }
]

const currentList = computed(() => (selectedTab.value === 'lotteries' ? lotteries : games))

const applyOpenTab = (nextOpenTab) => {
  if (!nextOpenTab || nextOpenTab.page !== 'games') return
  selectedTab.value = nextOpenTab.tab === 'lotteries' ? 'lotteries' : 'games'
}

applyOpenTab(hub?.openTab?.value)

watch(
  () => hub?.openTab?.value,
  (nextOpenTab) => applyOpenTab(nextOpenTab)
)
</script>

<style scoped></style>

<style></style>
