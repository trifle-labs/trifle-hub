<template>
  <div class="_flex-1 _overflow-y-scroll _px-5 _w-full _flex _flex-col">
    <HubPageHeader>
      <template #icon>
        <img src="../../assets/imgs/trifle-trophy-sm.png" alt="🏆" class="_h-[1.75em]" />
      </template>
      leaderboard
    </HubPageHeader>
    <!-- tabs -->
    <nav class="_gap-[0.45rem] _mt-4 _grid _grid-cols-2 _text-stroke-md _tracking-wide">
      <button
        class="_bubble-btn _p-4.5"
        @click="selectedTab = 'monthly'"
        :style="selectedTab === 'monthly' ? 'filter: hue-rotate(-345deg) saturate(2.5)' : ''"
      >
        This Week
      </button>
      <button
        class="_bubble-btn _p-4.5"
        @click="selectedTab = 'allTime'"
        :style="selectedTab === 'allTime' ? 'filter: hue-rotate(103deg) saturate(2)' : ''"
      >
        All Time
      </button>
    </nav>

    <!-- Loading State -->
    <div v-if="loading" class="_text-center _py-10">Loading leaderboard...</div>

    <!-- Error State -->
    <div v-else-if="error" class="_p-4 _bg-red-100 _text-red-700 _rounded-lg _mt-4">
      {{ error }}
    </div>

    <div v-else class="_flex-1 _overflow-y-scroll-masked _no-scrollbar _no-scrollbar _-mx-5 _px-5">
      <!-- leaderboard list -->
      <div class="_space-y-2">
        <!-- rows... -->
        <div
          v-for="(entry, index) in leaderboardData"
          :key="entry.UserId || index"
          class="_flex _items-center _gap-2.5 _p-3 _rounded-lg _bg-metallic-linear _shadow-panel _text-mlg _max-w-full _min-w-0"
        >
          <div class="_min-w-4 _text-right _text-em-xs _opacity-25 _flex-shrink-0">
            {{ index + 1 }}
          </div>
          <div class="_flex _items-center _gap-2.5 _flex-1 _min-w-0">
            <div class="_size-[1.625em] _flex-shrink-0 _rounded-full _bg-zinc-400">
              <!-- Placeholder for avatar, can be replaced with entry.User.avatarUrl if available -->
            </div>
            <div class="_flex-1 _weight-semibold _truncate _min-w-0">
              {{ entry.User?.displayName || entry.username || 'N/A' }}
            </div>
          </div>
          <div class="_weight-black _whitespace-nowrap _flex _gap-[0.15em]">
            <div>
              {{ entry.totalBalls.toLocaleString('en-us') }}
            </div>
            <div>🪩</div>
          </div>
        </div>
        <div v-if="!leaderboardData.length && !loading" class="_text-center _py-10 _text-gray-500">
          No data available for this period.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, inject } from 'vue'
import { storeToRefs } from 'pinia'
import HubPageHeader from '../../components/HubPageHeader.vue'

const selectedTab = ref('monthly') // 'monthly' for This Week, 'allTime' for All Time
const leaderboardData = ref([])
const loading = ref(false)
const error = ref(null)

const auth = inject('TrifleHub/store')
const { backendUrl } = storeToRefs(auth)

const fetchLeaderboardData = async () => {
  loading.value = true
  error.value = null
  leaderboardData.value = [] // Clear previous data

  const params = new URLSearchParams({
    sortBy: 'count', // Assuming 'totalBalls' is the field to sort by
    sortDir: 'desc',
    limit: '25' // Fetch top 25 users
  })

  if (selectedTab.value === 'monthly') {
    params.append('duration', '7d') // 7 days for "This Week"
  }
  // For 'allTime', no duration or startDate is needed

  try {
    if (!backendUrl.value) {
      throw new Error('Backend URL is not configured.')
    }
    const response = await fetch(`${backendUrl.value}/balls/leaderboard?${params.toString()}`)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `HTTP error! status: ${response.status} - ${errorData.message || response.statusText}`
      )
    }
    const data = await response.json()
    // The API returns data in { data: [], total: number, ... }
    // Each item in data.data might be like { UserId: X, totalBalls: Y, User: { id: X, displayName: 'Z' } }
    // Or it might be flatter like { username: 'Z', totalBalls: Y }
    leaderboardData.value = data.data
  } catch (err) {
    console.error('Error fetching leaderboard:', err)
    error.value = `Failed to load leaderboard data: ${err.message}`
  } finally {
    loading.value = false
  }
}

watch(selectedTab, fetchLeaderboardData)

onMounted(() => {
  fetchLeaderboardData()
})
</script>

<style scoped>
/* Styles are preserved from original Leaderboard.vue */
</style>
