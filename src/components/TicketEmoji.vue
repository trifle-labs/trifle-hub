<template>
  <img
    :src="TiltLottoHead"
    class="_inline-block _h-[1.1em]"
    :class="{ '_animate-wiggle': props.animate }"
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
