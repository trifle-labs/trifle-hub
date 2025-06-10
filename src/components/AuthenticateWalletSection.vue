<template>
  <section
    class="_flex _flex-col _gap-2ff _bg-metallic-linear _shadow-panel _rounded-lg _p-3 _gap-3"
  >
    <div class="_flex _items-center _justify-between _gap-3">
      <div class="_flex _items-center _gap-2.5 _min-w-0">
        <img
          src="../assets/imgs/ethereum-logo-white.svg"
          class="_size-7 _rounded-md"
          style="background-color: #f1584d"
        />

        <div class="_flex-1 _min-w-0 _leading-tight">
          <div class="_flex-1 _min-w-0 _truncate _text-em-lg _text-gray-500">
            {{ displayName }}
          </div>
          <!-- <div class="_text-em-2xs _text-gray-500 _leading-none">connected, unverified</div> -->
        </div>
      </div>
      <!-- (disconnect wallet button) -->
      <button
        class="_bubble-btn _h-10 _text-sm _text-stroke-md _px-[1em]"
        aria-label="Disconnect wallet"
        @click="disconnect"
        title="Disconnect wallet"
      >
        <span>⛌</span>
      </button>
    </div>
    <button
      class="_platform-login-btn _bubble-btn _p-4.5 flex-1 basis-1/2ff min-w-0"
      :style="{
        filter: `hue-rotate(${platform.bubbleButtonStyle.hueRotate}deg) saturate(${
          platform.bubbleButtonStyle.saturate
        }) brightness(${platform.bubbleButtonStyle.brightness || 1})`
      }"
      @click="authenticate"
      :disabled="authenticating"
    >
      <div class="_flex-1 _min-w-0 _truncate _text-center _text-stroke-md _leading-snug">
        <span v-if="authenticating" class="_animate-pulse-deep">Confirm in your wallet...</span>
        <template v-else>Finish Wallet Login</template>
      </div>
    </button>
  </section>
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

const disconnect = async () => {
  try {
    await auth.disconnect()
    auth.addNotification({ message: 'Wallet disconnected' })
  } catch (e) {
    console.error(e)
    auth.addNotification({ type: 'error', message: 'Failed to disconnect wallet' })
  }
}

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
