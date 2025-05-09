<template>
  <section class="_flex _flex-col _gap-1">
    <div class="_h3">Buttons</div>
    <button class="_bubble-btn _p-4.5">._bubble-btn</button>
    <button class="_bubble-btn _p-4.5 _text-em-sm" style="filter: hue-rotate(103deg) saturate(2)">
      style="filter: hue-rotate(103deg) saturate(2)"
    </button>
  </section>

  <div class="_h3">Sections</div>
  <section class="thub-section-inset">
    <div class="thub-section-inset__inner">
      <div>
        <span>.thub-section-inset</span>
        <p class="_text-sm _italic _opacity-40">makes inset with blur bg</p>
      </div>
      <div class="thub-section-inset__inner__right">
        <button
          class="_bubble-btn _h-10 _pl-6 _pr-5"
          style="filter: hue-rotate(-340deg) saturate(1.8)"
        >
          <span style="filter: hue-rotate(340deg) saturate(0.5)">Action</span>
        </button>
      </div>
    </div>
  </section>
</template>

<style>
.thub-section-inset {
  background-color: rgba(240, 245, 255, 0.5);
  box-shadow: 0 1px 1px color-mix(in srgb, currentColor 50%, transparent) inset;
  backdrop-filter: blur(10px);
  @apply _rounded-lg _leading-snug;
}
.thub-section-inset__inner {
  display: flex;
  justify-content: space-between;
  align-items: start;
  @apply _px-3.5 _py-2 _gap-2;
}
.thub-section-inset__inner__right {
  @apply _mt-[0.44rem];
}
.thub-section-inset__title {
  @apply _text-sm _italic _opacity-40;
}
</style>
