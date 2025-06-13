<template>
  <div
    id="trifle-hub"
    class="trifle-hub-ui _relative _pointer-events-none _select-none _font-trifle _text-base _text-stroke-xs"
    :data-position="props.position"
    style="z-index: var(--thub-z-index)"
  >
    <!-- (tap bg to close) -->
    <button
      v-show="hubOpen"
      class="_fixed _top-0 _left-0 _w-full _h-full _pointer-events-auto"
      @click="hubOpen = false"
      aria-label="close hub"
    ></button>
    <!-- menu button / labels -->
    <div
      id="trifle-hub__menu-button"
      class="_fixed _z-10 trifle-hub-position focus-visible:_ring-4 _rounded-full"
      style="
        width: var(--thub-menu-button-size);
        height: var(--thub-menu-button-size);
        margin: var(--thub-menu-button-margin);
      "
      tabindex="0"
      @keydown.space="hubOpen = !hubOpen"
      @keydown.enter="hubOpen = !hubOpen"
      :aria-label="hubOpen ? 'close trifle hub' : 'open trifle hub'"
    >
      <TrifleBall
        ref="trifleBall"
        :key="authUserAvatar || 'default'"
        :mode="authUserAvatar ? 'glass' : 'metal'"
        :image-source="authUserAvatar"
        :camera-angle="8"
        :animate="!hubOpen"
        class="_cursor-pointer _pointer-events-auto"
        @click="hubOpen = !hubOpen"
        tabindex="-1"
      />
    </div>
    <!-- (hub panel) -->
    <transition name="thub-fade-in-scale-up">
      <aside
        v-if="hubOpen"
        class="_fixed trifle-hub-position _w-full _h-full _px-1 _py-2 sm:_pt-10 _flex sm:_pb-12 sm:_mx-24 _max-w-[30rem] _max-h-[56rem] _z-10"
      >
        <!-- panel rendered -->
        <div
          class="_w-full _pointer-events-auto _flex _flex-col _relative _overflow-hidden"
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
          <Notifications />

          <!-- close -->
          <div class="_absolute _top-0 _right-0 _pt-3 _pr-4 _z-50 sm:_pt-4 sm:_pr-4.5">
            <button
              class="_p-1 _-m-1 _block _rounded-full _pointer-events-auto"
              @click="hubOpen = false"
            >
              <div
                class="_size-7 md:_size-8 _flex _items-center _justify-center _overflow-hidden _rounded-full _pointer-events-auto"
                style="box-shadow: 0 1px 1px rgba(0, 0, 0, 0.25) inset"
              >
                <!-- <img src="../assets/imgs/x-cross-rebar-shadow-sm.png" alt="close" class="_size-11" /> -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="black"
                  class="_w-full _scale-[1.7] _opacity-[0.12] mouse:hover:_opacity-20 _duration-[75ms]"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </button>
          </div>
          <!-- background layer -->
          <div class="_absolute _inset-0">
            <transition-group name="thub-bg-fade">
              <div
                v-if="hubPage.bgImg"
                :key="hubPage.bgImg"
                class="_absolute _top-0 _left-0 _w-full _h-full _opacity-[0.45] _bg-cover _bg-center"
                :style="{ backgroundImage: `url(${hubPage.bgImg})` }"
              ></div>
              <div
                v-else
                key="default"
                class="_absolute _top-0 _left-0 _w-full _h-full _bg-metallic-linear _opacity-[0.6]"
              ></div>
            </transition-group>
          </div>
          <!-- <div class="w-full flex justify-between pt-3 px-4.5 absolute top-0 right-0 z-10">
            <div>&larr; back</div>
            <div class="text-lg">32 🪩 4<sup>th</sup></div>
          </div> -->
          <nav
            class="_order-last _w-full _flex _justify-evenly sm:_justify-between _items-end _pb-4.5 sm:_pb-6 _leading-snug sm:_pl-6 sm:_pr-9 _-mt-12 sm:_-mt-18 _relative _z-10 _text-stroke-md _text-em-md sm:_text-mlg _pointer-events-none"
          >
            <button
              class="_flex _flex-col _items-center _-mr-6 _pointer-events-auto _relative"
              @click="openHub('games')"
              :class="{ 'thub-nav-active': props.hubPageKey === 'games' }"
            >
              <img
                src="../assets/imgs/gigi-tilt-heads.png"
                alt="fidget spinner creature, Tilt standing on black cat, GiGi's head"
                class="_h-[5em] sm:_h-[6em] _origin-bottom"
                :class="{ '_animate-wiggle-sm': props.hubPageKey === 'games' }"
              />
              games
            </button>
            <button
              class="_flex _flex-col _items-center _gap-2 _pointer-events-auto _relative"
              @click="openHub('leaderboard')"
              :class="{ 'thub-nav-active': props.hubPageKey === 'leaderboard' }"
            >
              <img
                src="../assets/imgs/trifle-trophy-sm.png"
                alt="🏆"
                class="_h-11 sm:_h-13 _origin-bottom"
                :class="{ '_animate-wiggle': props.hubPageKey === 'leaderboard' }"
              />
              leaderboard
            </button>
            <button
              class="_flex _flex-col _items-center _gap-2 _-ml-2 _pointer-events-auto _relative"
              @click="openHub('earn')"
              :class="{ 'thub-nav-active': props.hubPageKey === 'earn' }"
            >
              <img
                src="../assets/imgs/disco-ball-on-graph.png"
                alt="📈🪩"
                class="_h-11 sm:_h-14 _origin-bottom"
                :class="{ '_animate-wiggle': props.hubPageKey === 'earn' }"
              />
              BALL$
            </button>
            <button
              class="_flex _flex-col _items-center _gap-2 _pointer-events-auto _relative"
              @click="openHub('account')"
              :class="{ 'thub-nav-active': props.hubPageKey === 'account' }"
            >
              <div
                class="_size-[3.1em] sm:_size-[3.5em] _-mb-[0.5em] _origin-bottom _flex _items-center _justify-center"
                :class="{ '_animate-wiggle': props.hubPageKey === 'account' }"
              >
                <!-- (avatar) -->
                <div
                  v-if="authUserAvatar"
                  class="_size-[80%] _rounded-full _block _bg-cover _bg-center"
                  :style="{ backgroundImage: `url(${authUserAvatar})` }"
                  style="box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.75)"
                  aria-label="your avatar image"
                />
                <!-- (blank face) -->
                <object
                  v-else
                  :data="smileyFaceSvg"
                  type="image/svg+xml"
                  alt="smiley face with dashed outline"
                  class="_w-full _pointer-events-none"
                  tabindex="-1"
                ></object>
              </div>
              account
            </button>
          </nav>
          <!-- pages, scrollable -->
          <div class="_flex-1 _flex _overflow-y-scroll _select-text _relative _no-scrollbar">
            <transition name="thub-page" mode="out-in">
              <component :is="hubPage.component" />
            </transition>
          </div>
        </div>
      </aside>
    </transition>
  </div>
</template>

<script setup>
import { computed, inject, nextTick, ref, watch } from 'vue'
import hubPages from '../routes'
import borderImg from '../assets/imgs/metal-bubble-border.png'
import TrifleBall from './TrifleBall/TrifleBall.vue'
import Notifications from './Notifications.vue'
import smileyFaceSvg from '../assets/imgs/smiley-face-dashed-outline.svg'

const hubOpen = defineModel('hubOpen')

const props = defineProps({
  hubPageKey: { type: String, required: true },
  position: { type: String, default: 'bottom-left', required: true }
})

const hubPage = computed(() => hubPages[props.hubPageKey])

const { openHub } = inject('hub')
const auth = inject('TrifleHub/store')

const authUserAvatar = computed(() => auth.user?.avatar || auth.isFarcaster?.user?.avatar)

const trifleBall = ref(null)
watch(hubOpen, async (open) => {
  console.log('hubOpen?', open)
  if (!open) {
    await nextTick()
    trifleBall.value.spinFast()
  }
})
</script>

<style>
#trifle-hub,
#trifle-hub * {
  overscroll-behavior: contain;
}

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

._overflow-y-scroll-masked {
  --mask-top: 0.75rem;
  --mask-bottom: 5.5rem;
  --mask: linear-gradient(
    to bottom,
    transparent 0rem,
    black var(--mask-top),
    black calc(97% - var(--mask-bottom)),
    transparent 97%
  );
  overflow-y: scroll;
  padding-top: var(--mask-top);
  padding-bottom: var(--mask-bottom);
  mask-image: var(--mask);
  -webkit-mask-image: var(--mask);
}

.thub-page-enter-active,
.thub-page-leave-active {
  transition: all 150ms ease;
}

.thub-page-enter-from {
  opacity: 0;
  transform: translateY(5px);
}

.thub-page-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* when using transition-group */
.thub-page-group-leave-active {
  transition: all 150ms ease;
}
.thub-page-group-enter-active {
  transition: all 150ms 150ms ease;
}

.thub-page-group-enter-from {
  opacity: 0;
  transform: translateY(5px);
}

.thub-page-group-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.thub-bg-fade-enter-active,
.thub-bg-fade-leave-active {
  transition: all 0.3s ease;
}

.thub-bg-fade-enter-from,
.thub-bg-fade-leave-to {
  opacity: 0;
}

.thub-nav-active {
  &::after {
    content: '•';
    position: absolute;
    bottom: -0.75rem;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 16px;
    opacity: 0.2;
    color: rgb(132, 77, 183);
  }
}

/* .thub-menu-button-enter-active,
.thub-menu-button-leave-active {
  transition: all 200ms ease;
}

.thub-menu-button-enter-from,
.thub-menu-button-leave-to {
  opacity: 0;
  transform: scale(0.9);
  filter: blur(10px);
} */
</style>
