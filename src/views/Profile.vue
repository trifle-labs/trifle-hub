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
          {{ user?.username || 'User Profile' }}
        </span>
      </div>
    </template>
    <template #description>
      <div class="_flex _justify-center _gap-1 _h-10 _items-center">
        <span
          @click="openEarn"
          class="_text-xl _shadow-panel _pl-[0.3em] _pr-[0.5em] _rounded-full _bg-metallic-cone _leading-none _py-[0.25em] _flex _gap-[0.2em] _cursor-pointer"
        >
          <span>🪩</span>
          <span class="_text-stroke-xl">{{ user?.totalPoints?.toLocaleString() || 0 }}</span>
        </span>
      </div>
    </template>
    <section class="_w-full _max-w-2xl _mt-6ff">
      <h3 class="_weight-boldff _text-xs _opacity-30 _text-left _ml-2 _-mt-6 _mb-1">activity</h3>
      <!-- <h3 class="_text-xl _weight-bold _mb-2">Pachinko Ball History</h3>
      <div class="_flex _gap-2 _mb-4 _flex-wrap">
        <button
          v-for="cat in categories"
          :key="cat"
          class="_bubble-btn _px-3 _py-1 _text-xs _rounded-full"
          :class="{ '_bg-metallic-cone _text-black': selectedCategory === cat }"
          @click="selectCategory(cat)"
        >
          {{ cat }}
        </button>
      </div> -->
      <!--  -->
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
          <ul class="_space-y-2">
            <!-- point rows... -->
            <li v-for="point in points" :key="point.id">
              <PointCard :point="point" />
            </li>
          </ul>
          <template v-if="totalPages > 1">
            <nav class="_grid _grid-cols-2 _gap-1">
              <button class="_flex-1 _bubble-btn _p-4.5" @click="prevPage" :disabled="page === 1">
                <span :class="{ '_opacity-30': page === 1 }">Prev</span>
              </button>
              <button class="_flex-1 _bubble-btn _p-4.5" @click="nextPage" :disabled="!hasMore">
                Next
              </button>
            </nav>
            <div class="_text-center _text-xs _opacity-50 _-mt-2">
              Page {{ page }}<span v-if="totalCount"> of {{ totalPages }}</span>
            </div>
          </template>
        </template>
      </section>
    </section>
  </AccountLayout>
</template>

<script setup>
import { ref, onMounted, watch, inject, computed } from 'vue'
import { storeToRefs } from 'pinia'
import AccountLayout from '../components/AccountLayout.vue'
import smileyFaceSvg from '../assets/imgs/smiley-face-dashed-outline.svg'
import PointCard from '../components/PointCard.vue'
import TrifleBall from '../components/TrifleBall/TrifleBall.vue'
const hub = inject('hub')
const auth = inject('TrifleHub/store')
const { currentProfileUsername, backendUrl } = storeToRefs(auth)
const user = ref(null)
const loading = ref(true)
const error = ref(null)

const points = ref([])
const pointsLoading = ref(false)
const pointsError = ref(null)
const page = ref(1)
const pageSize = 10
const hasMore = ref(false)
const totalCount = ref(0)
const categories = ref([])
const selectedCategory = ref(null)
const openEarn = () => {
  auth.setProfileUsername(null)
  hub.openHub('earn')
}

const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pageSize)))

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
  await fetchCategories()
  await fetchPoints()
})
watch(page, fetchPoints)

// TODO: retrieve from global or provided from parent hub <transition>
const doneAnimating = ref(false)
onMounted(() => {
  setTimeout(() => {
    doneAnimating.value = true
  }, 350) // need to wait for hub open animation otherwise webgl 0px error
})
</script>

<style scoped></style>
