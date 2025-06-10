<template>
  <li
    class="_flex _justify-between _items-center _p-3 _rounded-lg _bg-metallic-linear _shadow-panel"
  >
    <div class="_flex _items-center _gap-3">
      <img
        v-if="pointConfig && pointConfig.icon"
        :src="pointConfig.icon"
        class="_size-7 _rounded"
      />
      <div>
        <div class="_font-semibold">{{ pointConfig?.name || point.name }}</div>
        <div class="_text-xs _text-gray-500">{{ formatDate(point.createdAt) }}</div>
        <div v-if="point.name === 'gm-react' && point.giver">
          <span class="_font-bold">{{ point.giver }}</span> liked:<br />
          <span v-if="point.gmMessage">"{{ point.gmMessage }}"</span>
        </div>
        <div v-else-if="point.name === 'gm'">
          {{ point.extra }}
        </div>
        <div
          v-else-if="pointConfig?.description"
          class="_text-xs _text-gray-400"
          v-html="pointConfig.description"
        ></div>
      </div>
    </div>
    <div class="_text-lg _weight-bold _flex _items-center _gap-1">
      <span>{{ formatPoints(point.value) }}</span> 🪩
    </div>
  </li>
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
  return new Date(date).toLocaleString()
}
const formatPoints = (points) => {
  points = Number(points)
  if (points % 1 === 0) {
    return points
  }
  return points.toFixed(2)
}
</script>

<style scoped></style>
