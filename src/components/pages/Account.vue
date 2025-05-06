<template>
  <div class="_p-4 _pt-10 _w-full _flex _flex-col _gap-4 _items-center">
    <header class="_flex _flex-col _gap-3 _items-center">
      <div class="_size-24 _rounded-full _border">
        <img
          src="../../assets/imgs/smiley-face-dashed-outline.svg"
          alt="smiley face with dashed outline"
          class="_w-full _block _transform _origin-center _scale-[1.35] sm:_scale-[1.45]"
        />
      </div>
      <h2
        class="_text-3xl sm:_text-4xl _tracking-wide _w-full _text-center _truncate _min-w-0 _leading-tight"
        style="-webkit-text-stroke: 0.06em"
      >
        who r u??
      </h2>
      <div>
        Link identities &rarr;
        <span class="_ffborder-b _border-current" style="border-style: dashed"> earn BALL$</span>
        🪩
      </div>
    </header>
    <!-- <section
        class="_w-full _rounded-lg _bg-[rgba(240,245,255,0.5)] _shadow-[0_1px_1px_rgba(0,0,0,0.5)_inset] _leading-snug"
        style="backdrop-filter: blur(10px)"
      >
        <div class="_px-4 _py-2 _flex _justify-between _items-center">
          <div>
            <div class="_flex _items-center _gap-2">
              <span>Link or create a Wallet</span>
            </div>
            <p class="_text-sm _italic _opacity-40">for our onchain games</p>
          </div>
          <button
            class="_bubble-btn _h-10 _pl-6 _pr-5"
            style="filter: hue-rotate(-340deg) saturate(1.8)"
          >
            <span style="filter: hue-rotate(340deg) saturate(0.5)">Wallet 👝</span>
          </button>
        </div>
      </section> -->
    <section class="_mt-1.5 _w-full _px-1.5 sm:_px-8 _flex _flex-col _gap-4 _items-center">
      <nav class="_flex _flex-col _gap-1.5 _w-full _leading-none">
        <button class="_bubble-btn _p-4.5" style="filter: hue-rotate(-236deg) saturate(1.35)">
          <div
            class="_flex _justify-between _items-center _gap-2.5"
            style="filter: hue-rotate(236deg) saturate(0.75)"
          >
            <img
              src="../../assets/imgs/ethereum-logo-white.svg"
              class="_size-7 _rounded-lg"
              style="background-color: #f1584d"
            />
            <div class="_flex-1 _min-w-0 _truncate _text-center">Link Wallet</div>
            <div class="_size-7 _flex _justify-end _items-center">
              <div
                class="_whitespace-nowrap _leading-tight _pr-0.5 _pl-1 _bg-[rgba(250,250,255)]/40 _rounded-lg _text-[0.875em]"
              >
                +10 🪩
              </div>
            </div>
          </div>
        </button>
        <button class="_bubble-btn _p-4.5" style="filter: hue-rotate(-345deg) saturate(2)">
          <div
            class="_flex _justify-between _items-center _gap-2.5"
            style="filter: hue-rotate(345deg) saturate(0.5)"
          >
            <img src="../../assets/imgs/discord-logo.svg" class="_size-7 _rounded-lg" />
            <div class="_flex-1 _min-w-0 _truncate _text-center">Link Discord</div>
            <div class="_size-7 _flex _justify-end _items-center">
              <div
                class="_whitespace-nowrap _leading-tight _pr-0.5 _pl-1 _bg-[rgba(250,250,255)]/40 _rounded-lg _text-[0.875em]"
              >
                +10 🪩
              </div>
            </div>
          </div>
        </button>
        <!-- <button class="_bubble-btn _p-4.5" style="filter: brightness(0.93)">
          <div class="_flex _justify-between _items-center _gap-2.5">
            <img
              src="../../assets/imgs/twitter-x-logo.svg"
              class="_size-7 _rounded-lg"
              style="filter: grayscale(1)"
            />
            <div class="_flex-1 _min-w-0 _truncate _text-center">Connect TwitterX</div>
            <div class="_size-7 _flex _justify-end _items-center">
              <div class="_text-[0.875em] _pr-0.5">soon</div>
            </div>
          </div>
        </button>
        <button
          class="_bubble-btn _p-4.5"
          style=""
          :style="{ filter: 'hue-rotate(-20deg) saturate(1.8)' }"
        >
          <div
            class="_flex _justify-between _items-center _gap-2.5"
            :style="{ filter: 'hue-rotate(20deg) saturate(0.6)' }"
          >
            <img src="../../assets/imgs/telegram-logo.svg" class="_size-7 _rounded-lg" />
            <div class="_flex-1 _min-w-0 _truncate _text-center">Connect Telegram</div>
            <div class="_size-7 _flex _justify-end _items-center">
              <div class="_text-[0.875em] _pr-0.5">soon</div>
            </div>
          </div>
        </button>
        <button
          class="_bubble-btn _p-4.5"
          style=""
          :style="{ filter: 'hue-rotate(-335deg) saturate(2)' }"
        >
          <div
            class="_flex _justify-between _items-center _gap-2.5"
            :style="{ filter: 'hue-rotate(335deg) saturate(0.5)' }"
          >
            <img src="../../assets/imgs/farcaster-logo.svg" class="_size-7 _rounded-lg" />
            <div class="_flex-1 _min-w-0 _truncate _text-center">Connect Farcaster</div>
            <div class="_size-7 _flex _justify-end _items-center">
              <div class="_text-[0.875em] _pr-0.5">soon</div>
            </div>
          </div>
        </button> -->
      </nav>
      <div class="_-my-2">or</div>
      <div class="_w-full _flex _flex-col _gap-1.5">
        <button class="_bubble-btn _p-4.5">
          <div class="_flex _justify-between _items-center _gap-2.5">
            <img
              src="../../assets/imgs/ethereum-logo-white.svg"
              class="_size-7 _rounded-lg _bg-slate-400"
            />
            <div class="_flex-1 _min-w-0 _truncate _text-center">Create Smart Wallet</div>
            <div class="_size-7 _flex _justify-end _items-center">
              <div
                class="_whitespace-nowrap _leading-tight _pr-0.5 _pl-1 _bg-[rgba(250,250,255)]/40 _rounded-lg _text-[0.875em]"
              >
                +10 🪩
              </div>
            </div>
          </div>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup></script>

<style>
._bubble-btn {
  border-radius: 10px;
  border-image-source: url(../../assets/imgs/bubblegum-recess.png);
  border-image-slice: 82 95 77 92 fill;
  border-image-width: 17px;
  border-image-outset: 0px;
  border-image-repeat: stretch;
  background-color: transparent;
  user-select: none;
  margin: -4px -8px -5px -8px;
}
._bubble-btn:active:not([disabled]) {
  border-image-width: 15px;
}
._bubble-btn:active:not([disabled]) > * {
  transform: scale(0.995);
  transform-origin: center;
}
@media (hover: hover) {
  ._bubble-btn:hover {
    border-image-width: 19px;
  }
}
</style>
