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
        <div v-if="isAuthenticated" class="_text-3xl _font-mono">{{ totalBalls || '???' }}</div>
        <div v-else class="_text-xl _font-mono _text-gray-600">
          <span @click="openHub('account')" class="_cursor-pointer _text-blue-600 hover:_underline"
            >Login</span
          >
          to see your balance
        </div>
      </div>

      <div v-if="!isAuthenticated" class="_p-4 _bg-blue-100 _text-blue-800 _rounded-lg">
        <p class="_flex _items-center _gap-2">
          <svg class="_w-5 _h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>
            <span @click="openHub('account')" class="_cursor-pointer _font-medium hover:_underline"
              >Log in or sign up</span
            >
            to track your progress and earn Pachinko Balls!
          </span>
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="_space-y-2">
        <div
          v-for="i in 3"
          :key="`loader-${i}`"
          class="_flex _items-center _gap-3 _p-3 _bg-zinc-200 _rounded-lg animate-pulse"
        >
          <div class="_size-8 _rounded-full _bg-zinc-400"></div>
          <div class="_flex-1 _space-y-2">
            <div class="_h-4 _bg-zinc-400 _rounded w-3/4"></div>
            <div class="_h-3 _bg-zinc-400 _rounded w-1/2"></div>
          </div>
          <div class="_h-6 _w-12 _bg-zinc-400 _rounded"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="_p-4 _bg-red-100 _text-red-700 _rounded-lg">
        {{ error }}
      </div>

      <!-- Quest List -->
      <div v-else class="_space-y-2">
        <div class="_flex _justify-center _gap-2 _mb-4">
          <button
            @click="filter = 'all'"
            class="_px-4 _py-2 _rounded-lg _transition-colors"
            :class="
              filter === 'all'
                ? '_bg-blue-600 _text-white'
                : '_bg-zinc-200 _text-black hover:_bg-zinc-300'
            "
          >
            All
          </button>

          <button
            @click="filter = 'ongoing'"
            class="_px-4 _py-2 _rounded-lg _transition-colors"
            :class="
              filter === 'ongoing'
                ? '_bg-blue-600 _text-white'
                : '_bg-zinc-200 _text-black hover:_bg-zinc-300'
            "
          >
            Ongoing
          </button>
          <button
            @click="filter = 'once'"
            class="_px-4 _py-2 _rounded-lg _transition-colors"
            :class="
              filter === 'once'
                ? '_bg-blue-600 _text-white'
                : '_bg-zinc-200 _text-black hover:_bg-zinc-300'
            "
          >
            One-time
          </button>
        </div>

        <div
          v-for="quest in filteredQuests"
          :key="quest.id"
          class="_flex _items-center _gap-3 _p-3 _rounded-lg _transition-colors"
          :class="[
            quest.enabled
              ? '_bg-zinc-200 hover:_border-blue-300'
              : '_bg-gray-100 _opacity-60 _cursor-not-allowed'
          ]"
        >
          <div class="_flex-shrink-0">
            <div
              v-if="quest.requiresLogin"
              class="_w-8 _h-8 _bg-gray-100 _text-gray-500 _rounded-full _flex _items-center _justify-center"
            >
              <svg class="_w-5 _h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
            </div>
            <div
              v-else-if="quest.completed"
              class="_w-8 _h-8 _bg-green-100 _text-green-600 _rounded-full _flex _items-center _justify-center"
            >
              <svg class="_w-5 _h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <div
              v-else-if="quest.once"
              class="_w-8 _h-8 _bg-blue-100 _text-blue-600 _rounded-full _flex _items-center _justify-center"
            >
              <svg class="_w-5 _h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div
              v-else
              class="_w-8 _h-8 _bg-yellow-100 _text-yellow-600 _rounded-full _flex _items-center _justify-center"
            >
              <svg class="_w-5 _h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                ></path>
              </svg>
            </div>
          </div>
          <div class="_flex-1">
            <div class="_font-medium">
              <a
                v-if="quest.link && typeof quest.link === 'string' && quest.enabled"
                :href="quest.link"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:_underline _text-blue-600"
              >
                {{ quest.name }}
              </a>
              <span
                v-else-if="
                  quest.link && typeof quest.link === 'object' && quest.link.to && quest.enabled
                "
                @click="openHub(quest.link.to)"
                class="hover:_underline _text-blue-600 _cursor-pointer"
              >
                {{ quest.name }}
              </span>
              <span v-else>
                {{ quest.name }}
              </span>
            </div>
            <p class="_text-sm _text-gray-600 _mt-1">{{ quest.description }}</p>
            <div v-if="quest.progress" class="_mt-2">
              <div class="_bg-zinc-300 _rounded-full _h-2">
                <div
                  class="_bg-blue-600 _rounded-full _h-2"
                  :style="{ width: `${quest.progress}%` }"
                ></div>
              </div>
            </div>
          </div>
          <div class="_font-mono _text-sm">
            <span v-if="typeof quest.pachinkoBalls === 'string'">
              {{ quest.pachinkoBalls }}
            </span>
            <span v-else> +{{ quest.pachinkoBalls }} </span>
            balls
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import HubPageHeader from '../../components/HubPageHeader.vue'
import { storeToRefs } from 'pinia'
import { ref, onMounted, inject, watch, computed } from 'vue'
import { possiblePoints } from '../../config/pointsConfig'

const auth = inject('TrifleHub/store')
const { openHub } = inject('hub')
const quests = ref([])
const loading = ref(true)
const error = ref(null)
const totalBalls = ref(0)
const filter = ref('all') // 'all', 'once', 'ongoing'

const { backendUrl, isAuthenticated } = storeToRefs(auth)
console.log({ backendUrl })

// Compute filtered quests based on the selected filter
const filteredQuests = computed(() => {
  let questsToDisplay = []
  if (filter.value === 'all') {
    questsToDisplay = quests.value
  } else if (filter.value === 'once') {
    questsToDisplay = quests.value.filter((quest) => quest.once)
  } else if (filter.value === 'ongoing') {
    questsToDisplay = quests.value.filter((quest) => !quest.once)
  } else {
    questsToDisplay = quests.value
  }

  return questsToDisplay.slice().sort((a, b) => {
    // Sort by enabled status first (enabled quests on top)
    if (a.enabled && !b.enabled) return -1
    if (!a.enabled && b.enabled) return 1

    // If both have the same enabled status (i.e., both are enabled, as disabled ones are handled above)
    // or if both are disabled (their order amongst themselves doesn't matter by completion)
    // then, sort by completion status (uncompleted quests on top)
    if (a.enabled && b.enabled) {
      // This condition ensures we only sort by completion for enabled quests
      if (!a.completed && b.completed) return -1
      if (a.completed && !b.completed) return 1
    }

    return 0 // Keep original order if all criteria are the same
  })
})

const fetchUserPoints = async () => {
  loading.value = true
  error.value = null

  try {
    if (isAuthenticated.value) {
      // Fetch all points for the user
      const response = await fetch(`${backendUrl.value}/balls/index`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      totalBalls.value = data.balls.total

      // Process quests and mark them as completed based on points data
      quests.value = possiblePoints.map((quest) => {
        const questPoints = data.balls.data.filter((point) => point.name === quest.id)
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
          progress,
          requiresLogin: false,
          enabled: quest.enabled !== undefined ? quest.enabled : true,
          link: quest.link || null
        }
      })
    } else {
      // User is not authenticated, show generic quests
      totalBalls.value = 0
      quests.value = possiblePoints.map((quest) => {
        return {
          ...quest,
          completed: false,
          progress: null,
          requiresLogin: true,
          enabled: quest.enabled !== undefined ? quest.enabled : true,
          link: quest.link || null
        }
      })
    }
  } catch (err) {
    console.error('Error fetching quest data:', err)
    error.value = 'Failed to load quest data. Please try again later.'
  } finally {
    loading.value = false
  }
}

// Refresh data when authentication state changes
watch(isAuthenticated, () => {
  fetchUserPoints()
})

onMounted(() => {
  fetchUserPoints()
})
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
