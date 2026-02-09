<template>
  <div class="_flex-1 _overflow-y-scroll _px-5 _w-full _flex _flex-col">
    <HubPageHeader>
      <template #icon>
        <img src="../assets/imgs/trifle-trophy-sm.png" alt="🏆" class="_h-[1.75em]" />
      </template>
      leaderboard
    </HubPageHeader>
    <!-- category tabs -->
    <nav class="_gap-[0.45rem] _mt-4 _grid _grid-cols-2 _text-stroke-2xl _text-lg _tracking-wide">
      <button
        class="_bubble-btn _px-4.5 _h-16"
        :class="{ '_animate-wiggle-sm': selectedCategory === 'balls' }"
        @click="selectedCategory = 'balls'"
        :style="selectedCategory === 'balls' ? 'filter: hue-rotate(-345deg) saturate(2.5)' : ''"
      >
        balls 🪩
      </button>
      <button
        class="_bubble-btn _px-4.5 _h-16"
        :class="{ '_animate-wiggle-sm': selectedCategory === 'airdrop' }"
        @click="selectedCategory = 'airdrop'"
        :style="selectedCategory === 'airdrop' ? 'filter: hue-rotate(103deg) saturate(2)' : ''"
      >
        airdrop 🪂
      </button>
    </nav>
    <!-- time filter tabs (balls only) -->
    <nav v-if="selectedCategory === 'balls'" class="_gap-[0.45rem] _mt-2 _grid _grid-cols-2 _text-stroke-2xl _text-base _tracking-wide">
      <button
        class="_bubble-btn _px-4 _h-12"
        :class="{ '_animate-wiggle-sm': selectedTimeFilter === 'monthly' }"
        @click="selectedTimeFilter = 'monthly'"
        :style="selectedTimeFilter === 'monthly' ? 'filter: hue-rotate(-345deg) saturate(2.5)' : ''"
      >
        this week
      </button>
      <button
        class="_bubble-btn _px-4 _h-12"
        :class="{ '_animate-wiggle-sm': selectedTimeFilter === 'allTime' }"
        @click="selectedTimeFilter = 'allTime'"
        :style="selectedTimeFilter === 'allTime' ? 'filter: hue-rotate(103deg) saturate(2)' : ''"
      >
        all time
      </button>
    </nav>

    <!-- Loading State -->
    <div v-if="loading" class="_text-center _py-10">Loading leaderboard...</div>

    <!-- Error State -->
    <div v-else-if="error" class="_p-4 _bg-red-100 _text-red-700 _rounded-lg _mt-4">
      {{ error }}
    </div>

    <div v-else class="_flex-1 _overflow-y-scroll-masked _no-scrollbar _no-scrollbar _-mx-5 _px-5">
      <!-- current user highlight (airdrop only) -->
      <div
        v-if="selectedCategory === 'airdrop' && currentUserEntry"
        @click="openProfile(currentUserEntry.username)"
        class="_flex _items-center _text-left _gap-2.5 _p-3 _rounded-lg _shadow-panel _text-lg _text-stroke-3xl _max-w-full _min-w-0 _cursor-pointer mouse:hover:_scale-[1.01] _duration-150 _mb-3"
        style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
        aria-label="Your Position"
      >
        <div class="_min-w-[1.4em] _text-center _text-em-xs _flex-shrink-0 _weight-black">
          #{{ currentUserEntry.rank }}
        </div>
        <div class="_flex _items-center _gap-2.5 _flex-1 _min-w-0">
          <div
            v-if="currentUserEntry.avatar"
            class="_size-[2em] _-my-0.5 _flex-shrink-0 _rounded-full _bg-zinc-400 _bg-cover _bg-center"
            :style="{ backgroundImage: `url(${currentUserEntry.avatar})` }"
            style="box-shadow: inset 0 1px 2px rgba(0,0,0,0.75), inset 0 -1px 2px rgba(255,255,255,0.75)"
          ></div>
          <div
            v-else
            class="_size-[2em] _-my-0.5 _flex-shrink-0 _rounded-full _bg-cover _bg-center _opacity-40"
            tabindex="-1"
            :style="{ backgroundImage: `url(${smileyFacePng})`, mixBlendMode: 'multiply' }"
          ></div>
          <div class="_flex-1 _weight-semibold _truncate _min-w-0">
            {{ currentUserEntry.username || 'N/A' }} <span class="_opacity-50 _text-sm">(you)</span>
          </div>
        </div>
        <div class="_weight-black _whitespace-nowrap _flex _gap-[0.15em]">
          <div>{{ currentUserEntry.totalBalls?.toLocaleString('en-us') ?? '0' }}</div>
          <div>🪂</div>
        </div>
      </div>
      <!-- leaderboard list -->
      <ol class="_space-y-2">
        <!-- rows... -->
        <li
          v-for="(entry, index) in leaderboardData"
          :key="entry.UserId || entry.id || index"
          @click="openProfile(entry.User?.username || entry.username)"
          class="_flex _items-center _text-left _gap-2.5 _p-3 _rounded-lg _bg-metallic-linear _shadow-panel _text-lg _text-stroke-3xl _max-w-full _min-w-0 _cursor-pointer mouse:hover:_scale-[1.01] _duration-150 _cursor-pointer"
          aria-label="View Profile"
        >
          <div class="_min-w-[1.4em] _text-center _text-em-xs _opacity-25 _flex-shrink-0">
            {{ index + 1 }}
          </div>
          <div class="_flex _items-center _gap-2.5 _flex-1 _min-w-0">
            <div
              v-if="entry.avatar"
              class="_size-[2em] _-my-0.5 _flex-shrink-0 _rounded-full _bg-zinc-400 _bg-cover _bg-center"
              :style="{
                backgroundImage: `url(${entry.avatar})`
              }"
              style="
                box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.75),
                  inset 0 -1px 2px rgba(255, 255, 255, 0.75);
              "
            >
              <!-- Placeholder for avatar, can be replaced with entry.User.avatarUrl if available -->
            </div>
            <!-- (blank face) -->
            <div
              v-else
              alt="smiley face with dashed outline"
              class="_size-[2em] _-my-0.5 _flex-shrink-0 _rounded-full _bg-cover _bg-center _scale-[0.95]ff _opacity-40"
              tabindex="-1"
              :style="{
                backgroundImage: `url(${smileyFacePng})`,
                mixBlendMode: 'multiply'
              }"
            ></div>
            <div class="_flex-1 _weight-semibold _truncate _min-w-0">
              {{ entry.User?.displayName || entry.username || 'N/A' }}
            </div>
          </div>
          <div class="_weight-black _whitespace-nowrap _flex _gap-[0.15em]">
            <div>
              {{ entry.totalBalls?.toLocaleString('en-us') ?? '0' }}
            </div>
            <div>{{ selectedCategory === 'airdrop' ? '🪂' : '🪩' }}</div>
          </div>
        </li>
        <div v-if="!leaderboardData.length && !loading" class="_text-center _py-10 _text-gray-500">
          No data available for this period.
        </div>
      </ol>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, inject } from 'vue'
import { storeToRefs } from 'pinia'
import HubPageHeader from '../components/HubPageHeader.vue'
import smileyFacePng from '../assets/imgs/smiley-face-dashed-inside-noShadow.png'

const selectedCategory = ref('balls') // 'balls' or 'airdrop'
const selectedTimeFilter = ref('monthly') // 'monthly' for This Week, 'allTime' for All Time
const leaderboardData = ref([])
const currentUserEntry = ref(null)
const loading = ref(false)
const error = ref(null)

const auth = inject('TrifleHub/store')
const { backendUrl } = storeToRefs(auth)
const hub = inject('hub')

const openProfile = (username) => {
  auth.setProfileUsername(username)
  hub.openHub('profile')
}

const fetchLeaderboardData = async () => {
  loading.value = true
  error.value = null
  leaderboardData.value = [] // Clear previous data
  currentUserEntry.value = null

  try {
    if (!backendUrl.value) {
      throw new Error('Backend URL is not configured.')
    }

    let url
    if (selectedCategory.value === 'airdrop') {
      const params = new URLSearchParams({
        sortBy: 'count',
        sortDir: 'desc',
        limit: '25'
      })
      if (auth.user?.id) {
        params.append('userId', auth.user.id)
      }
      url = `${backendUrl.value}/balls/airdrop-points?${params.toString()}`
    } else {
      const params = new URLSearchParams({
        sortBy: 'count',
        sortDir: 'desc',
        limit: '25'
      })
      if (selectedTimeFilter.value === 'monthly') {
        params.append('duration', '7d') // 7 days for "This Week"
      }
      url = `${backendUrl.value}/balls/leaderboard?${params.toString()}`
    }

    const response = await fetch(url)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `HTTP error! status: ${response.status} - ${errorData.message || response.statusText}`
      )
    }
    const data = await response.json()
    leaderboardData.value = data.data
    if (data.currentUser) {
      currentUserEntry.value = data.currentUser
    }
  } catch (err) {
    console.error('Error fetching leaderboard:', err)
    error.value = `Failed to load leaderboard data: ${err.message}`
  } finally {
    loading.value = false
  }
}

watch(selectedCategory, fetchLeaderboardData)
watch(selectedTimeFilter, fetchLeaderboardData)

onMounted(() => {
  fetchLeaderboardData()
})
</script>

<style scoped>
/* Styles are preserved from original Leaderboard.vue */
</style>
