<template>
  <div
    class="_p-4 _w-full _flex _flex-col _gap-8 _items-center _overflow-y-scroll-masked _no-scrollbar"
  >
    <header class="_mt-8 _space-y-3">
      <div class="_size-24 _rounded-full _mx-auto">
        <slot name="avatar" />
      </div>
      <h2
        class="_text-5xl _tracking-wide _w-full _text-center _truncate _min-w-0 _leading-tight _weight-black"
      >
        <slot name="title" />
      </h2>
      <slot name="description" />
    </header>

    <section class="_w-full _flex-1 _flex _flex-col _gap-4 _items-center">
      <slot />
    </section>
  </div>
</template>

<script setup></script>

<style></style>
