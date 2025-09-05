<template>
  <!-- TODO: @billy these links dont' work? -->
  <a
    v-for="social in [
      platforms.twitter,
      platforms.discord,
      platforms.farcaster,
      platforms.telegram
    ]"
    :key="social.label"
    :href="social.url"
    target="_blank"
    :fid="social.fid"
    class="_bubble-btn-full _px-4.5 _cursor-pointer"
    :style="{
      filter: `hue-rotate(${social.bubbleButtonStyle.hueRotate}deg) saturate(${
        social.bubbleButtonStyle.saturate
      }) brightness(${social.bubbleButtonStyle.brightness || 1})`
    }"
  >
    <div
      class="_flex _justify-start _items-center _gap-2.5 _h-16"
      :style="{
        filter: `hue-rotate(${social.bubbleButtonStyle.hueRotate * -1}deg) saturate(${
          1 / social.bubbleButtonStyle.saturate
        })`
      }"
    >
      <div class="_size-8 _rounded-lg _overflow-hidden">
        <img :src="social.icon" class="_w-full" />
      </div>
      <div
        class="_flex-1 _min-w-0 _truncate _text-center _text-stroke-md _leading-snug _pr-[0.55em]"
      >
        {{ social.name }}
      </div>
    </div>
  </a>
</template>

<script setup>
import { platforms } from '../config/socialsConfig'
</script>
