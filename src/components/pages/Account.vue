<template>
  <div class="p-4 pt-10 w-full flex flex-col gap-4 items-center">
    <header class="flex flex-col gap-3 items-center">
      <div class="size-24 rounded-full border">
        <img
          src="../../assets/imgs/smiley-face-dashed-outline.svg"
          alt="smiley face with dashed outline"
          class="w-full block transform origin-center scale-[1.35] sm:scale-[1.45]"
        />
      </div>
      <h2
        class="text-3xl sm:text-4xl tracking-wide w-full text-center truncate min-w-0 leading-tight"
        style="-webkit-text-stroke: 0.06em"
      >
        who r u??
      </h2>
      <div>
        Link identities &rarr;
        <span class="ffborder-b border-current" style="border-style: dashed"> earn BALL$</span>
        🪩
      </div>
    </header>
    <!-- <section
        class="w-full rounded-lg bg-[rgba(240,245,255,0.5)] shadow-[0_1px_1px_rgba(0,0,0,0.5)_inset] leading-snug"
        style="backdrop-filter: blur(10px)"
      >
        <div class="px-4 py-2 flex justify-between items-center">
          <div>
            <div class="flex items-center gap-2">
              <span>Link or create a Wallet</span>
            </div>
            <p class="text-sm italic opacity-40">for our onchain games</p>
          </div>
          <button
            class="bubble-btn h-10 pl-6 pr-5"
            style="filter: hue-rotate(-340deg) saturate(1.8)"
          >
            <span style="filter: hue-rotate(340deg) saturate(0.5)">Wallet 👝</span>
          </button>
        </div>
      </section> -->
    <section class="mt-1.5 w-full px-1.5 sm:px-8 flex flex-col gap-4 items-center">
      <nav class="flex flex-col gap-1.5 w-full leading-none">
        <button class="bubble-btn p-4.5" style="filter: hue-rotate(-236deg) saturate(1.35)">
          <div
            class="flex justify-between items-center gap-2.5"
            style="filter: hue-rotate(236deg) saturate(0.75)"
          >
            <img
              src="../../assets/imgs/ethereum-logo-white.svg"
              class="size-7 rounded-lg"
              style="background-color: #f1584d"
            />
            <div class="flex-1 min-w-0 truncate text-center">Link Wallet</div>
            <div class="size-7 flex justify-end items-center">
              <div
                class="whitespace-nowrap leading-tight pr-0.5 pl-1 bg-[rgba(250,250,255)]/40 rounded-lg text-[0.875em]"
              >
                +10 🪩
              </div>
            </div>
          </div>
        </button>
        <button class="bubble-btn p-4.5" style="filter: hue-rotate(-345deg) saturate(2)">
          <div
            class="flex justify-between items-center gap-2.5"
            style="filter: hue-rotate(345deg) saturate(0.5)"
          >
            <img src="../../assets/imgs/discord-logo.svg" class="size-7 rounded-lg" />
            <div class="flex-1 min-w-0 truncate text-center">Link Discord</div>
            <div class="size-7 flex justify-end items-center">
              <div
                class="whitespace-nowrap leading-tight pr-0.5 pl-1 bg-[rgba(250,250,255)]/40 rounded-lg text-[0.875em]"
              >
                +10 🪩
              </div>
            </div>
          </div>
        </button>
        <!-- <button class="bubble-btn p-4.5" style="filter: brightness(0.93)">
          <div class="flex justify-between items-center gap-2.5">
            <img
              src="../../assets/imgs/twitter-x-logo.svg"
              class="size-7 rounded-lg"
              style="filter: grayscale(1)"
            />
            <div class="flex-1 min-w-0 truncate text-center">Connect TwitterX</div>
            <div class="size-7 flex justify-end items-center">
              <div class="text-[0.875em] pr-0.5">soon</div>
            </div>
          </div>
        </button>
        <button
          class="bubble-btn p-4.5"
          style=""
          :style="{ filter: 'hue-rotate(-20deg) saturate(1.8)' }"
        >
          <div
            class="flex justify-between items-center gap-2.5"
            :style="{ filter: 'hue-rotate(20deg) saturate(0.6)' }"
          >
            <img src="../../assets/imgs/telegram-logo.svg" class="size-7 rounded-lg" />
            <div class="flex-1 min-w-0 truncate text-center">Connect Telegram</div>
            <div class="size-7 flex justify-end items-center">
              <div class="text-[0.875em] pr-0.5">soon</div>
            </div>
          </div>
        </button>
        <button
          class="bubble-btn p-4.5"
          style=""
          :style="{ filter: 'hue-rotate(-335deg) saturate(2)' }"
        >
          <div
            class="flex justify-between items-center gap-2.5"
            :style="{ filter: 'hue-rotate(335deg) saturate(0.5)' }"
          >
            <img src="../../assets/imgs/farcaster-logo.svg" class="size-7 rounded-lg" />
            <div class="flex-1 min-w-0 truncate text-center">Connect Farcaster</div>
            <div class="size-7 flex justify-end items-center">
              <div class="text-[0.875em] pr-0.5">soon</div>
            </div>
          </div>
        </button> -->
      </nav>
      <div class="-my-2">or</div>
      <div class="w-full flex flex-col gap-1.5">
        <button class="bubble-btn p-4.5">
          <div class="flex justify-between items-center gap-2.5">
            <img
              src="../../assets/imgs/ethereum-logo-white.svg"
              class="size-7 rounded-lg bg-slate-400"
            />
            <div class="flex-1 min-w-0 truncate text-center">Create Smart Wallet</div>
            <div class="size-7 flex justify-end items-center">
              <div
                class="whitespace-nowrap leading-tight pr-0.5 pl-1 bg-[rgba(250,250,255)]/40 rounded-lg text-[0.875em]"
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
.bubble-btn {
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
.bubble-btn:active:not([disabled]) {
  border-image-width: 15px;
}
.bubble-btn:active:not([disabled]) > * {
  transform: scale(0.995);
  transform-origin: center;
}
@media (hover: hover) {
  .bubble-btn:hover {
    border-image-width: 19px;
  }
}
</style>
