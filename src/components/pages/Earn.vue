<template>
  <div class="_flex-1 _overflow-y-scroll _px-5 _w-full _flex _flex-col">
    <HubPageHeader>
      <template #icon>
        <img src="../../assets/imgs/disco-ball-on-graph.png" alt="📈🪩" class="_h-[1.75em]" />
      </template>
      earn
    </HubPageHeader>
    <div class="_space-y-4 _mt-4">
      <div class="_p-4 _bg-zinc-200 _rounded-lg">
        <div class="_text-lg _font-semibold">Current Balance</div>
        <div class="_text-3xl _font-mono">1,234</div>
      </div>
      <div class="_space-y-2">
        <div
          v-for="i in 3"
          :key="i"
          class="_flex _items-center _gap-3 _p-3 _bg-zinc-200 _rounded-lg"
        >
          <div class="_size-8 _rounded-full _bg-zinc-400"></div>
          <div class="_flex-1">
            <div class="_font-medium">Earn Method {{ i }}</div>
            <div class="_text-sm _text-gray-600">Complete tasks to earn rewards</div>
          </div>
          <div class="_font-mono">+100</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import HubPageHeader from '../../components/HubPageHeader.vue'

import { ref, onMounted } from 'vue'
import { possiblePoints } from '../../config/pointsConfig'

const quests = ref([])
const loading = ref(true)
const error = ref(null)

const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const fetchUserPoints = async () => {
  try {
    // Fetch all points for the user
    const response = await fetch(`${backendUrl}/balls/list`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()

    // Process quests and mark them as completed based on points data
    quests.value = possiblePoints.map((quest) => {
      const questPoints = data.data.filter((point) => point.name === quest.id)
      const completed = questPoints.length > 0

      // For repeatable quests, show progress
      let progress = null
      if (!quest.once && completed) {
        if (quest.id === 'gm') {
          // For GM game, show today's progress
          const today = new Date().toDateString()
          const todaysPoints = questPoints.filter(
            (p) => new Date(p.createdAt).toDateString() === today
          )
          progress = Math.min((todaysPoints.length / 10) * 100, 100) // Assume max 10 GMs per day
        } else if (quest.id === 'burn-kudzu') {
          // For kudzu burns, show progress towards next milestone
          progress = Math.min((questPoints.length % 10) * 10, 100) // Show progress to next 10 burns
        }
      }

      return {
        ...quest,
        completed,
        progress
      }
    })
  } catch (err) {
    console.error('Error fetching quest data:', err)
    error.value = 'Failed to load quest data. Please try again later.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUserPoints()
})
</script>
