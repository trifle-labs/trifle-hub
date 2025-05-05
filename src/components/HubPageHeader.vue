<template>
  <header
    class="mt-4 flex items-end gap-[0.35em] text-3xl sm:text-4xl leading-none pl-1.5 h-[1.66em] sm:h-[1.9em]"
  >
    <slot name="icon"></slot>
    <h2 class="-mb-[0.5%]ff text-[1.08em]"><slot></slot></h2>
  </header>
</template>
