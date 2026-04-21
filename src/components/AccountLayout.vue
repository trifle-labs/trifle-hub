<template>
  <div
    class="_p-5 _w-full _flex _flex-col _gap-5 _items-center _overflow-y-scroll-masked _no-scrollbar _relative"
  >
    <!-- Admin controls slot (top left) -->
    <div class="_absolute _top-4 _left-4 _z-10">
      <slot name="admin-controls" />
    </div>

    <header class="_mt-6 _w-full _text-center">
      <div class="_size-24 _rounded-full _mx-auto">
        <slot name="avatar" />
      </div>
      <div class="_mt-5 _flex _flex-col _gap-3 _w-full">
        <h2 class="_text-5xl _tracking-wide _w-full _text-center _min-w-0">
          <slot name="title" />
        </h2>
        <template v-if="$slots.description">
          <slot name="description" />
        </template>
      </div>
    </header>

    <section class="_w-full _flex-1 _flex _flex-col _gap-3">
      <slot />
    </section>
  </div>
</template>

<script setup></script>

<style></style>
