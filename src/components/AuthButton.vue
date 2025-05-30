<template>
  <button
    class="_platform-login-btn _bubble-btn _p-4.5"
    :style="{
      filter: `hue-rotate(${platform.hueRotate}deg) saturate(${platform.saturate}) brightness(${
        platform.brightness || 1
      })`
    }"
    @click="props.click || handleConnect(props.platform)"
  >
    <div
      class="_flex _justify-between _items-center _gap-2.5"
      :style="{
        filter: `hue-rotate(${platform.hueRotate * -1}deg) saturate(${1 / platform.saturate})`
      }"
    >
      <div class="_size-7 _rounded-lg _overflow-hidden">
        <img
          :src="platform.icon"
          class="_w-full"
          :style="{ backgroundColor: platform.iconBgColor }"
        />
      </div>
      <div class="_flex-1 _min-w-0 _truncate _text-center">
        <slot />
      </div>
      <div class="_size-7 _flex _justify-end _items-center">
        <!-- (points) -->
        <div
          v-if="props.points"
          class="_whitespace-nowrap _leading-tight _pr-0.5 _pl-1 _bg-[rgba(250,250,255)]/40 _rounded-lg _text-[0.875em]"
        >
          {{ props.points }} 🪩
        </div>
      </div>
    </div>
  </button>
</template>

<script setup>
import ethereumLogo from '../assets/imgs/ethereum-logo-white.svg'
import discordLogo from '../assets/imgs/discord-logo.svg'
import farcasterLogo from '../assets/imgs/farcaster-logo.svg'
import { computed, inject } from 'vue'
// import telegramLogo from '../assets/imgs/telegram-logo.svg'
// import twitterLogo from '../assets/imgs/twitter-x-logo.svg'

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

const platforms = {
  wallet: {
    icon: ethereumLogo,
    iconBgColor: '#f1584d',
    hueRotate: -236,
    saturate: 1.5
  },
  discord: {
    icon: discordLogo,
    hueRotate: -345,
    saturate: 2
  },
  farcaster: {
    icon: farcasterLogo,
    hueRotate: -335,
    saturate: 2
  }
  // telegram: {
  //   icon: telegramLogo,
  //   hueRotate: -20,
  //   saturate: 1.8,
  //   connect: handleTelegramConnect
  // },
  // twitter: {
  //   icon: twitterLogo,
  //   hueRotate: 0,
  //   saturate: 1,
  //   brightness: 0.8,
  //   connect: handleTwitterConnect
  // }
}

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
  }
}

const handleWalletConnect = async () => {
  try {
    await auth.connectWallet()
  } catch (err) {
    console.error('Wallet connection failed:', err)
  }
}

const handleDiscordConnect = async () => {
  try {
    await auth.connectDiscord()
  } catch (err) {
    if (err.message.includes('Authentication window closed')) {
      auth.addNotification({
        type: 'error',
        message: 'Discord authentication failed, please try again.'
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
