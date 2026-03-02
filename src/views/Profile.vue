<template>
  <AccountLayout>
    <template #avatar>
      <div
        class="_size-full _flex _items-center _justify-center _rounded-full _duration-150 _delay-50"
        style="box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.4)"
        :class="{ '_opacity-0': !doneAnimating }"
      >
        <TrifleBall
          v-if="doneAnimating"
          :key="(user && user?.avatar) || 'smiley-face'"
          mode="glass-inner-wall"
          :image-source="(user && user?.avatar) || smileyFaceSvg"
          style="width: 175%; height: 175%"
          class="_cursor-grab"
        />
      </div>
    </template>
    <template #title>
      <div
        class="_h-12 _flex _items-center _gap-1 _w-full _justify-center _border _border-transparent"
      >
        <span class="_text-stroke-2xl _min-w-0 _px-0.5">
          {{ user?.username || '...' }}
        </span>
      </div>
    </template>
    <template
      #description
      v-if="primaryDiscord || primaryTwitter || primaryTelegram || primaryFarcaster"
    >
      <div class="_flex _justify-center _gap-2 _h-10 _items-center">
        <a
          v-if="primaryDiscord"
          :href="discordUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="_p-1.5 _flex _items-center _justify-center _rounded-lg _bg-metallic-cone _shadow-panel"
          aria-label="View Discord profile"
        >
          <img
            src="../assets/imgs/discord-logo.svg"
            class="_size-7 _rounded"
            style="background-color: #5865f2"
          />
        </a>
        <a
          v-if="primaryTwitter"
          :href="twitterUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="_p-1.5 _flex _items-center _justify-center _rounded-lg _bg-metallic-cone _shadow-panel"
          aria-label="View Twitter profile"
        >
          <img
            src="../assets/imgs/twitter-x-logo.svg"
            class="_size-7 _rounded"
            style="background-color: #000"
          />
        </a>
        <a
          v-if="primaryTelegram"
          :href="telegramUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="_p-1.5 _flex _items-center _justify-center _rounded-lg _bg-metallic-cone _shadow-panel"
          aria-label="View Telegram profile"
        >
          <img
            src="../assets/imgs/telegram-logo.svg"
            class="_size-7 _rounded"
            style="background-color: #0088cc"
          />
        </a>
        <a
          v-if="primaryFarcaster"
          :href="farcasterUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="_p-1.5 _flex _items-center _justify-center _rounded-lg _bg-metallic-cone _shadow-panel"
          aria-label="View Farcaster profile"
        >
          <img
            src="../assets/imgs/farcaster-logo.svg"
            class="_size-7 _rounded"
            style="background-color: #000"
          />
        </a>
      </div>
    </template>

    <!-- <div class="_flex _gap-2 _justify-between _items-center _flex-wrap">
      <div
        class="_bg-metallic-cone _rounded-full _p-[0.2em] _leading-none _flex _gap-1 _shadow-panel _pl-[0.5em]"
      >
        <span class="_text-stroke-xl">{{ user?.totalPoints?.toLocaleString() || 0 }}</span>
        <span>🪩</span>
      </div>
      <div
        class="_bg-metallic-cone _rounded-full _p-[0.2em] _leading-none _flex _gap-1 _shadow-panel _pl-[0.5em]"
      >
        <span class="_text-stroke-xl">{{ (user?.totalPoints * 2).toLocaleString() || 0 }}</span>
        <span>🪂</span>
      </div>
      <div
        class="_bg-metallic-cone _rounded-full _p-[0.2em] _leading-none _flex _gap-1 _shadow-panel _pl-[0.5em]"
      >
        <span class="_text-stroke-xl">1st place</span>
      </div>
    </div> -->

    <section
      class="_whitespace-nowrap _overflow-x-scroll _no-scrollbar _align-top _-ml-[2px] _p-[2px]"
    >
      <section
        class="_inline-flex _flex-col _mr-2 _bg-metallic-linear _shadow-panel _px-3 _py-2 _pb-1.5 _rounded-lg"
        @click="hub.openHub('leaderboard')"
      >
        <header class="_flex _justify-between _items-center _opacity-30 _text-base _leading-snug">
          <h3 class="_weight-black">rank</h3>
        </header>
        <div class="_flex _justify-end _text-2xl _pl-6">
          <span class="_text-stroke-xl">{{ rankDisplay }}</span>
        </div>
      </section>

      <section
        class="_inline-flex _flex-col _mr-2 _bg-metallic-linear _shadow-panel _px-3 _py-2 _pb-1.5 _rounded-lg"
      >
        <header class="_flex _justify-between _items-center _opacity-30 _text-base _leading-snug">
          <h3 class="_weight-black">airdrop</h3>
          <button class="_text-em-xs">ⓘ</button>
        </header>
        <div class="_flex _justify-end _text-2xl _gap-[0.1em] _pl-6">
          <span class="_text-stroke-xl">
            {{ airdropPointsDisplay }}
          </span>
          <span>🪂</span>
        </div>
      </section>
      <section
        class="_inline-flex _flex-col _bg-metallic-linear _shadow-panel _px-3 _py-2 _pb-1.5 _rounded-lg"
      >
        <header class="_flex _justify-between _opacity-30 _text-base _leading-snug">
          <h3 class="_weight-black">balance</h3>
        </header>
        <div class="_flex _justify-end _text-2xl _gap-[0.1em] _pl-6">
          <span class="_text-stroke-xl">{{ user?.totalPoints?.toLocaleString() || 0 }}</span>
          <span>🪩</span>
        </div>
      </section>
    </section>

    <section class="_w-full _max-w-2xl">
      <section class="_bg-metallic-linear _shadow-panel _p-4 _space-y-2 _rounded-lg">
        <div class="_flex _items-center _justify-between _-mt-1.5">
          <h3 class="_text-mlg _opacity-30 _weight-bold">activity</h3>
          <div v-if="totalPages > 1" class="_flex _items-center _gap-2">
            <div v-if="page > 1" class="_text-xs _opacity-30 _tracking-wide">
              Page {{ page }}<span v-if="totalCount"> of {{ totalPages }}</span>
            </div>
            <div class="_flex _items-center _gap-1">
              <button
                class="_size-8 _flex _items-center _justify-center _rounded-lg _bg-metallic-cone _shadow-panel _text-xl mouse:hover:_scale-[1.05] _duration-150"
                @click="prevPage"
                :disabled="page === 1"
                :class="{ '_opacity-30 _cursor-default': page === 1 }"
                aria-label="Previous page"
              >
                ←
              </button>
              <button
                class="_size-8 _flex _items-center _justify-center _rounded-lg _bg-metallic-cone _shadow-panel _text-xl mouse:hover:_scale-[1.05] _duration-150"
                @click="nextPage"
                :disabled="!hasMore"
                :class="{ '_opacity-30 _cursor-default': !hasMore }"
                aria-label="Next page"
              >
                →
              </button>
            </div>
          </div>
        </div>

        <div v-if="loading" class="_text-center _py-10">Loading profile...</div>
        <div v-else-if="error" class="_p-4 _bg-red-100 _text-red-700 _rounded-lg _mt-4">
          {{ error }}
        </div>
        <section v-else class="_flex _flex-col _gap-4">
          <div v-if="pointsLoading" class="_text-center _py-6">Loading points...</div>
          <div v-else-if="pointsError" class="_p-2 _bg-red-100 _text-red-700 _rounded-lg">
            {{ pointsError }}
          </div>
          <template v-else>
            <ul class="_space-y-0.5">
              <!-- point rows... -->
              <li v-for="point in points" :key="point.id">
                <PointCard :point="point" />
              </li>
            </ul>
          </template>
        </section>

        <!-- page indicator moved into header next to arrows -->
      </section>
    </section>
  </AccountLayout>
</template>

<script setup>
import { ref, onMounted, watch, inject, computed, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
import AccountLayout from '../components/AccountLayout.vue'
import smileyFaceSvg from '../assets/imgs/smiley-face-dashed-outline.svg'
import PointCard from '../components/PointCard.vue'
const TrifleBall = defineAsyncComponent(() => import('../components/TrifleBall/TrifleBall.vue'))
const hub = inject('hub')
const auth = inject('TrifleHub/store')
const { currentProfileUsername, backendUrl, user: authUser } = storeToRefs(auth)
const user = ref(null)
const loading = ref(true)
const error = ref(null)

const points = ref([])
const pointsLoading = ref(false)
const pointsError = ref(null)
const page = ref(1)
const pageSize = 5
const hasMore = ref(false)
const totalCount = ref(0)
const categories = ref([])
const selectedCategory = ref(null)
const openEarn = () => {
  auth.setProfileUsername(null)
  hub.openHub('earn')
}

const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pageSize)))

const airdropRank = ref(null)
const airdropPoints = ref(0)

const rankDisplay = computed(() => {
  const r = airdropRank.value
  if (!r || isNaN(r)) return '—'
  const v = Number(r)
  const mod10 = v % 10
  const mod100 = v % 100
  if (mod10 === 1 && mod100 !== 11) return `${v}st`
  if (mod10 === 2 && mod100 !== 12) return `${v}nd`
  if (mod10 === 3 && mod100 !== 13) return `${v}rd`
  return `${v}th`
})

const airdropPointsDisplay = computed(() =>
  Number(airdropPoints.value || 0).toLocaleString('en-us')
)

const isOwnProfile = computed(() => {
  if (!authUser.value?.username || !currentProfileUsername.value) return false
  return authUser.value.username === currentProfileUsername.value
})

// For the profile view, we want socials belonging to the profile user.
// If you're viewing your own profile, we reuse the authenticated user's linked accounts.
// If you're viewing another player, we rely on any linkedAccounts returned from /auth/by-username;
// if none are present we intentionally show no socials instead of the logged-in user's.
const discordAuths = computed(() => {
  const list = isOwnProfile.value
    ? auth.getPlatformData('discord') || []
    : user.value?.linkedAccounts?.discord || []
  return list.filter((d) => d.username)
})
const twitterAuths = computed(() => {
  const list = isOwnProfile.value
    ? auth.getPlatformData('twitter') || []
    : user.value?.linkedAccounts?.twitter || []
  return list.filter((t) => t.username)
})
const telegramAuths = computed(() => {
  const list = isOwnProfile.value
    ? auth.getPlatformData('telegram') || []
    : user.value?.linkedAccounts?.telegram || []
  return list.filter((t) => t.username)
})
const farcasterAuths = computed(() => {
  if (isOwnProfile.value) return auth.getPlatformData('farcaster') || []
  return user.value?.linkedAccounts?.farcaster || []
})

const primaryDiscord = computed(() => discordAuths.value[0] || null)
const primaryTwitter = computed(() => twitterAuths.value[0] || null)
const primaryTelegram = computed(() => telegramAuths.value[0] || null)
const primaryFarcaster = computed(() => farcasterAuths.value[0] || null)

const discordUrl = computed(() =>
  primaryDiscord.value ? `https://discord.com/users/${primaryDiscord.value.id}` : '#'
)
const twitterUrl = computed(() =>
  primaryTwitter.value ? `https://x.com/${primaryTwitter.value.username}` : '#'
)
const telegramUrl = computed(() =>
  primaryTelegram.value ? `https://t.me/${primaryTelegram.value.username}` : '#'
)
const farcasterUrl = computed(() =>
  primaryFarcaster.value ? `https://warpcast.com/${primaryFarcaster.value.username}` : '#'
)

const formatPoints = (points) => {
  points = Number(points)
  // remove the decimal if it's 0
  if (points % 1 === 0) {
    return points
  }
  return points.toFixed(2)
}

const fetchUser = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await fetch(
      `${backendUrl.value}/auth/by-username?username=${encodeURIComponent(
        currentProfileUsername.value
      )}`
    )
    if (!res.ok) throw new Error('Failed to fetch user')
    const data = await res.json()
    console.log({ data })
    user.value = data.user
    console.log({ user })
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

const fetchAirdropInfo = async () => {
  try {
    if (!backendUrl.value || !user.value?.id) return
    const params = new URLSearchParams({
      sortBy: 'count',
      sortDir: 'desc',
      limit: '1',
      userId: String(user.value.id)
    })
    const res = await fetch(`${backendUrl.value}/balls/airdrop-points?${params.toString()}`)
    if (!res.ok) return
    const data = await res.json()
    if (data.currentUser) {
      airdropPoints.value = data.currentUser.totalBalls || 0
      airdropRank.value = data.currentUser.rank || null
    }
  } catch (e) {
    console.error('Failed to fetch airdrop info', e)
  }
}

const fetchCategories = async () => {
  try {
    const response = await fetch(`${backendUrl.value}/balls/point-categories-with-counts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.value.id })
    })
    if (!response.ok) throw new Error('Failed to fetch categories')
    const data = await response.json()
    categories.value = (data.balls?.data || []).map((c) => c.name)
  } catch (e) {
    categories.value = []
  }
}

const fetchPoints = async () => {
  pointsLoading.value = true
  pointsError.value = null
  try {
    let url = `${backendUrl.value}/balls/list?page=${
      page.value
    }&limit=${pageSize}&username=${encodeURIComponent(currentProfileUsername.value)}`
    if (selectedCategory.value) {
      url += `&ballName=${encodeURIComponent(selectedCategory.value)}`
    }
    const res = await fetch(url)
    if (!res.ok) throw new Error('Failed to fetch points')
    const data = await res.json()
    points.value = data.data
    hasMore.value = data.data.length === pageSize
    totalCount.value = data.total || 0
  } catch (e) {
    pointsError.value = e.message
  } finally {
    pointsLoading.value = false
  }
}

const prevPage = () => {
  if (page.value > 1) {
    page.value--
    fetchPoints()
  }
}
const nextPage = () => {
  if (hasMore.value) {
    page.value++
    fetchPoints()
  }
}

const selectCategory = (cat) => {
  selectedCategory.value = cat === selectedCategory.value ? null : cat
  page.value = 1
  fetchPoints()
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString()
}

onMounted(async () => {
  console.log('onMounted', currentProfileUsername.value)
  if (!currentProfileUsername.value) {
    hub.openHub('account')
    return
  }
  await fetchUser()
  await fetchAirdropInfo()
  await fetchCategories()
  await fetchPoints()
})
// this is duplicating the prev/next methods
// watch(page, fetchPoints)

// TODO: retrieve from global or provided from parent hub <transition>
const doneAnimating = ref(false)
onMounted(() => {
  setTimeout(() => {
    doneAnimating.value = true
  }, 350) // need to wait for hub open animation otherwise webgl 0px error
})
</script>

<style scoped></style>
