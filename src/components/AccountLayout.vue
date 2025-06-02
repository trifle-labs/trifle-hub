<template>
  <div
    class="_p-4 _w-full _flex _flex-col _gap-6 _items-center _overflow-y-scroll-masked _no-scrollbar"
  >
    <header class="_mt-8 _w-full _text-center">
      <div class="_size-24 _rounded-full _mx-auto">
        <slot name="avatar" />
      </div>
      <div class="_mt-5 _space-y-3 _w-full">
        <h2 class="_text-5xl _tracking-wide _w-full _text-center _min-w-0">
          <slot name="title" />
        </h2>
        <slot name="description" />
      </div>
    </header>

    <section class="_w-full _flex-1 _flex _flex-col _gap-4 _items-center">
      <slot />
    </section>
  </div>
</template>

<script setup></script>

<style></style>
