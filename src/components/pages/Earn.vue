<template>
  <div class="_flex-1 _overflow-y-scroll-masked _no-scrollbar _px-5 _w-full _flex _flex-col">
    <header class="_-mt-3.5 _space-y-3.5">
      <HubPageHeader>
        <template #icon>
          <img src="../../assets/imgs/disco-ball-on-graph.png" alt="📈🪩" class="_h-[1.75em]" />
        </template>
        earn
      </HubPageHeader>
      <template v-if="!isAuthenticated">
        <section
          class="_mt-4 _px-3.5 _py-3 _flex _flex-col _gap-3 _rounded-lg _overflow-hidden _shadow-panel _bg-metalic-cone"
        >
          <div class="_relative _flex _flex-col _gap-2.5">
            <div>
              <p class="_bodytext">
                Pachinko Balls 🪩 are Trifle's point system—you might already have some!
              </p>
            </div>
            <div class="_flex _justify-between _items-center">
              <p class="_italic _text-[#888] _text-em-sm _animate-blink">Login to claim &rarr;</p>
              <button
                class="_bubble-btn _px-6 _py-2"
                style="filter: hue-rotate(-340deg) saturate(1.8)"
                @click="openHub('account')"
              >
                <span style="filter: hue-rotate(340deg) saturate(0.5)">Login</span>
              </button>
            </div>
          </div>
        </section>
      </template>
      <template v-if="isAuthenticated">
        <section
          class="_px-3 _py-3.5 _bg-metalic-cone _rounded-lg _shadow-panel _flex _justify-between _items-start _flex-wrap _gap-2 _leading-none"
        >
          <div class="_flex _items-center _gap-[0.5em] _text-base">
            <!-- <div class="_size-[1.5em] _bg-zinc-400 _rounded-full"></div> -->
            <div class="_opacity-30">Your Balance</div>
          </div>
          <div class="_text-3xl _font-bold">{{ totalBalls || '???' }} 🪩</div>
        </section>
      </template>
    </header>
    <nav class="_flex _justify-between _items-center _mt-5 _mb-2">
      <h3 class="_h5 _weight-bold _flex _items-center _gap-[0.1em] _leading-none">
        <span class="_text-[1.1em]"> 🛡️ </span>
        <span class="_opacity-30">Quests</span>
      </h3>
      <!-- TODO: filter dropdown -->
      <!-- <button
          v-if="isAuthenticated"
          class="_bubble-btn _px-5 _py-2 _text-em-xs"
          style="filter: hue-rotate(-340deg) saturate(1.8)"
        >
          <span style="filter: hue-rotate(340deg) saturate(0.5)">all ⌄</span>
        </button> -->
    </nav>
    <div class="_space-y-4">
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
      <div v-else class="_space-y-2.5">
        <!-- <div class="_flex _justify-center _gap-2 _mb-4">
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
          </div> -->

        <!-- quests... -->
        <component
          :is="quest.link ? (typeof quest.link === 'string' ? 'a' : 'button') : 'div'"
          v-for="quest in filteredQuests"
          :key="quest.id"
          :href="typeof quest.link === 'string' ? quest.link : undefined"
          :target="typeof quest.link === 'string' ? '_blank' : undefined"
          :rel="typeof quest.link === 'string' ? 'noopener noreferrer' : undefined"
          @click="quest.link?.to && openHub(quest.link.to)"
          class="_w-full _block _relative"
          :class="{ '_pointer-events-none': quest.completed && quest.link?.to }"
        >
          <!-- main body, faded if completed -->
          <div
            class="_bg-metalic-linear _w-full _flex _flex-col _gap-0.5 _p-2 _rounded-lg _transition-colors _text-mlg _relative"
            :class="[
              {
                'mouse:hover:_scale-[1.006] _duration-100': quest.link,
                '_opacity-50': quest.completed,
                '_shadow-panel': !quest.completed
              }
            ]"
          >
            <header class="_flex _w-full _gap-2.5">
              <!-- icon -->
              <div class="_size-[1.7em]">
                <img :src="quest.icon" class="_w-full _h-full _rounded-lg _block" />
              </div>
              <div class="_flex-1">
                <!-- title -->
                <div
                  class="_min-h-[1.7em] _flex _items-center _justify-start _text-left _py-[0.06em] _weight-bold _leading-snug"
                  :class="{ '_line-through': quest.completed }"
                >
                  {{ quest.name }}
                </div>
              </div>
              <!-- right group -->
              <div class="_flex _items-center _h-[1.7em] _gap-0.5 _relative _text-em-sm">
                <div
                  v-if="!quest.enabled"
                  class="_rounded-full _bg-metalic-cone _shadow-panel _px-[0.5em]"
                >
                  soon
                </div>
                <div
                  v-else
                  class="_rounded-full _bg-metalic-cone _shadow-panel _pr-[0.5em] _pl-[0.25em] _flex _gap-[0.1em]"
                >
                  <div>🪩</div>
                  <span v-if="typeof quest.pachinkoBalls === 'string'">
                    {{ quest.pachinkoBalls }}
                  </span>
                  <span v-else>{{ quest.pachinkoBalls }} </span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="black"
                  class="_size-6 _opacity-40"
                  :class="{ '_invisible _ml-4.5': quest.completed }"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </header>
            <!-- (description) -->
            <div v-if="quest.description" class="_flex _items-start _gap-3 _pr-3">
              <div class="_w-[1.7em] _flex-shrink-0"></div>
              <p class="_flex-1 _text-sm _text-gray-600 _text-left" v-html="quest.description"></p>
            </div>
            <!-- (progress) -->
            <!-- <div v-if="quest.progress" class="_mt-2">
                <div class="_bg-zinc-300 _rounded-full _h-2">
                  <div
                    class="_bg-blue-600 _rounded-full _h-2"
                    :style="{ width: `${quest.progress}%` }"
                  ></div>
                </div>
              </div> -->
          </div>
          <div
            v-if="quest.completed"
            class="_absolute _top-0 _right-2 _h-full _flex _items-center _justify-center"
          >
            <img src="../../assets/imgs/checkmark-icon-glass.png" class="_size-[2.5em]" />
          </div>
        </component>
      </div>
    </div>
  </div>
</template>

<script setup>
import HubPageHeader from '../../components/HubPageHeader.vue'
import { storeToRefs } from 'pinia'
import { ref, onMounted, inject, watch, computed } from 'vue'
import { possiblePoints } from '../../config/pointsConfig'
import HubSection from '../HubSection.vue'

const auth = inject('TrifleHub/store')
const { openHub } = inject('hub')
const quests = ref([])
const loading = ref(true)
const error = ref(null)
const totalBalls = ref(0)
const filter = ref('all') // 'all', 'once', 'ongoing'

const { backendUrl, isAuthenticated } = storeToRefs(auth)

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
