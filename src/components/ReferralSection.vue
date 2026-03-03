<template>
  <section class="_w-full _max-w-2xl" :class="$attrs.class">
    <section class="_bg-metallic-linear _shadow-panel _p-4 _space-y-2 _rounded-lg">
      <div class="_flex _items-center _justify-between _-mt-1.5">
        <h3 class="_text-mlg _weight-bold" :class="{ '_animate-pulse-deep': loading }">
          <span class="_opacity-30">invites</span>
        </h3>
      </div>

      <div v-if="error" class="_text-sm _text-red-400">
        {{ error }}
      </div>
      <div v-else class="_space-y-4">
        <!-- Invite link -->
        <section class="_flex _flex-col _gap-0.5">
          <div
            class="_bg-metallic-linear _shadow-panel _p-3 _rounded-lg _flex _flex-col _gap-2.5"
            v-if="referralCode"
          >
            <div class="_text-base">
              Invite a friend and <u>you both</u> get
              <span class="_font-semiboldff _whitespace-nowrap">10🪩</span>
              for every 100🪩 they earn
            </div>
            <!-- <div class="_flex _items-center _gap-2">
              <input
                type="text"
                readonly
                :value="referralUrlShort"
                class="_flex-1 _bg-metallic-cone _shadow-panel-inset _rounded-lg _px-3 _py-2.5 _text-sm _font-mono _opacity-80 _truncate _outline-none"
              />
              <button
                class="_px-4 _py-2.5 _rounded-lg _text-sm _font-medium _bg-blue-500/80 mouse:hover:_bg-blue-500 _duration-150 _shadow-panel"
                @click="copyLink"
              >
                {{ copied ? '✓ copied' : '📋 copy' }}
              </button>
            </div> -->
            <div class="_w-full _flex _flex-col _gap-2.5">
              <button
                class="_flex-1 _bubble-btn _py-4 _weight-black"
                style="filter: hue-rotate(20deg) saturate(3)"
                @click="copyLink"
              >
                {{ copied ? 'Copied!' : 'Copy Invite Link' }}
              </button>
              <button
                class="_py-0.5 _border-4 _border-dashed _border-zinc-400 _rounded-lg _px-2 _leading-relaxed _text-center _text-zinc-500 _text-em-lg _text-stroke-3xl"
                @click="copyCode"
              >
                <div class="_w-full _truncate _min-w-0">
                  {{ copiedCode ? 'Copied!' : referralCode || fallbackReferralCode }}
                </div>
              </button>
              <!-- <div class="_text-xs _text-center _opacity-40">
                code: <span class="_font-mono">{{ referralCode || fallbackReferralCode }}</span>
              </div> -->
            </div>
            <!-- Stats grid -->
            <div v-if="stats.invited > 0" class="_flex _flex-wrap _gap-[inherit] _text-center">
              <div class="_flex-1 _bg-metallic-linear _shadow-panel _rounded-lg _p-3">
                <div class="_text-3xl _font-bold _text-primary _leading-tight">
                  {{ stats.invited }}
                </div>
                <div class="_text-md">invited</div>
              </div>
              <div class="_flex-1 _bg-metallic-linear _shadow-panel _rounded-lg _p-3">
                <div
                  class="_text-3xl _font-bold _leading-tight"
                  :class="{ '_text-primary': !stats.points }"
                >
                  {{ stats.points }} <template v-if="stats.points > 0">🪩</template>
                </div>
                <div class="_text-md"><template v-if="!stats.points">🪩 </template>earned</div>
              </div>
            </div>
            <div
              class="_text-zinc-500 _text-xs _-my-0.5"
              :class="{ '_text-center': stats.invited > 0, '_text-right': stats.invited === 0 }"
            >
              Max 100🪩 per friend
            </div>
          </div>
        </section>

        <!-- No referrals placeholder -->
        <!-- <div v-if="stats.invited === 0" class="_text-center _py-2.5 _text-xs _opacity-40">
          no referrals yet
        </div> -->

        <!-- Enter a referral code (only if user doesn't have a referrer yet) -->
        <div
          v-if="!hasReferrer"
          class="_bg-metallic-linear _shadow-panel _p-3 _rounded-lg _space-y-2"
        >
          <div class="_text-base">Have an invite?</div>
          <div class="_flex _items-center _gap-2">
            <input
              v-model="manualCode"
              type="text"
              placeholder="enter code or invite link"
              class="_flex-1 _bg-metallic-linear _shadow-panel-inset _rounded-lg _px-3 _h-10 _text-sm _min-w-0"
              :disabled="submitting"
              @keyup.enter="submitCode"
            />
            <button
              class="_bubble-btn _h-12 _text-sm _text-stroke-md _px-[1.5em] _font-bold"
              :disabled="!manualCode.trim() || submitting"
              :style="{
                filter:
                  manualCode.trim().length > 0 && !submitting
                    ? 'hue-rotate(20deg) saturate(3)'
                    : 'none'
              }"
              @click="submitCode"
            >
              <span :class="{ '_opacity-30': !manualCode.trim() || submitting }">
                {{ submitting ? 'Sending...' : 'Apply' }}
              </span>
            </button>
          </div>
          <div v-if="codeError" class="_text-xs _text-red-500">
            {{ codeError }}
          </div>
          <div v-if="codeSuccess" class="_text-xs _text-emerald-300">invite code applied!</div>
        </div>
        <div v-else class="_text-base">
          <div>
            invited by
            <span class="_font-semibold">
              {{ referrerName }}
            </span>
          </div>
          <div class="_text-xs _opacity-30 _mt-0.5">
            you'll both earn 10🪩 when you reach 100🪩!
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

const auth = inject('TrifleHub/store')
const { backendUrl } = storeToRefs(auth)

const loading = ref(true)
const error = ref(null)

const stats = ref({
  invited: 0,
  qualified: 0,
  points: 0
})

const referralCode = ref('')
const referrer = ref(null)

const hasReferrer = computed(() => !!referrer.value)

const manualCode = ref('')
const submitting = ref(false)
const codeError = ref('')
const codeSuccess = ref(false)

const copied = ref(false)
const copiedCode = ref(false)
const fallbackReferralCode = computed(() => auth?.user?.username || '')

const referrerName = computed(() => {
  if (!referrer.value) return 'someone'
  return referrer.value.username || referrer.value.displayName
})

const referralUrl = computed(() => {
  const code = referralCode.value || fallbackReferralCode.value
  if (!code) return ''
  const origin = window.location.origin
  return `${origin}#ref=${code}`
})
const referralUrlShort = computed(() => {
  return referralUrl.value.replace('https://', '')
})

const getAuthHeaders = () => {
  const headers = {
    'Content-Type': 'application/json'
  }
  if (auth?.authToken) {
    headers.Authorization = `Bearer ${auth.authToken}`
  }
  return headers
}

const fetchReferralProfile = async () => {
  loading.value = true
  error.value = null
  try {
    if (!backendUrl.value || !auth?.isAuthenticated) {
      loading.value = false
      return
    }
    const res = await fetch(`${backendUrl.value}/profile/me`, {
      headers: {
        Authorization: `Bearer ${auth.authToken}`
      }
    })

    let data: any = null
    try {
      data = await res.json()
    } catch (e) {
      // ignore JSON parse errors, we'll fall back to a generic message
    }

    if (!res.ok) {
      // Older backends may not implement /profile/me yet.
      // If it's a missing-route style error, quietly fall back
      // to showing the basic referral UI without stats.
      const msg = (data && data.error) || ''
      if (res.status === 404 || /no route matches/i.test(msg)) {
        loading.value = false
        return
      }

      error.value = msg || `failed to load referrals (status ${res.status})`
      return
    }

    stats.value = data.referralStats || { invited: 0, qualified: 0, points: 0 }
    referralCode.value = data.referralCode || ''
    referrer.value = data.referrer || null
  } catch (e) {
    console.error('Referral profile fetch error:', e)
    error.value = e.message || 'error loading referrals'
  } finally {
    loading.value = false
  }
}

const copyLink = () => {
  if (!referralUrl.value) return
  navigator.clipboard.writeText(referralUrl.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

const copyCode = () => {
  if (!referralCode.value || !fallbackReferralCode.value) return
  navigator.clipboard.writeText(referralCode.value || fallbackReferralCode.value)
  copiedCode.value = true
  setTimeout(() => {
    copiedCode.value = false
  }, 2000)
}

const extractRefCode = (input: string): string => {
  const trimmed = input.trim()
  try {
    const url = new URL(trimmed)
    // Check hash (#ref=CODE) first, then query string (?ref=CODE)
    if (url.hash) {
      const hashParams = new URLSearchParams(url.hash.substring(1))
      const ref = hashParams.get('ref')
      if (ref) return ref
    }
    const ref = url.searchParams.get('ref')
    if (ref) return ref
  } catch {
    // not a URL, use as-is
  }
  return trimmed
}

const submitCode = async () => {
  const code = extractRefCode(manualCode.value)
  if (!code || submitting.value) return

  submitting.value = true
  codeError.value = ''
  codeSuccess.value = false

  try {
    const res = await fetch(`${backendUrl.value}/profile/referral`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ referralCode: code })
    })
    const data = await res.json()

    if (!res.ok) {
      if (data.error === 'Already referred') {
        codeError.value = 'You already have a referrer'
      } else if (data.error === 'Invalid referral code') {
        codeError.value = 'Invalid referral code'
      } else if (data.error === 'Cannot refer yourself') {
        codeError.value = "You can't use your own code"
      } else {
        codeError.value = data.error || 'Something went wrong'
      }
      return
    }

    codeSuccess.value = true
    manualCode.value = ''

    await fetchReferralProfile()
  } catch (e) {
    console.error('Referral submit error:', e)
    codeError.value = e.message || 'Something went wrong'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchReferralProfile()
})
</script>
