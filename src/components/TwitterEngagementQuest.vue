<template>
  <div class="_space-y-3 _mt-2 _mb-0.5">
    <!-- Tweet summary (like/reply modes only) -->
    <template v-if="mode !== 'follow'">
      <TwitterTweetSummary v-if="featuredTweet" :tweet="featuredTweet" class="_text-sm" />
      <p
        v-else
        class="_text-em-xs _text-zinc-500 _text-center _border-2 _border-dashed _border-black/30 _rounded-lg _p-3"
      >
        {{
          twitterLoadingFeatured
            ? 'Loading latest tweet...'
            : 'No featured tweet available right now.'
        }}
      </p>
    </template>

    <div
      v-if="mode === 'follow' || !twitterLoadingFeatured"
      class="_flex _items-center _justify-between _gap-3 _w-full"
    >
      <template v-if="isVerifiedForCurrentTweet">
        <div class="_w-full _text-em-xs _text-zinc-500 _text-center">
          <span v-if="mode === 'like'">Like detected</span>
          <span v-else-if="mode === 'reply'">Reply detected</span>
          <span v-else-if="mode === 'follow'">Follow detected</span>
        </div>
      </template>
      <template v-else>
        <div class="_w-full _flex _items-center _justify-evenly _text-em-smff">
          <template v-if="mode === 'follow'">
            <a
              :href="followUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="_underline _inline-block _animate-wiggle-sm"
              @click.stop
            >
              Follow on X
            </a>
            <div class="_text-zinc-500">then...</div>
          </template>
          <template v-else-if="featuredTweet?.url">
            <a
              :href="featuredTweet.url"
              target="_blank"
              rel="noopener noreferrer"
              class="_underline _inline-block _animate-wiggle-sm"
              @click.stop
            >
              {{ mode === 'like' ? 'Like on X' : 'Reply on X' }}
            </a>
            <div class="_text-zinc-500">then...</div>
          </template>
          <button
            class="_bubble-btn _px-5 _py-3 _text-em-smff"
            :disabled="twitterLoadingEngagement || !isAuthenticated"
            style="filter: hue-rotate(20deg) saturate(3)"
            @click.stop="handleVerify"
          >
            <span>
              {{
                mode === 'like'
                  ? 'Verify Like'
                  : mode === 'reply'
                    ? 'Verify Reply'
                    : 'Verify Follow'
              }}
            </span>
          </button>
        </div>
      </template>
    </div>

    <p
      v-if="errorMsg || successMsg || twitterLoadingEngagement"
      class="_mt-0.5 _text-em-xs _text-center _bg-metallic-linear _shadow-panel _rounded-lg _p-3"
      :class="
        twitterLoadingEngagement ? '_text-zinc-600' : errorMsg ? '_text-red-600' : '_text-primary'
      "
    >
      {{ twitterLoadingEngagement ? 'Checking...' : errorMsg || successMsg }}
    </p>

    <div v-if="needsReconnect" class="_flex _justify-center">
      <button
        class="_bubble-btn _px-5 _py-3 _text-em-smff"
        style="filter: hue-rotate(-340deg) saturate(1.8)"
        @click.stop="reconnectTwitter"
      >
        <span style="filter: hue-rotate(340deg) saturate(0.5)">Reconnect Twitter</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import TwitterTweetSummary from './TwitterTweetSummary.vue'

const props = defineProps({
  mode: {
    type: String,
    required: true,
    validator: (v) => v === 'like' || v === 'reply' || v === 'follow'
  }
})

const emit = defineEmits(['points-updated'])

const auth = inject('TrifleHub/store')
const { backendUrl, isAuthenticated } = storeToRefs(auth)

const featuredTweet = ref(null)
const twitterEngagement = ref(null)
const twitterLoadingFeatured = ref(false)
const twitterLoadingEngagement = ref(false)
const errorMsg = ref(null)
const successMsg = ref(null)
const needsReconnect = ref(false)

const followUrl = 'https://trifle.life/twitter'

const isVerifiedForCurrentTweet = computed(() => {
  if (!twitterEngagement.value) return false
  if (props.mode === 'follow') return !!twitterEngagement.value.followed
  if (!featuredTweet.value) return false
  if (twitterEngagement.value.tweetId !== featuredTweet.value.id) return false
  if (props.mode === 'like') return !!twitterEngagement.value.liked
  if (props.mode === 'reply') return !!twitterEngagement.value.replied
  return false
})

const getAuthHeaders = () => {
  const token = auth.authToken
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

const fetchFeaturedTweet = async () => {
  twitterLoadingFeatured.value = true
  try {
    const response = await fetch(`${backendUrl.value}/twitter/featured-tweet`)
    if (!response.ok) return
    featuredTweet.value = await response.json()
  } catch (err) {
    console.error('Error fetching featured tweet:', err)
  } finally {
    twitterLoadingFeatured.value = false
  }
}

const fetchTwitterStatus = async () => {
  try {
    const headers = getAuthHeaders()
    if (!headers.Authorization) return
    const response = await fetch(`${backendUrl.value}/twitter/my-status`, {
      headers
    })
    if (!response.ok) return
    const data = await response.json()
    if (data.followed || (data.tweetId && (data.liked || data.replied))) {
      twitterEngagement.value = {
        tweetId: data.tweetId,
        liked: !!data.liked,
        replied: !!data.replied,
        followed: !!data.followed
      }
    }
  } catch (err) {
    console.error('Error fetching twitter status:', err)
  }
}

const verifyEndpoint = async (endpoint) => {
  twitterLoadingEngagement.value = true
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    }
    const body = featuredTweet.value?.id ? { tweetId: featuredTweet.value.id } : {}
    const response = await fetch(`${backendUrl.value}/twitter/${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    })
    const data = await response.json()
    if (!response.ok) {
      if (data.reconnectRequired) {
        needsReconnect.value = true
      }
      throw new Error(data?.error || 'Verification failed')
    }
    return data
  } finally {
    twitterLoadingEngagement.value = false
  }
}

const handleVerify = async () => {
  errorMsg.value = null
  successMsg.value = null
  needsReconnect.value = false
  try {
    const endpoints = { like: 'verify-like', reply: 'verify-reply', follow: 'verify-follow' }
    const labels = { like: 'Like', reply: 'Reply', follow: 'Follow' }
    const engagementKeys = { like: 'liked', reply: 'replied', follow: 'followed' }

    const data = await verifyEndpoint(endpoints[props.mode])

    if (data.verified) {
      successMsg.value = `${labels[props.mode]} verified!`
      twitterEngagement.value = {
        ...twitterEngagement.value,
        ...(data.tweetId ? { tweetId: data.tweetId } : {}),
        [engagementKeys[props.mode]]: true
      }
      if (data.pointsAwarded) {
        emit('points-updated')
      }
    } else {
      errorMsg.value =
        data.message ||
        `Your ${labels[props.mode].toLowerCase()} wasn't detected yet — it can take a minute to show up. Try again shortly.`
    }
  } catch (err) {
    errorMsg.value = err?.message || 'Verification failed. Please try again.'
  }
}

const reconnectTwitter = () => {
  auth.connectTwitter()
}

onMounted(() => {
  if (props.mode !== 'follow') {
    fetchFeaturedTweet()
  }
  fetchTwitterStatus()
})
</script>
