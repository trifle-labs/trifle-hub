<template>
  <a
    v-if="tweet"
    :href="tweet.url"
    target="_blank"
    rel="noopener noreferrer"
    class="_flex _items-start _gap-2.5 _p-[0.625em] _rounded-lg _bg-metallic-linear _shadow-panel _no-underline"
  >
    <div
      class="_size-[2.65em] _rounded-md _overflow-hidden _flex _items-center _justify-center _bg-black/80"
    >
      <img
        v-if="thumbnailUrl"
        :src="thumbnailUrl"
        alt="Tweet media"
        class="_w-full _h-full _object-cover"
      />
      <span v-else class="_text-xs _tracking-wide _text-white/80">𝕏</span>
    </div>
    <div class="_flex-1 _min-w-0">
      <p class="_leading-snug _line-clamp-2 _whitespace-pre-line _text-zinc-500">
        {{ tweet.text }}
      </p>
      <!-- <p class="_mt-1 _text-em-xs _text-zinc-500">View on X</p> -->
    </div>
  </a>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tweet: {
    type: Object,
    default: null
  }
})

const thumbnailUrl = computed(() => {
  if (!props.tweet || !props.tweet.media) return null
  const media = props.tweet.media
  if (!Array.isArray(media) || media.length === 0) return null
  const image = media.find((m) => m.type === 'photo') || media[0]
  return image?.url || null
})
</script>
