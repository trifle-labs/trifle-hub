<template>
  <component
    :is="sourceURL ? 'a' : 'div'"
    v-bind="sourceURL ? { href: sourceURL.origin, target: '_blank' } : {}"
    class="_bg-metallic-linear _shadow-panel _w-full _p-2 _pr-3 _rounded-lg _block _flex _items-center _min-h-14"
    :class="{ 'mouse:hover:_scale-[1.01] _origin-center _duration-150 _group': sourceURL }"
  >
    <header class="_flex _w-full _gap-2.5 _items-center">
      <!-- date -->
      <div
        class="_-mr-0.5 _text-xs _opacity-[0.35] _min-w-8 _min-h-8 _flex _items-center _justify-center"
      >
        {{ formatDate(point.createdAt) }}
      </div>
      <div class="_size-8 _flex-shrink-0">
        <img
          v-if="pointConfig && pointConfig.icon"
          :src="pointConfig.icon"
          class="_w-full _h-full _rounded-lg _block"
        />
      </div>
      <!-- title -->
      <div
        class="_flex-1 _flex _flex-col _gap-0.5 _justify-center _min-h-8 _text-left _leading-normal _min-w-0"
      >
        <div class="_mr-3 _min-w-0 _truncate">
          <template v-if="point.name === 'anybody-daily'"
            >Solved {{ anybodyDayFromDate(point.createdAt) }}</template
          >
          <template v-else-if="point.name === 'gm'">"{{ point.extra }}"</template>
          <template v-else-if="point.name === 'gm-react'">
            {{ !point.giver || point.giver === '???' ? 'someone' : '@' + point.giver }}
            ♥︎
            <span v-if="point.gmMessage" class="_weight-semiboldff">"{{ point.gmMessage }}"</span>
            <template v-else>your gm</template>
          </template>
          <template v-else>{{ pointConfig?.name || point.name }}</template>
          <!-- date -->
        </div>
        <div v-if="sourceURL" class="_text-em-2xs _opacity-[0.3] _leading-none">
          <a :href="sourceURL.origin" target="_blank" class="mouse:group-hover:_underline">{{
            sourceURL.host
          }}</a>
        </div>
      </div>
      <!-- right group -->
      <div
        class="_flex _items-center _flex-row-reverse _h-[1.7em] _gap-[0.5em] _relative _text-em-sm _flex-shrink-0 sm:_text-mlg"
      >
        <!-- points -->
        <div
          class="_rounded-full _bg-metallic-linear _shadow-panel _pr-[0.5em] _pl-[0.25em] _flex _gap-[0.15em]"
        >
          <div>🪩</div>
          <span>{{ formatPoints(point.value) }}</span>
        </div>
      </div>
    </header>
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { possiblePoints } from '../config/pointsConfig'

const props = defineProps({ point: Object })

const pointConfig = computed(() =>
  possiblePoints.find((p) => p.name === props.point.name || p.id === props.point.name)
)

const formatDate = (date) => {
  if (!date) return ''

  const now = new Date()
  const then = new Date(date)
  const diffMs = now - then
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffMins < 60) return `${diffMins}m`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}d`
  if (diffWeeks < 4) return `${diffWeeks}wk`
  if (diffMonths < 12) return `${diffMonths}mo`
  return `${diffYears}y`
}

const formatPoints = (points) => {
  points = Number(points)
  if (points % 1 === 0) {
    return points
  }
  return points.toFixed(2)
}

const anybodyDayFromDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase()
  const day = d.toLocaleString('en-US', { day: '2-digit' })
  return `${month} ${day}`
}

const sourceURL = computed(() => {
  let url
  try {
    url = new URL(pointConfig.value?.link)
    if (['farcaster', 'discord'].includes(url.host.split('.')[0])) {
      url = { host: 'trifle', origin: url.href }
    }
  } catch {
    // ignore
  }
  return url
})
</script>

<style scoped></style>
