<template>
  <button
    class="_platform-login-btn _bubble-btn-full _p-4.5"
    :style="{
      filter: `hue-rotate(${platform.bubbleButtonStyle.hueRotate}deg) saturate(${
        platform.bubbleButtonStyle.saturate
      }) brightness(${platform.bubbleButtonStyle.brightness || 1})`
    }"
    @click="props.click || handleConnect(props.platform)"
  >
    <div
      class="_flex _justify-between _items-center _gap-2.5"
      :style="{
        filter: `hue-rotate(${platform.bubbleButtonStyle.hueRotate * -1}deg) saturate(${
          1 / platform.bubbleButtonStyle.saturate
        })`
      }"
    >
      <div class="_size-7 _rounded-lg _overflow-hidden">
        <img
          :src="platform.icon"
          class="_w-full"
          :style="{ backgroundColor: platform.iconBgColor }"
        />
      </div>
      <div class="_flex-1 _min-w-0 _truncate _text-center _text-stroke-md _leading-snug">
        <slot />
      </div>
      <div class="_size-7 _flex _justify-end _items-center">
        <!-- (points) -->
        <div
          v-if="props.points"
          class="_whitespace-nowrap _leading-snug _pr-[0.25em] _pl-[0.4em] _shadow-panel-inset _rounded-full _text-[0.875em] _tracking-tight"
        >
          {{ props.points }} 🪩
        </div>
      </div>
    </div>
  </button>
</template>

<script setup>
import { computed, inject } from 'vue'
import { platforms } from '../config/socialsConfig'

const props = defineProps({
  platform: {
    type: String,
    default: 'wallet'
  },
  points: {
    type: String,
    default: undefined
  }
})

// const platforms = {
//   wallet: {
//     icon: ethereumLogo,
//     iconBgColor: '#f1584d',
//     hueRotate: -236,
//     saturate: 1.5
//   },
//   discord: {
//     icon: discordLogo,
//     hueRotate: -345,
//     saturate: 2
//   },
//   farcaster: {
//     icon: farcasterLogo,
//     hueRotate: -335,
//     saturate: 2
//   }
//   // telegram: {
//   //   icon: telegramLogo,
//   //   hueRotate: -20,
//   //   saturate: 1.8,
//   //   connect: handleTelegramConnect
//   // },
//   // twitter: {
//   //   icon: twitterLogo,
//   //   hueRotate: 0,
//   //   saturate: 1,
//   //   brightness: 0.8,
//   //   connect: handleTwitterConnect
//   // }
// }

const platform = computed(() => platforms[props.platform])

const auth = inject('TrifleHub/store')

let connectDebounce = false
const handleConnect = async (platform) => {
  if (connectDebounce) return
  connectDebounce = true
  setTimeout(() => {
    connectDebounce = false
  }, 1000)
  switch (platform) {
    case 'discord':
      await handleDiscordConnect()
      break
    case 'farcaster':
      await handleFarcasterConnect()
      break
    case 'wallet':
      await handleWalletConnect()
      break
    default:
      throw new Error(`Unsupported platform: ${platform}`)
  }
}

const handleFarcasterConnect = async () => {
  console.log('Farcaster connect clicked')
  try {
    await auth.connectFarcaster()
  } catch (err) {
    console.error('Farcaster connection failed:', err)
    auth.addNotification({
      type: 'error',
      message: 'Farcaster login failed. Try again?'
    })
  }
}

const handleWalletConnect = async () => {
  try {
    await auth.connectWallet()
  } catch (err) {
    console.error('Wallet connection failed:', err)
    auth.addNotification({
      type: 'error',
      message: 'Wallet login failed. Try again?'
    })
  }
}

const handleDiscordConnect = async () => {
  try {
    await auth.connectDiscord()
  } catch (err) {
    if (err.message.includes('Authentication window closed')) {
      auth.addNotification({
        type: 'error',
        message: 'Discord login failed. Try again?'
      })
    }
    console.error('Discord connection failed:', err)
  }
}

// const handleTelegramConnect = async () => {
//   if (!telegramEnabled.value) return
//   console.log('Telegram connect clicked (feature not fully implemented yet)')
// }

// const handleTwitterConnect = async () => {
//   if (!twitterEnabled.value) return
//   console.log('Twitter connect clicked (feature not fully implemented yet)')
// }
</script>

<style>
._platform-login-btn[disabled] {
  filter: grayscale(100%) !important;
}
</style>
