<template>
  <div class="_flex _w-full _gap-2 _rounded-lg _overflow-hidden">
    <!-- Left: wallet info button -->
    <button
      class="_platform-login-btn _bubble-btn _p-4.5 flex-1 basis-1/2 min-w-0"
      :style="{
        filter: `hue-rotate(${platform.bubbleButtonStyle.hueRotate}deg) saturate(${
          platform.bubbleButtonStyle.saturate
        }) brightness(${platform.bubbleButtonStyle.brightness || 1})`
      }"
      @click="openAccountModal"
      :disabled="authenticating"
      type="button"
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
            alt="wallet icon"
          />
        </div>
        <div
          class="_flex-1 _min-w-0 _truncate _text-center _text-stroke-md _leading-snug _overflow-hidden"
        >
          {{ displayName }}
        </div>
      </div>
    </button>
    <!-- Right: authenticate button -->
    <button
      class="_platform-login-btn _bubble-btn _p-4.5 flex-1 basis-1/2 min-w-0"
      :style="{
        filter: `hue-rotate(${platform.bubbleButtonStyle.hueRotate}deg) saturate(${
          platform.bubbleButtonStyle.saturate
        }) brightness(${platform.bubbleButtonStyle.brightness || 1})`
      }"
      @click="authenticate"
      :disabled="authenticating"
      type="button"
    >
      <div class="_flex-1 _min-w-0 _truncate _text-center _text-stroke-md _leading-snug">
        <span v-if="!authenticating">Authenticate</span>
        <span v-else>Authenticating...</span>
      </div>
    </button>
  </div>
</template>

<script setup>
import { platforms } from '../config/socialsConfig'
console.log({ platforms })
const platform = platforms.wallet

import { inject, ref } from 'vue'
const props = defineProps({
  walletAddress: String,
  walletAvatar: String,
  displayName: String,
  points: String
})
const auth = inject('TrifleHub/store')
const authenticating = ref(false)

const openAccountModal = async () => {
  try {
    await auth.openAccountModal()
  } catch (e) {
    auth.addNotification({ type: 'error', message: "Couldn't open wallet modal" })
  }
}

const authenticate = async () => {
  authenticating.value = true
  try {
    await auth.authenticateWithWallet(props.walletAddress)
  } catch (e) {
    auth.addNotification({ type: 'error', message: 'Authentication failed' })
  } finally {
    authenticating.value = false
  }
}
</script>

<style scoped>
._platform-login-btn[disabled] {
  filter: grayscale(100%) !important;
}
._rounded-r-none {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}
._rounded-l-none {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}
</style>
