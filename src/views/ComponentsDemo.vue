<template>
  <section class="_flex _flex-col _gap-1">
    <div class="_h3">Buttons</div>
    <button class="_bubble-btn _p-4.5">._bubble-btn</button>
    <button class="_bubble-btn _p-4.5 _text-em-sm" style="filter: hue-rotate(103deg) saturate(2)">
      style="filter: hue-rotate(103deg) saturate(2)"
    </button>
  </section>

  <div class="_h3">Sections</div>
  <HubSection>
    <template #title>
      <span>.thub-section-inset</span>
    </template>
    <template #description> makes inset with blur bg </template>
    <template #right>
      <button
        class="_bubble-btn _h-10 _pl-6 _pr-5"
        style="filter: hue-rotate(-340deg) saturate(1.8)"
      >
        <span style="filter: hue-rotate(340deg) saturate(0.5)">Action</span>
      </button>
    </template>
  </HubSection>
</template>

<script setup>
import HubSection from '../components/HubSection.vue'
</script>

<style></style>
