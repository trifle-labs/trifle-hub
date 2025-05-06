<template>
  <div
    id="hub"
    class="fixed left-0 top-0 w-full h-full pointer-events-none select-none font-sans text-md sm:text-sans-base"
  >
    <!-- (tap bg to close) -->
    <button
      v-show="hubOpen"
      class="absolute top-0 left-0 w-full h-full pointer-events-auto"
      @click="hubOpen = false"
    ></button>
    <!-- hub menu button / labels -->
    <div class="absolute z-10 bottom-0 left-0 p-2 sm:p-4">
      <button
        class="size-16 rounded-full bg-zinc-500 flex items-center justify-center pointer-events-auto"
        @click="hubOpen = !hubOpen"
      >
        {{ hubOpen ? 'X' : '' }}
      </button>
    </div>
    <!-- (hub page) -->
    <transition name="slide-up-fade-in-scale-up">
      <aside
        v-if="hubOpen"
        class="absolute bottom-0 left-0 w-full h-full px-1 pb-1 pt-3 sm:pt-10 flex sm:pb-12 sm:pl-24 max-w-[36rem] max-h-[60rem] z-10"
      >
        <!-- panel -->
        <div
          class="w-full pointer-events-auto flex flex-col animate-float relative overflow-hidden"
          :style="{
            'border-image-source': `url(${borderImg})`,
            'border-image-slice': '82 95 77 92 fill',
            'border-image-width': '36px',
            'border-image-outset': '0',
            'border-image-repeat': 'stretch',
            'border-style': 'solid',
            'background-color': 'transparent',
            'border-radius': '18.5px',
            'box-shadow': '0 12px 16px 0 rgba(0, 0, 0, 0.35)'
          }"
        >
          <div
            class="absolute top-0 left-0 w-full h-full opacity-[0.6] bg-cover bg-center"
            :style="`background-image: url(${bgImg})`"
          ></div>
          <!-- <div class="w-full flex justify-between pt-3 px-4.5 absolute top-0 right-0 z-10">
            <div>&larr; back</div>
            <div class="text-lg">32 🪩 4<sup>th</sup></div>
          </div> -->
          <nav
            class="order-last w-full flex justify-between items-end pb-4.5 sm:pb-6 leading-snug pl-3.5 pr-5 sm:pl-6 sm:pr-9 tracking-[-0.01em] -mt-7 sm:-mt-12 relative z-10 sm:text-[1.1em]"
          >
            <button
              class="flex flex-col items-center -mr-6"
              @click="openHub('games')"
              :class="{ underline: props.hubPageKey === 'games' }"
            >
              <img
                src="../assets/imgs/gigi-tilt-heads.png"
                alt="fidget spinner creature, Titl standing on black cat, GiGi's head"
                class="h-[5em] sm:h-[6em] origin-bottom"
                :class="{ 'animate-wiggle-sm': props.hubPageKey === 'games' }"
              />
              games
            </button>
            <button
              class="flex flex-col items-center gap-2"
              @click="openHub('leaderboard')"
              :class="{ underline: props.hubPageKey === 'leaderboard' }"
            >
              <img
                src="../assets/imgs/trifle-trophyy-sm.png"
                alt="🏆"
                class="h-11 sm:h-13 origin-bottom"
                :class="{ 'animate-wiggle': props.hubPageKey === 'leaderboard' }"
              />
              leaderboard
            </button>
            <button
              class="flex flex-col items-center gap-2 -ml-2"
              @click="openHub('earn')"
              :class="{ underline: props.hubPageKey === 'earn' }"
            >
              <img
                src="../assets/imgs/disco-ball-on-graph.png"
                alt="📈🪩"
                class="h-11 sm:h-14 origin-bottom"
                :class="{ 'animate-wiggle': props.hubPageKey === 'earn' }"
              />
              earn
            </button>
            <button
              class="flex flex-col items-center gap-2"
              @click="openHub('account')"
              :class="{ underline: props.hubPageKey === 'account' }"
            >
              <!-- <div
                class="size-11 sm:size-13 rounded-full bg-zinc-400 origin-bottom"
                :class="{ 'animate-wiggle': props.hubPageKey === 'account' }"
              ></div> -->
              <img
                src="../assets/imgs/smiley-face-dashed-outline.svg"
                alt="smiley face with dashed outline"
                class="size-[3.1em] sm:size-[3.5em] -mb-[0.5em] origin-bottom"
                :class="{ 'animate-wiggle': props.hubPageKey === 'account' }"
              />
              account
            </button>
          </nav>
          <div class="flex-1 flex overflow-y-scroll select-text relative">
            <component :is="hubPage.component" />
          </div>
        </div>
      </aside>
    </transition>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'
import hubPages from './pages/config'
import borderImg from '../assets/imgs/metalbubble-border.png'
import bgImg from '../assets/imgs/metal-gradient-conical.png'

const hubOpen = defineModel('hubOpen')
const props = defineProps({ hubPageKey: { type: String, required: true } })

const hubPage = computed(() => hubPages[props.hubPageKey])

const { openHub } = inject('hub')
</script>

<style>
.slide-up-fade-in-scale-up-enter-active,
.slide-up-fade-in-scale-up-leave-active {
  transition: all 0.3s ease;
  transform-origin: left 80%;
}
.slide-up-fade-in-scale-up-enter-from,
.slide-up-fade-in-scale-up-leave-to {
  opacity: 0;
  transform: translateY(20%) scale(0) rotate(10deg);
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.overflow-y-scroll-masked {
  overflow-y: scroll;
  padding-top: 1rem;
  padding-bottom: 3.75rem;
  mask-image: linear-gradient(to bottom, transparent 0%, black 5%, black 85%, transparent 100%);
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0rem,
    black 1.125rem,
    black calc(100% - 5rem),
    transparent 100%
  );
}
</style>
