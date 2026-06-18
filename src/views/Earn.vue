<template>
  <div class="_flex-1 _overflow-y-scroll-masked _no-scrollbar _px-5 _w-full _flex _flex-col">
    <header class="_-mt-3.5 _space-y-3.5">
      <HubPageHeader>
        <template #icon>
          <img src="../assets/imgs/disco-ball-on-graph.png" alt="📈🪩" class="_h-[1.75em]" />
        </template>
        BALL$
      </HubPageHeader>
      <template v-if="!isAuthenticated">
        <section
          class="_mt-4 _px-3.5 _py-3 _flex _flex-col _gap-3 _rounded-lg _overflow-hidden _shadow-panel _bg-metallic-cone"
        >
          <div class="_relative _flex _flex-col _gap-2.5">
            <div>
              <p class="_text-mlg">You might have 🪩BALL$ to claim!</p>
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
          class="_px-3 _py-3 _bg-metallic-cone _rounded-lg _shadow-panel _flex _justify-between _items-center _flex-wrap _gap-2 _leading-none _text-3xl _cursor-pointer _whitespace-nowrap"
          @click="openProfile"
        >
          <div class="_flex _items-center _min-w-0 _flex-1">
            <div
              v-if="auth.user?.avatar"
              class="_size-[1.125em] _block _rounded-full _shadow-panel-inset _bg-cover _bg-center"
              :style="{ backgroundImage: `url(${auth.user?.avatar})` }"
            />
            <div class="_opacity-30 _text-mlg _text-stroke-lg _ml-[0.37em] _min-w-0 _truncate">
              Your Balance
            </div>
          </div>
          <div class="_text-right _min-w-0 _truncate _text-stroke-3xl">
            {{ totalBalls?.toLocaleString() || '???' }}
          </div>
          <div class="_flex-shrink-0">🪩</div>
        </section>
      </template>
    </header>
    <nav
      class="_gap-[0.45rem] _mt-6 _grid _grid-cols-2 _text-stroke-2xl _text-xl _tracking-wide _mb-3"
    >
      <button
        class="_bubble-btn _px-4.5 _h-16"
        :class="{ '_animate-wiggle-sm': selectedTab === 'earn' }"
        @click="selectedTab = 'earn'"
        :style="selectedTab === 'earn' ? 'filter: hue-rotate(-70deg) saturate(1.6)' : ''"
      >
        earn
      </button>
      <button
        class="_bubble-btn _px-4.5 _h-16"
        :class="{ '_animate-wiggle-sm': selectedTab === 'spend' }"
        @click="selectedTab = 'spend'"
        :style="selectedTab === 'spend' ? 'filter: hue-rotate(-345deg) saturate(2.5)' : ''"
      >
        spend
      </button>
    </nav>

    <transition-group name="thub-page-group">
      <!-- (earn) -->
      <div class="_space-y-4" v-if="selectedTab === 'earn'">
        <!-- Loading State -->
        <div v-if="loading" class="_space-y-2">
          <div
            v-for="i in 3"
            :key="`loader-${i}`"
            class="_flex _items-center _gap-3 _p-3 _bg-metallic-linear _shadow-panel _rounded-lg animate-pulse"
          >
            <div class="_size-8 _rounded-full _bg-black/30"></div>
            <div class="_flex-1 _space-y-2">
              <div class="_h-4 _bg-black/30 _rounded w-3/4"></div>
            </div>
            <div class="_h-6 _w-12 _bg-black/30 _rounded"></div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="_p-4 _bg-red-100 _text-red-700 _rounded-lg">
          {{ error }}
        </div>

        <!-- Quest List -->
        <div v-else class="_space-y-2">
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
          <QuestCard
            v-for="quest in filteredQuests"
            :key="quest.id"
            :quest="quest"
            :highlight="quest.id === highlightQuestPinId"
            @points-updated="fetchUserPoints"
          />
        </div>
      </div>

      <!-- (spend) -->
      <div v-if="selectedTab === 'spend'" class="_space-y-3">
        <section
          class="_bg-metallic-coneff _-mx-2 _p-2.5ff _rounded-lg_shadow-panel-inset _text-center _flex _flex-col _gap-4"
        >
          <section v-for="game in lotteries" :key="game.name" class="_relative _group">
            <a
              :href="game.linkDisabled ? null : game.link"
              class="_block _pointer-events-auto _cursor-pointer _scale-[1.05] mouse:hover:_scale-[1.1] _duration-500"
            >
              <figure
                class="masked-oval _relative _flex _items-center _justify-center _pointer-events-none"
                style="aspect-ratio: 14.5/9"
              >
                <video
                  :src="game.bgVideo"
                  autoplay
                  muted
                  playsinline
                  webkit-playsinline
                  preload="auto"
                  loop
                  class="_absolute _top-0 _left-0 _w-full _h-full _object-cover"
                  :style="{
                    filter: game.bgBlur ? `blur(${game.bgBlur}px)` : 'none'
                    // imageRendering: 'pixelated'
                  }"
                  loading="lazy"
                ></video>
              </figure>
            </a>
            <div class="_px-2.5 _mx-6 _flex _justify-center _-mt-5 _relative _p-2">
              <div
                class="_bg-metallic-linearff _shadow-panel-insetff _rounded-lg _flex _items-center _w-fullff _justify-between _flex-col _gap-1 _shadow-panel-insetff _rounded-full _w-full _pb-5"
              >
                <a
                  :href="game.linkDisabled ? null : game.link"
                  class="_-mt-8 _relative _z-10 _bg-metallic-cone _shadow-panel _rounded-full _px-8 _py-1.5 _weight-black _text-em-2xl sm:_text-em-3xl mouse:hover:_scale-[1.05] _duration-150"
                  :class="{
                    '_animate-rainbow-wiggle-sm': true,
                    // '_tracking-[0.2em]': !game.title,
                    '_tracking-[0.05em]': game.title
                  }"
                >
                  {{ game.title }}
                  <!-- <template v-if="game.title">{{ game.title }}</template>
                  <template v-else-if="game.isNewUntil > today">
                    <span class="mouse:group-hover:_hidden">NEW</span>
                    <span class="mouse:group-hover:_inline _hidden">PLAY</span>
                  </template>
                  <template v-else> PLAY </template> -->
                </a>
                <div
                  v-if="game.description"
                  class="_relative _-mt-3 _shadow-panel-inset _rounded-md"
                >
                  <p
                    class="_px-4.5 _leading-none _py-4.5 _italic _opacity-50ff _whitespace-nowrap _text-stroke-lg _tracking-[0.01em]"
                    v-html="game.description"
                  ></p>
                  <!-- (new badge) -->
                  <!-- <div
                  v-if="game.isNewUntil > today"
                  class="_absolute _bottom-0 _right-0 _translate-x-[55%] _translate-y-[40%]"
                >
                  <div
                    class="_bg-metallic-cone _shadow-panel _rounded-full _text-em-lg _weight-semibold _tracking-wide _px-[0.75em] _leading-none _pt-[0.2em] _pb-[0.27em] _animate-rainbow-wiggle"
                  >
                    new
                  </div>
                </div> -->
                </div>
              </div>
            </div>
          </section>
        </section>
        <!-- <section
          class="_text-mlg _bg-metallic-linearff _p-2.5 _rounded-lg _shadow-panel-insetff _border-4 _border-dashed _border-black/20 _text-center _flex _flex-col _gap-4"
        >
          <header
            class="_flex _items-center _gap-[0.75em] _justify-center _leading-none _mt-2 _-mb-1"
          >
            <div class="_text-[2.5em] _animate-wiggle-sm">🪩</div>
            <div class="_text-[1.75em]">➡️</div>
            <TicketEmoji class="_h-[2.5em]" />
          </header>
          <div class="_flex _items-center _gap-[0.5em]">
            <p class="_flex-1 _text-center _text-stroke-2xl">
              Add <span class="_inline-block">balls</span> to next week's
              <button class="_underline" @click="openHub('games', false, { tab: 'lotteries' })">
                USDC contest</button
              >!
            </p>
          </div>
          <SwapBalls @getBallsClick="selectedTab = 'earn'" />
        </section> -->
      </div>
    </transition-group>

    <section
      class="_mt-6 _bg-metallic-linear _p-4 _rounded-lg _shadow-panel _text-center _flex _flex-col _gap-3 _pb-5"
    >
      <header class="_-mt-0.5 _opacity-30 _animate-wiggle-sm">follow for updates</header>

      <div class="_grid _grid-cols-2 _gap-2">
        <SocialsButtons />
      </div>
    </section>
  </div>
</template>

<script setup>
import HubPageHeader from '../components/HubPageHeader.vue'
import { storeToRefs } from 'pinia'
import { ref, onMounted, inject, watch, computed, nextTick } from 'vue'
import { possiblePoints } from '../config/pointsConfig'
import SocialsButtons from '../components/SocialsButtons.vue'
// import SwapBalls from '../components/SwapBalls.vue'
// import TicketEmoji from '../components/TicketEmoji.vue'
import QuestCard from '../components/QuestCard.vue'

const auth = inject('TrifleHub/store')
const hub = inject('hub')
const { openHub } = hub
const quests = ref([])
const loading = ref(true)
const error = ref(null)
const totalBalls = ref(0)
const filter = ref('all') // 'all', 'once', 'ongoing'
const selectedTab = ref('earn')

const { backendUrl, isAuthenticated } = storeToRefs(auth)

const openProfile = () => {
  auth.setProfileUsername(auth.user?.username)
  openHub('profile')
}

const highlightQuestPinId = computed(() => hub.highlightQuestId?.value)

// Compute filtered quests based on the selected filter
const filteredQuests = computed(() => {
  let questsToDisplay = []
  const currentPlatform = auth.isFarcaster ? 'farcaster' : 'web'
  const visibleQuests = quests.value.filter(
    (quest) =>
      !quest.hiddenFromQuests && (!quest.platforms || quest.platforms.includes(currentPlatform))
  )
  if (filter.value === 'all') {
    questsToDisplay = visibleQuests
  } else if (filter.value === 'once') {
    questsToDisplay = visibleQuests.filter((quest) => quest.once)
  } else if (filter.value === 'ongoing') {
    questsToDisplay = visibleQuests.filter((quest) => !quest.once)
  } else {
    questsToDisplay = visibleQuests
  }

  const sorted = questsToDisplay.slice().sort((a, b) => {
    // Sort by enabled status first (enabled quests on top)
    if (a.enabled && !b.enabled) return -1
    if (!a.enabled && b.enabled) return 1

    // For enabled quests, push completed .once quests to the bottom
    if (a.enabled && b.enabled) {
      const aCompletedOnce = a.completed && a.once
      const bCompletedOnce = b.completed && b.once
      if (aCompletedOnce && !bCompletedOnce) return 1
      if (!aCompletedOnce && bCompletedOnce) return -1
    }

    return 0 // Keep original array order for everything else
  })

  const pinId = hub.highlightQuestId?.value
  if (pinId) {
    const idx = sorted.findIndex((q) => q.id === pinId)
    if (idx > 0) {
      const [item] = sorted.splice(idx, 1)
      sorted.unshift(item)
    }
  }

  return sorted
})

const fetchUserPoints = async () => {
  loading.value = true
  error.value = null

  try {
    if (isAuthenticated.value || auth.isFarcaster?.user?.id) {
      // Fetch all points for the user
      const response = await fetch(`${backendUrl.value}/balls/point-categories-with-counts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // Authorization: `Bearer ${auth.authToken}`
        },
        body: JSON.stringify({
          userId: auth.user?.id || auth.isFarcaster?.user?.id
        })
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

watch(
  () => [hub.highlightQuestId?.value, loading.value],
  async ([pinId, isLoading]) => {
    if (!pinId || isLoading) return
    await nextTick()
    document.getElementById(`thub-quest-${pinId}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    })
  },
  { flush: 'post' }
)

const lotteries = [
  {
    name: 'like-lottery',
    title: 'NEW PRIZES SOON',
    link: 'https://trifle.life/prizes',
    linkDisabled: true,
    bgVideo:
      'https://gm-trifle.b-cdn.net/dsiwc6udm/video/upload/q_auto:eco/v1757079745/lottery-gif-loop-better-shorter__16-9__240p-400br_f5bx63.mp4',
    bgBlur: 0,
    isNewUntil: new Date('September 30, 2099')
  }
]
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
