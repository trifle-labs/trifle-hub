<template>
  <div class="_space-y-3 _mt-2 _mb-0.5">
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

    <div v-if="!twitterLoadingFeatured" class="_flex _items-center _justify-between _gap-3 _w-full">
      <div class="_w-full _flex _items-center _justify-evenly _text-em-smff">
        <template v-if="featuredTweet?.url">
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
            {{ mode === 'like' ? 'Verify Like' : 'Verify Reply' }}
          </span>
        </button>
      </div>
      <div class="_text-em-xs _text-zinc-500 _text-right" v-if="twitterEngagement">
        <span v-if="mode === 'like' && twitterEngagement.liked">Like detected</span>
        <span v-else-if="mode === 'reply' && twitterEngagement.replied">Reply detected</span>
      </div>
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
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import TwitterTweetSummary from './TwitterTweetSummary.vue'

const props = defineProps({
  mode: {
    type: String,
    required: true,
    validator: (v) => v === 'like' || v === 'reply'
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
    if (data.tweetId && (data.liked || data.replied)) {
      twitterEngagement.value = {
        tweetId: data.tweetId,
        liked: !!data.liked,
        replied: !!data.replied,
        likeAwarded: false,
        replyAwarded: false
      }
    }
  } catch (err) {
    console.error('Error fetching twitter status:', err)
  }
}

const verifyTwitterEngagement = async () => {
  twitterLoadingEngagement.value = true
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    }
    const body = featuredTweet.value?.id ? { tweetId: featuredTweet.value.id } : {}
    const response = await fetch(`${backendUrl.value}/twitter/verify-engagement`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data?.error || 'Engagement verification failed')
    }
    twitterEngagement.value = data
    if (data.likeAwarded || data.replyAwarded) {
      emit('points-updated')
    }
    return data
  } finally {
    twitterLoadingEngagement.value = false
  }
}

const handleVerify = async () => {
  errorMsg.value = null
  successMsg.value = null
  try {
    const beforeLiked = twitterEngagement.value?.liked || false
    const beforeReplied = twitterEngagement.value?.replied || false

    const data = await verifyTwitterEngagement()

    const nowLiked = data?.liked || false
    const nowReplied = data?.replied || false

    if (props.mode === 'like') {
      if (!beforeLiked && !nowLiked) {
        errorMsg.value =
          "Your like wasn't detected yet — it can take a minute to show up. Try again shortly."
      } else if (nowLiked) {
        successMsg.value = 'Like verified!'
      }
    } else if (props.mode === 'reply') {
      if (!beforeReplied && !nowReplied) {
        errorMsg.value =
          "Your reply wasn't detected yet — it can take a minute to show up. Try again shortly."
      } else if (nowReplied) {
        successMsg.value = 'Reply verified!'
      }
    }
  } catch (err) {
    errorMsg.value = err?.message || 'Verification failed. Please try again.'
  }
}

onMounted(() => {
  fetchFeaturedTweet()
  fetchTwitterStatus()
})
</script>
