<template>
  <section class="thub-section-inset">
    <div class="thub-section-inset__inner">
      <div>
        <slot name="title" />
        <p class="_text-em-sm _italic _opacity-40">
          <slot name="description" />
        </p>
      </div>
      <div class="thub-section-inset__inner__right">
        <slot name="right" />
      </div>
    </div>
  </section>
</template>

<style>
.thub-section-inset {
  background-color: rgba(240, 245, 255, 0.5);
  box-shadow: 0 1px 1px color-mix(in srgb, currentColor 50%, transparent) inset;
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
