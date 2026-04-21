<template>
  <!-- TODO: font size should be set from the parent... but super app uses this component so need to update there as well when done -->
  <form
    ref="el"
    class="trifle-hub-ui _bg-metallic-linear _p-4 _rounded-lg _shadow-panel _flex _flex-col _items-center _gap-2.5 _text-2xl _text-stroke-2xl _text-right"
    @submit.prevent="submit"
  >
    <header class="_w-full _flex _justify-between _items-center">
      <div class="_flex _gap-[0.25em] _min-w-0 _flex-1 _items-center">
        <template v-if="myUser?.avatar">
          <img :src="myUser?.avatar" class="_size-[1.2em] _rounded-full" />
        </template>
        <template v-else>
          <div
            alt="smiley face with dashed outline"
            class="_size-[1.375em] _flex-shrink-0 _rounded-full _bg-cover _bg-center _opacity-30 _animate-wiggleff"
            tabindex="-1"
            :style="{
              backgroundImage: `url(${smileyFacePng})`,
              mixBlendMode: 'multiply'
            }"
          ></div>
          <!-- <div
            class="_size-[1.5em] _bg-metallic-linear _rounded-full _shadow-panel _p-1 _flex _items-stretch"
          >
          </div> -->
        </template>
        <div v-if="myUser" class="_min-w-0 _truncate">{{ myUser?.username || 'me' }}</div>
        <div v-else class="_min-w-0 _truncate _opacity-25 _pl-0.5 _text-em-sm">who r u??</div>
      </div>
      <button
        type="button"
        class="_text-em-xs _shadow-panel _pl-[0.3em] _pr-[0.35em] _rounded-full _bg-metallic-cone _leading-none _h-[1.375em] _flex _items-center _gap-[0.15em]"
        @click="openBallsHub"
      >
        <span>🪩</span><span v-if="ballsLoading" class="_animate-blink-fast">...</span
        ><span v-else class="_text-stroke-xl" :class="{ '_text-rot': amount > 0 }">{{
          ((myBallsBalance || 0) - amount).toLocaleString()
        }}</span>
      </button>
    </header>
    <!-- input -->
    <div
      v-if="myBallsBalance > 0"
      class="_w-full _flex _shadow-panel-inset _rounded-lg _p-[0.05em]"
    >
      <input
        type="number"
        class="_flex-1 _border _w-0 _text-right _p-0"
        v-model="amount"
        placeholder="0"
        min="0"
        :max="myBallsBalance"
        step="1"
        @change="clearStatus"
        :disabled="!myBallsBalance"
      />
      <div class="_p-[0.3em] _flex _items-center _justify-center">
        <TicketEmoji :animate="canSwap" />
      </div>
    </div>
    <div v-if="myBallsBalance > 0" class="_flex _justify-evenly _w-full">
      <button
        v-for="percentage in [0.1, 0.25, 0.5, 0.75, 1]"
        :key="percentage"
        type="button"
        class="_text-em-3xs _text-stroke-3xl _shadow-panel _px-[0.5em] _rounded-full _bg-metallic-cone _leading-none _h-[1.5em] _flex _items-center _gap-[0.15em]"
        @click="setAmountToPercentage(percentage)"
      >
        <template v-if="percentage === 1">MAX</template>
        <template v-else>{{ percentage * 100 }}%</template>
      </button>
    </div>
    <template v-if="!myBallsBalance">
      <div class="_flex _w-full">
        <button
          type="button"
          class="_flex-1 _bubble-btn _px-6 _h-16 _flex _items-center _justify-center _text-xl _text-stroke-2xl _animate-scaleup-xs"
          style="filter: hue-rotate(-345deg) saturate(2.5)"
          @click="getBallsClick"
        >
          <span style="filter: hue-rotate(345deg) saturate(0.9)" class="_tracking-wide">
            🪩 GET BALL$ 🪩
          </span>
        </button>
      </div>
    </template>
    <!-- down arrow swap button -->
    <!-- <div
      class="_h-7 _w-9 _bg-metallic-cone _rounded _flex _items-center _justify-center _shadow-panel _-my-5 _relative _z-10"
      :class="{ '_cursor-pointer': canSwap }"
      @click="submit"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="4"
        stroke="currentColor"
        class="_size-5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      </svg>
    </div> -->
    <!-- converted -->
    <!-- <div class="_w-full _flex _shadow-panel _bg-metallic-linear _rounded-lg _h-[2em]">
      <div class="_flex-1 _flex _items-center _justify-end" :class="{ '_opacity-25': amount === 0 }">
        {{ amount }}
      </div>
      <div class="_p-[0.3em] _flex _items-center _justify-center">
        <TicketEmoji :animate="canSwap" class="_h-[1.02em]" />
      </div>
    </div> -->
    <!-- (status) -->
    <transition-group name="status" @afterEnter="afterEnter">
      <section v-if="status" class="_w-full" :key="JSON.stringify(status)">
        <div
          class="_w-full _bg-metallic-cone _p-2.5 _rounded-lg _shadow-panel _text-left _text-stroke-2xl _text-lg _leading-normal _flex _flex-col"
          :class="{
            '_animate-scaleup-xs': ['success', 'pending'].includes(status.type),
            '_text-rot': status.type === 'error'
          }"
        >
          <header class="_flex _items-start _gap-[0.5em]">
            <div v-if="statusIcon">
              {{ statusIcon }}
            </div>
            <div class="_flex-1">
              <template v-if="status.type === 'success'">
                🪄 BADA-BING-BADA-BOTTO, you added {{ status.data.pointsAwarded }} ball{{
                  status.data.pointsAwarded > 1 ? 's' : ''
                }}
                <TicketEmoji class="_mb-[0.25em]" :animate="false" />
                to the next LOTTO!</template
              ><template v-else>
                {{ status.message }}
              </template>
            </div>
            <button
              v-if="status.data?.detail"
              type="button"
              class="_h-[1.4em] _flex _items-center _justify-center"
              @click="statusDetailVisible = !statusDetailVisible"
            >
              <div
                class="_size-[1.3em] _text-black _bg-metallic-cone _rounded _flex _items-center _justify-center _shadow-panel _pt-[0.1em]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="4"
                  stroke="currentColor"
                  class="_size-5/6 _opacity-75"
                  :class="{ '_-rotate-180': statusDetailVisible }"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
            </button>
          </header>
          <p
            v-if="status.data?.detail && statusDetailVisible"
            class="_text-em-2xs _mt-[0.25em] _text-stroke-xl"
          >
            {{ status.data.detail?.toString() }}
          </p>
        </div>
      </section>
    </transition-group>

    <footer v-if="myBallsBalance > 0" class="_flex _w-full _mt-0.5">
      <button
        type="submit"
        class="_flex-1 _bubble-btn _px-6 _h-16 _flex _items-center _justify-center _text-xl _text-stroke-2xl"
        :style="{ filter: canSwap ? 'hue-rotate(-345deg) saturate(2.5)' : 'none' }"
      >
        <div :class="{ '_animate-scaleup-sm': canSwap }">ADD TO LOTTO</div>
      </button>
    </footer>
  </form>
</template>

<script setup>
import { computed, inject, ref } from 'vue'
import TicketEmoji from './TicketEmoji.vue'
import smileyFacePng from '../assets/imgs/smiley-face-dashed-center-medium.png'

const emit = defineEmits(['getBallsClick'])

const authStore = inject('TrifleHub/store')
const myUser = computed(() => authStore.user)

const amount = ref(0)

function setAmountToPercentage(percentage = 1) {
  amount.value = Math.floor((myUser.value?.totalBalls || 0) * percentage)
}

const canSwap = computed(() => {
  return amount.value > 0 && amount.value <= myUser.value?.totalBalls
})

const status = ref()
const statusDetailVisible = ref(false)
const statusIcon = computed(() => {
  return {
    // success: '🪄',
    error: '❌',
    pending: '⏳'
  }[status.value?.type]
})

const showStatus = (type, message, data = {}) => {
  statusDetailVisible.value = false
  status.value = { type, message, data }
}
const clearStatus = () => (status.value = null)

// watch(amount, (newValue) => {
//   if (status.value) {
//     clearStatus()
//   }
// })

const ballsLoading = ref(false)
const myBallsBalance = computed(() => myUser.value?.totalBalls)

const el = ref()
const afterEnter = () => {
  const className = '_animate-shake-x-micro-fast'
  el.value.classList.add(className)
  setTimeout(() => el.value.classList.remove(className), 120)
}

async function fetchBallBalance() {
  if (!authStore.user) return
  try {
    ballsLoading.value = true
    await authStore.fetchUserStatus()
  } catch (err) {
    console.error(err)
    // showStatus('error', 'Oops, couldn\'t get your BALL$ balance' )
    throw new Error("Couldn't get your BALL$ balance", { cause: err })
  } finally {
    ballsLoading.value = false
  }
}

// fetch on load
fetchBallBalance()

const submit = async () => {
  if (!amount.value) {
    return showStatus('error', 'Enter an amount to swap first!')
  }

  try {
    // await fetchBallBalance()

    // if (amount.value > myBallsBalance.value) {
    //   throw new Error('Not enough 🪩 BALL$!', {
    //     cause: `You only have ${myBallsBalance.value}🪩`
    //   })
    // }

    showStatus('pending', 'Swapping...')

    const response = await fetch(authStore.backendUrl + '/farcaster/award', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.authToken}`
      },
      body: JSON.stringify({
        points: amount.value // Integer. Required. Number of points to swap to lotto-balls (awarded to the calling user).
      })
    })
    const result = await response.json()
    console.log(result)

    if (result.success) {
      console.log('Swap successful')
      showStatus('success', null, result)
      amount.value = 0
      fetchBallBalance()
    } else {
      throw new Error('Swap failed', { cause: result })
    }
  } catch (error) {
    console.log({ error })
    console.error(error)
    showStatus('error', `bZZZt... ${error.message}`, {
      detail: (error.cause ? JSON.stringify(error.cause) : error).toString()
    })
  }
}

function getBallsClick() {
  emit('getBallsClick')
}
</script>

<style>
.status-enter-active {
  transition: all 120ms;
  transform-origin: top center;
}
.status-enter-from {
  transform: rotate(80deg) scale(2) translate(-19px, -170px);
  filter: blur(20px);
}
</style>
