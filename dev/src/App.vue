<template>
  <div class="_w-full">
    <TrifleHub position="top-right" :avatar3d="false">
      <router-view />
      <TrifleGuide class="_mx-auto _text-base _overflow-hidden" />
    </TrifleHub>
  </div>
</template>

<script setup></script>
