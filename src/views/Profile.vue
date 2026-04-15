<template>
  <AccountLayout>
    <!-- Admin controls (own profile only) -->
    <template #admin-controls>
      <div v-if="isOwnProfile && auth.isAdmin" class="_flex _flex-col _gap-2">
        <button
          v-if="!showAdminPanel && !auth.isSimulationMode"
          class="_p-2 _bg-metallic-linear _shadow-panel _rounded-full _cursor-pointer mouse:hover:_scale-110 _duration-150"
          @click="showAdminPanel = true"
          title="Admin Mode"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="_size-5 _opacity-60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style="pointer-events: none"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              style="pointer-events: none"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              style="pointer-events: none"
            />
          </svg>
        </button>

        <div
          v-if="showAdminPanel || auth.isSimulationMode"
          class="_bg-metallic-linear _shadow-panel _rounded-lg _p-3 _space-y-2 _min-w-[200px]"
        >
          <div
            v-if="auth.isSimulationMode"
            class="_text-xs _font-semibold _text-center _bg-yellow-500/20 _border _border-yellow-500/40 _rounded _py-1"
          >
            SIMULATION MODE
          </div>

          <div v-if="!auth.isSimulationMode" class="_space-y-2">
            <input
              v-model="adminTargetInput"
              type="text"
              placeholder="Username or ID"
              autocomplete="off"
              data-1p-ignore
              class="_w-full _px-2 _py-1 _text-sm _font-normal _rounded _bg-black/20 _border _border-white/10 _outline-none focus:_border-white/30"
              @keyup.enter="enterSimulation"
            />
            <button
              class="_w-full _px-3 _py-1 _text-sm _bg-blue-500/80 _rounded mouse:hover:_bg-blue-500 _duration-150"
              :disabled="!adminTargetInput || adminLoading"
              @click="enterSimulation"
            >
              {{ adminLoading ? 'Loading...' : 'Simulate User' }}
            </button>
            <button
              class="_w-full _px-3 _py-1 _text-xs _bg-white/10 _rounded mouse:hover:_bg-white/20 _duration-150"
              @click="showAdminPanel = false"
            >
              Cancel
            </button>
          </div>

          <button
            v-if="auth.isSimulationMode"
            class="_w-full _px-3 _py-1.5 _text-sm _bg-red-500/80 _rounded mouse:hover:_bg-red-500 _duration-150 _font-semibold"
            @click="exitSimulation"
          >
            Exit Simulation
          </button>
        </div>
      </div>
    </template>
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
      <!-- Other users' profile title -->
      <div
        v-if="!isOwnProfile"
        class="_h-12 _flex _items-center _gap-1 _w-full _justify-center _border _border-transparent"
      >
        <span class="_text-stroke-2xl _min-w-0 _px-0.5">
          {{ user?.username || '...' }}
        </span>
      </div>
      <!-- Own profile: editable username -->
      <div
        v-else
        class="_h-12 _flex _items-center _gap-1 _w-full _justify-center _border _border-transparent"
      >
        <div
          v-show="!isEditingUsername"
          class="_flex _items-center _gap-1 _w-full _justify-center _pl-[1em]"
        >
          <span class="_text-stroke-2xl _min-w-0 _truncate _px-0.5">
            {{ authUser?.username || 'Not set' }}
          </span>
          <button
            class="_p-1 _-m-0.5 _leading-none _flex-shrink-0 _block mouse:hover:_scale-[1.2] _duration-150 _rounded-md"
            @click="startEditingUsername"
          >
            <img
              src="../assets/imgs/pencil-icon.png"
              class="_h-[0.72em] _opacity-20 _pointer-events-none"
            />
          </button>
        </div>
        <div
          v-show="isEditingUsername"
          class="_relative _h-12 _flex _items-stretch _gap-0.5 _px-1 _rounded-lg _shadow-panel-inset _text-center _bg-metallic-linear"
        >
          <input
            ref="usernameInput"
            v-model="newUsername"
            type="text"
            maxlength="22"
            autocomplete="off"
            data-1p-ignore
            class="_flex-1 _text-stroke-2xl _bg-transparent _text-center _w-full _outline-none"
            :class="{ '_border-red-500': !usernameAvailable && newUsername }"
            placeholder="Enter new username"
            @input="handleUsernameInput"
            @keyup.enter="saveUsername"
          />
        </div>
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
      <div class="_inline-flex _gap-2">
        <section
          class="_inline-flex _flex-col _bg-metallic-linear _shadow-panel _px-3 _py-2 _pb-1.5 _rounded-lg"
        >
          <header class="_flex _justify-between _opacity-30 _text-base _leading-snug">
            <h3 class="_weight-black">balance</h3>
          </header>
          <div class="_flex _justify-end _text-2xl _gap-[0.1em] _pl-4">
            <span v-if="loading" class="_text-stroke-xl _animate-pulse-deep">...</span>
            <span v-else class="_text-stroke-xl">
              {{ user?.totalPoints?.toLocaleString() || 0 }}
            </span>
            <span v-if="!loading">🪩</span>
          </div>
        </section>

        <section
          class="_inline-flex _flex-col _bg-metallic-linear _shadow-panel _px-3 _py-2 _pb-1.5 _rounded-lg"
        >
          <header class="_flex _justify-between _items-center _opacity-30 _text-base _leading-snug">
            <h3 class="_weight-black">airdrop pts.</h3>
            <!-- <button class="_text-em-xs">ⓘ</button> -->
          </header>
          <div class="_flex _justify-end _text-2xl _gap-[0.1em] _pl-4">
            <span v-if="airdropLoading" class="_text-stroke-xl _animate-pulse-deep">...</span>
            <span v-else class="_text-stroke-xl">
              {{ airdropPointsDisplay }}
            </span>
            <span v-if="!airdropLoading">🪂</span>
          </div>
        </section>

        <section
          class="_inline-flex _flex-col _bg-metallic-linear _shadow-panel _px-3 _py-2 _pb-1.5 _rounded-lg"
          :class="{ '_order-first': airdropRank < 100 || !isOwnProfile }"
          @click="hub.openHub('leaderboard')"
        >
          <header class="_flex _justify-between _items-center _opacity-30 _text-base _leading-snug">
            <h3 class="_weight-black">rank</h3>
          </header>
          <div class="_flex _justify-end _text-2xl _pl-4">
            <span v-if="airdropLoading" class="_text-stroke-xl _animate-pulse-deep">...</span>
            <span v-else class="_text-stroke-xl">{{ rankDisplay }}</span>
          </div>
        </section>
      </div>
    </section>

    <section class="_w-full _max-w-2xl">
      <section class="_bg-metallic-linear _shadow-panel _p-4 _space-y-2 _rounded-lg">
        <div class="_flex _items-center _justify-between _-mt-1.5">
          <h3 class="_text-mlg _weight-bold" :class="{ '_animate-pulse-deep': pointsLoading }">
            <span class="_opacity-30">activity</span>
          </h3>
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

        <div v-if="pointsError" class="_text-sm _text-red-400">
          {{ pointsError }}
        </div>
        <section v-else-if="points.length" class="_flex _flex-col _gap-4">
          <ul class="_space-y-0.5">
            <!-- point rows... -->
            <li v-for="point in points" :key="point.id">
              <PointCard :point="point" />
            </li>
          </ul>
        </section>

        <!-- page indicator moved into header next to arrows -->
      </section>
    </section>

    <ReferralSection v-if="isOwnProfile" class="_w-full _max-w-2xl" />

    <AccountSettings v-if="isOwnProfile" class="_w-full _max-w-2xl" />
  </AccountLayout>
</template>

<script setup>
import { ref, onMounted, watch, inject, computed, defineAsyncComponent, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import AccountLayout from '../components/AccountLayout.vue'
import AccountSettings from '../components/AccountSettings.vue'
import ReferralSection from '../components/ReferralSection.vue'
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
const pageSize = 3
const hasMore = ref(false)
const totalCount = ref(0)
// const openEarn = () => {
//   auth.setProfileUsername(null)
//   hub.openHub('earn')
// }

const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pageSize)))

const airdropRank = ref(null)
const airdropPoints = ref(0)
const airdropLoading = ref(true)

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
  const list = isOwnProfile.value
    ? auth.getPlatformData('farcaster') || []
    : user.value?.linkedAccounts?.farcaster || []
  // Guard against incomplete records (e.g. FID added via follower sync before
  // profile fetch completed) — without a username we can't build a valid link.
  return list.filter((f) => f.username)
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

// const formatPoints = (points) => {
//   points = Number(points)
//   // remove the decimal if it's 0
//   if (points % 1 === 0) {
//     return points
//   }
//   return points.toFixed(2)
// }

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
  airdropLoading.value = true
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
  } finally {
    airdropLoading.value = false
  }
}

const fetchPoints = async () => {
  pointsLoading.value = true
  pointsError.value = null
  try {
    let url = `${backendUrl.value}/balls/list?page=${
      page.value
    }&limit=${pageSize}&username=${encodeURIComponent(currentProfileUsername.value)}`
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

// const formatDate = (date) => {
//   if (!date) return ''
//   return new Date(date).toLocaleString()
// }

const loadProfileData = async () => {
  if (!currentProfileUsername.value) {
    loading.value = false
    return
  }
  await fetchUser()
  await Promise.all([fetchAirdropInfo(), fetchPoints()])
}

onMounted(async () => {
  console.log('onMounted', currentProfileUsername.value)
  await loadProfileData()
})

watch(currentProfileUsername, async (newVal, oldVal) => {
  if (!newVal || newVal === oldVal) return
  page.value = 1
  await loadProfileData()
})

// TODO: retrieve from global or provided from parent hub <transition>
const doneAnimating = ref(false)
onMounted(() => {
  setTimeout(() => {
    doneAnimating.value = true
  }, 350) // need to wait for hub open animation otherwise webgl 0px error
})

// Admin + username editing state (own profile only)
const showAdminPanel = ref(false)
const adminTargetInput = ref('')
const adminLoading = ref(false)

const enterSimulation = async () => {
  if (!adminTargetInput.value) return

  adminLoading.value = true
  try {
    await auth.enterSimulationMode(adminTargetInput.value)
    showAdminPanel.value = false
    adminTargetInput.value = ''
    auth.addNotification({
      message: `Entered simulation mode for user: ${auth.user?.username}`,
      type: 'success'
    })
  } catch (error) {
    auth.addNotification({
      message: error.message || 'Failed to enter simulation mode',
      type: 'error'
    })
  } finally {
    adminLoading.value = false
  }
}

const exitSimulation = () => {
  auth.exitSimulationMode()
  showAdminPanel.value = false
  auth.addNotification({
    message: 'Exited simulation mode',
    type: 'success'
  })
}

const usernameInput = ref(null)
const isEditingUsername = ref(false)
const newUsername = ref('')
const usernameLoading = ref(false)
const usernameError = ref('')
const isCheckingUsername = ref(false)
const usernameAvailable = ref(true)
let usernameCheckTimeout

const checkUsername = async (username) => {
  if (!username) {
    usernameAvailable.value = true
    usernameError.value = ''
    return
  }
  if (username === authUser.value?.username) {
    usernameAvailable.value = true
    usernameError.value = ''
    return
  }

  const isAlphaNumeric = /^(?!.*--)[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/.test(username)
  if (!isAlphaNumeric) {
    usernameError.value = 'Username must be alphanumeric'
    return
  }

  if (username.length > 22) {
    usernameError.value = 'Username must be 22 characters or less'
    return
  }

  isCheckingUsername.value = true
  try {
    const response = await fetch(
      `${backendUrl.value}/auth/username/check?username=${encodeURIComponent(username)}`
    )
    if (!response.ok) throw new Error('Failed to check username availability')
    const data = await response.json()
    usernameAvailable.value = data.available
    usernameError.value = data.available ? '' : 'This username is already taken'
  } catch (err) {
    console.error('Failed to check username:', err)
    usernameError.value = 'Error checking username'
  } finally {
    isCheckingUsername.value = false
  }
}

const handleUsernameInput = (event) => {
  const username = event.target.value.trim()
  newUsername.value = username
  usernameError.value = ''
  if (usernameCheckTimeout) clearTimeout(usernameCheckTimeout)
  if (username) {
    usernameCheckTimeout = setTimeout(() => checkUsername(username), 500)
  } else {
    usernameAvailable.value = true
  }
}

const startEditingUsername = async () => {
  if (!isOwnProfile.value) return
  if (auth.isSimulationMode) {
    auth.addNotification({
      message: 'Cannot edit username in simulation mode',
      type: 'error'
    })
    return
  }

  usernameError.value = ''
  newUsername.value = authUser.value?.username || ''
  isEditingUsername.value = true
  usernameAvailable.value = true
  await nextTick()
  usernameInput.value?.focus()
  usernameInput.value?.select()
}

const saveUsername = async () => {
  if (!newUsername.value.trim()) {
    auth.addNotification({ type: 'error', message: "Oops, name can't be empty!" })
    return
  }
  if (!usernameAvailable.value) {
    auth.addNotification({ type: 'error', message: 'This name is already taken' })
    return
  }
  if (newUsername.value.trim() === authUser.value?.username) {
    isEditingUsername.value = false
    return
  }

  usernameLoading.value = true
  try {
    await auth.updateUsername(newUsername.value.trim())
    isEditingUsername.value = false
    auth.addNotification({ type: 'success', message: 'Name updated!' })
  } catch (err) {
    console.error('Failed to update name:', err)
    auth.addNotification({ type: 'error', message: 'Hmm, something went wrong' })
  } finally {
    usernameLoading.value = false
  }
}

// const cancelEditingUsername = () => {
//   isEditingUsername.value = false
//   newUsername.value = ''
//   usernameError.value = ''
//   usernameAvailable.value = true
// }
</script>

<style scoped></style>
