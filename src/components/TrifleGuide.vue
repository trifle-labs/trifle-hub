<template>
  <section class="_flex _flex-col _items-center _gap-[1.75em]">
    <div class="_flex _flex-col-reverse _items-center _tracking-[0.75em] _animate-scaleup-sm">
      <div>🪩</div>
      <div>🪩🪩</div>
      <div>🪩🪩🪩</div>
      <div>🪩🪩🪩🪩</div>
      <div>🪩🪩🪩🪩🪩</div>
      <div>🪩🪩🪩🪩🪩🪩</div>
      <div>🪩🪩🪩🪩🪩🪩🪩</div>
    </div>
    <div class="_flex _flex-col">
      <div class="_text-[#B4B4BB] _text-stroke-xl _text-center">more from...</div>
      <div class="_-mt-[1em] _animate-wiggle-sm">
        <img
          src="../assets/imgs/trifle-masthead.png"
          class="_w-full _max-w-[24em]"
          loading="lazy"
        />
      </div>
    </div>
    <div class="_flex _flex-col _justify-center _items-center _w-full _gap-em">
      <a href="https://t.me/addstickers/Triflelife" target="_blank" class="_w-3/4 _max-w-[16em]">
        <img
          src="../assets/imgs/sticker-animation.gif"
          class="_w-full _border-[6px] _border-dashed _shadow-[0_8px_16px_rgba(0,0,0,0.1)] _rounded-xl _bg-white _mx-auto _border-[#DDD]"
          style="image-rendering: pixelated"
          loading="lazy"
        />
      </a>
      <a
        href="https://t.me/addstickers/Triflelife"
        target="_blank"
        class="_w-auto _bg-metallic-cone _rounded-full _text-em-2xl _text-stroke-2xl _px-[0.5em] _shadow-panel _whitespace-nowrap _animate-wiggle-sm"
      >
        Gigi + TiLT stickers
      </a>
    </div>
    <div class="_mt-2 _flex _flex-col-reverse _items-center _tracking-[0.75em] _animate-scaleup-sm">
      <div>🪩</div>
      <div>🪩🪩</div>
      <div>🪩🪩🪩</div>
      <div>🪩🪩🪩🪩</div>
    </div>
    <!-- games -->
    <button class="_relative _w-full _max-w-[22em] _group" @click="hub.openHub('games')">
      <figure
        class="_w-full _scale-[1.6] masked-oval _relative _flex _items-center _justify-center _pointer-events-none"
        style="aspect-ratio: 14.5/9; filter: blur(2px)"
      >
        <video
          src="https://gm-trifle.b-cdn.net/dsiwc6udm/video/upload/c_scale,f_auto,q_auto:eco,w_400/v1748287290/anybody-gameplay-clip-2_cf6p3x.mov"
          autoplay
          muted
          playsinline
          webkit-playsinline
          preload="auto"
          loop
          class="_absolute _top-0 _left-0 _w-full _h-full _object-cover"
          :style="{
            // filter: 'blur(3px)',
            imageRendering: 'pixelated'
          }"
          loading="lazy"
        ></video>
      </figure>
      <div class="_absolute _inset-0 _flex _items-center _justify-center">
        <div class="group-hover:_scale-[1.2] _duration-150">
          <div
            class="_bg-metallic-cone _rounded-full _text-em-2xl _text-stroke-2xl _pl-[0.25em] _pr-[0.5em] _shadow-panel _whitespace-nowrap _animate-wiggle-sm _flex _items-center _gap-1"
          >
            <img src="../assets/imgs/tilt-head-sm.png" class="_h-[1.25em]" />
            games, contests
          </div>
        </div>
      </div>
    </button>
    <div
      class="_mt-4 _flex _flex-col-reverse _items-center _tracking-[0.75em] _animate-scaleup-sm _relative _z-10"
    >
      <div>🪩</div>
      <div>🪩🪩</div>
      <div>🪩🪩🪩</div>
      <div>🪩🪩🪩🪩</div>
    </div>
    <!-- earn -->
    <button class="_relative _w-full _max-w-[22em] _group" @click="hub.openHub('earn')">
      <div class="_absolute _inset-0 _flex _items-center _justify-center">
        <img
          :src="authStore.user?.avatar || smileyFace"
          class="_w-1/2 _rounded-full"
          :class="{ '_opacity-30': !authStore.user?.avatar }"
          style="filter: blur(1px)"
          loading="lazy"
        />
      </div>
      <figure
        class="_relative _z-10 _w-full _scale-[2.25] masked-oval _relative _flex _items-center _justify-center _pointer-events-none"
        style="aspect-ratio: 14.5/8.5; mix-blend-mode: multiply"
      >
        <video
          src="https://gm-trifle.b-cdn.net/dsiwc6udm/video/upload/q_60/v1753961582/balls-falling-cropped_ap5ld5.mp4"
          autoplay
          muted
          playsinline
          webkit-playsinline
          preload="auto"
          loop
          class="_absolute _top-0 _left-0 _w-full _h-full _object-cover"
          loading="lazy"
        ></video>
      </figure>
      <div class="_absolute _bottom-0 _left-0 _w-full _flex _items-center _justify-center _h-1/3">
        <div class="group-hover:_scale-[1.2] _duration-150">
          <div
            class="_bg-metallic-cone _rounded-full _text-em-2xl _text-stroke-2xl _pl-[0.25em] _pr-[0.5em] _shadow-panel _whitespace-nowrap _animate-wiggle-sm _flex _items-center _gap-1"
          >
            🪩 earn BALL$
          </div>
        </div>
      </div>
    </button>
    <div
      class="_mt-5 _flex _flex-col-reverse _items-center _tracking-[0.75em] _animate-scaleup-sm _relative _z-10"
    >
      <div>🪩</div>
      <div>🪩🪩</div>
      <div>🪩🪩🪩</div>
      <div>🪩🪩🪩🪩</div>
    </div>
    <nav
      class="_gap-em-2xs _text-center _flex _flex-wrap _justify-center _max-w-[12em] _mx-auto _text-em-lg _text-stroke-lg _pointer-events-auto _tracking-[0.02em]"
    >
      <div
        v-for="social in [
          platforms.farcaster,
          platforms.twitter,
          platforms.discord,
          platforms.telegram
        ]"
        :key="social.name"
        class="_animate-wiggle _flex _items-center"
      >
        <a
          :href="social.url"
          target="_blank"
          class="_block _bg-metallic-linear _shadow-panel _rounded-full _px-[0.65em] _py-[0.2em] mouse:hover:_scale-[1.3] mouse:hover:_z-10 _relative _duration-300 _transition _pointer-events-auto"
          :style="{ color: social.textColor }"
          :fid="social.fid"
        >
          {{ social.nameLowercase || social.name.toLowerCase() }}
        </a>
      </div>
      <!-- <div class="w-full flex justify-center mt-[0.5em] gap-[2em] _text-md">
        <router-link
          to="/terms-and-conditions"
          class="opacity-60 text-[#c0c0c0] leading-none _text-em-xs mouse:hover:scale-[1.3] duration-300"
        >
          terms
        </router-link>
        <a
          href="https://trifle.life/legal/impressum"
          target="_blank"
          class="opacity-60 text-[#c0c0c0] leading-none _text-em-xs mouse:hover:scale-[1.3] duration-300"
        >
          impressum
        </a>
      </div> -->
    </nav>
    <div
      class="_text-[#B4B4BB] _text-em-lg _text-stroke-2xl _text-center _animate-wiggle _tracking-[0.1em]"
    >
      XD
    </div>
  </section>
</template>

<script setup>
import { inject } from 'vue'
import { platforms } from '../config/socialsConfig'
import smileyFace from '../assets/imgs/smiley-face-dashed-inside-noShadow.png'

const hub = inject('hub')
const authStore = inject('TrifleHub/store')
</script>

<style scoped>
.masked-oval {
  --oval-mask: radial-gradient(
    ellipse 50% 40% at 50% 50%,
    rgba(0, 0, 0, 1) 70%,
    rgba(0, 0, 0, 0.7) 78%,
    rgba(0, 0, 0, 0.4) 86%,
    rgba(0, 0, 0, 0.15) 93%,
    rgba(0, 0, 0, 0.08) 96%,
    rgba(0, 0, 0, 0.04) 98%,
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
