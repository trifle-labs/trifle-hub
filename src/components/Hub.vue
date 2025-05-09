<template>
  <div
    id="trifle-hub"
    class="trifle-hub-ui _fixed _left-0 _top-0 _w-full _h-full _pointer-events-none _select-none _font-trifle _text-base _text-stroke-xs"
    :data-position="props.position"
  >
    <!-- (tap bg to close) -->
    <button
      v-show="hubOpen"
      class="_absolute _top-0 _left-0 _w-full _h-full _pointer-events-auto"
      @click="hubOpen = false"
    ></button>
    <!-- hub menu button / labels -->
    <div class="_absolute _z-10 _p-2 sm:_p-4 trifle-hub-position">
      <button
        class="_size-16 _rounded-full _bg-zinc-500 _flex _items-center _justify-center _pointer-events-auto"
        @click="hubOpen = !hubOpen"
      >
        {{ hubOpen ? 'X' : '' }}
      </button>
    </div>
    <!-- (hub page) -->
    <transition name="thub-fade-in-scale-up">
      <aside
        v-if="hubOpen"
        class="_absolute trifle-hub-position _w-full _h-full _px-1 _pb-1 _pt-3 sm:_pt-10 _flex sm:_pb-12 sm:_px-24 _max-w-[42rem] _max-h-[60rem] _z-10"
      >
        <!-- panel -->
        <div
          class="_w-full _pointer-events-auto _flex _flex-col _animate-float _relative _overflow-hidden"
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
            class="_absolute _top-0 _left-0 _w-full _h-full _opacity-[0.6] _bg-cover _bg-center"
            :style="`background-image: url(${bgImg})`"
          ></div>
          <!-- <div class="w-full flex justify-between pt-3 px-4.5 absolute top-0 right-0 z-10">
            <div>&larr; back</div>
            <div class="text-lg">32 🪩 4<sup>th</sup></div>
          </div> -->
          <nav
            class="_order-last _w-full _flex _justify-between _items-end _pb-4.5 sm:_pb-6 _leading-snug _pl-3.5 _pr-5 sm:_pl-6 sm:_pr-9 _-mt-8 sm:_-mt-18 _relative _z-10 _text-stroke-sm _text-em-md sm:_text-mlg _pointer-events-none"
          >
            <button
              class="_flex _flex-col _items-center _-mr-6 _pointer-events-auto"
              @click="openHub('games')"
              :class="{ _underline: props.hubPageKey === 'games' }"
            >
              <img
                src="../assets/imgs/gigi-tilt-heads.png"
                alt="fidget spinner creature, Titl standing on black cat, GiGi's head"
                class="_h-[5em] sm:_h-[6em] _origin-bottom"
                :class="{ '_animate-wiggle-sm': props.hubPageKey === 'games' }"
              />
              games
            </button>
            <button
              class="_flex _flex-col _items-center _gap-2 _pointer-events-auto"
              @click="openHub('leaderboard')"
              :class="{ _underline: props.hubPageKey === 'leaderboard' }"
            >
              <img
                src="../assets/imgs/trifle-trophyy-sm.png"
                alt="🏆"
                class="_h-11 sm:_h-13 _origin-bottom"
                :class="{ '_animate-wiggle': props.hubPageKey === 'leaderboard' }"
              />
              leaderboard
            </button>
            <button
              class="_flex _flex-col _items-center _gap-2 _-ml-2 _pointer-events-auto"
              @click="openHub('earn')"
              :class="{ _underline: props.hubPageKey === 'earn' }"
            >
              <img
                src="../assets/imgs/disco-ball-on-graph.png"
                alt="📈🪩"
                class="_h-11 sm:_h-14 _origin-bottom"
                :class="{ '_animate-wiggle': props.hubPageKey === 'earn' }"
              />
              earn
            </button>
            <button
              class="_flex _flex-col _items-center _gap-2 _pointer-events-auto"
              @click="openHub('account')"
              :class="{ _underline: props.hubPageKey === 'account' }"
            >
              <!-- <div
                class="_size-11 sm:_size-13 _rounded-full _bg-zinc-400 _origin-bottom"
                :class="{ '_animate-wiggle': props.hubPageKey === 'account' }"
              ></div> -->
              <img
                src="../assets/imgs/smiley-face-dashed-outline.svg"
                alt="smiley face with dashed outline"
                class="_size-[3.1em] sm:_size-[3.5em] _-mb-[0.5em] _origin-bottom"
                :class="{ '_animate-wiggle': props.hubPageKey === 'account' }"
              />
              account
            </button>
          </nav>
          <!-- pages, scrollable -->
          <div class="_flex-1 _flex _overflow-y-scroll _select-text _relative _no-scrollbar">
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
const props = defineProps({
  hubPageKey: { type: String, required: true },
  position: { type: String, default: 'bottom-left', required: true }
})

const hubPage = computed(() => hubPages[props.hubPageKey])

const { openHub } = inject('hub')
</script>

<style>
#trifle-hub {
  &[data-position='bottom-left'] {
    & .trifle-hub-position {
      bottom: 0;
      left: 0;
    }
    & .thub-fade-in-scale-up-enter-active,
    & .thub-fade-in-scale-up-leave-active {
      transition: all 0.3s ease;
      transform-origin: left 80%;
    }
    & .thub-fade-in-scale-up-enter-from,
    & .thub-fade-in-scale-up-leave-to {
      opacity: 0;
      transform: translateY(20%) scale(0) rotate(10deg);
    }
  }
  &[data-position='bottom-right'] {
    & .trifle-hub-position {
      bottom: 0;
      right: 0;
    }
    & .thub-fade-in-scale-up-enter-active,
    & .thub-fade-in-scale-up-leave-active {
      transition: all 0.3s ease;
      transform-origin: right 80%;
    }
    & .thub-fade-in-scale-up-enter-from,
    & .thub-fade-in-scale-up-leave-to {
      opacity: 0;
      transform: translateY(20%) scale(0) rotate(10deg);
    }
  }
  &[data-position='top-left'] {
    & .trifle-hub-position {
      top: 0;
      left: 0;
    }
    & .thub-fade-in-scale-up-enter-active,
    & .thub-fade-in-scale-up-leave-active {
      transition: all 0.3s ease;
      transform-origin: left -20%;
    }
    & .thub-fade-in-scale-up-enter-from,
    & .thub-fade-in-scale-up-leave-to {
      opacity: 0;
      transform: translateY(20%) scale(0) rotate(10deg);
    }
  }
  &[data-position='top-right'] {
    & .trifle-hub-position {
      top: 0;
      right: 0;
    }
    & .thub-fade-in-scale-up-enter-active,
    & .thub-fade-in-scale-up-leave-active {
      transition: all 0.3s ease;
      transform-origin: right -20%;
    }
    & .thub-fade-in-scale-up-enter-from,
    & .thub-fade-in-scale-up-leave-to {
      opacity: 0;
      transform: translateY(20%) scale(0) rotate(10deg);
    }
  }
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

._animate-float {
  animation: float 4s ease-in-out infinite;
}

._overflow-y-scroll-masked {
  overflow-y: scroll;
  padding-top: 1rem;
  padding-bottom: 3.75rem;
  mask-image: linear-gradient(to bottom, transparent 0%, black 5%, black 85%, transparent 100%);
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0rem,
    black 1.125rem,
    black calc(100% - 4rem),
    transparent 100%
  );
}
</style>
