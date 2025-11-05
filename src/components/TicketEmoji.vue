<template>
  <img
    :src="TiltLottoHead"
    class="inline-block h-[1.1em]"
    :class="{ '_animate-wiggle': animate }"
  />
</template>

<script setup>
import TiltLottoHead from '../assets/imgs/tilt-lotto-head-3.png'
const props = defineProps({
  animate: {
    type: Boolean,
    default: true
  }
})
</script>
