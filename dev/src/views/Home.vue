<template>
  test provided functionality from balls-hub component
  <button>Open Balls Hub</button>
  <button>Open Reown Appkit Account Modal</button>
  <button @click="disconnectReownAccount">
    {{ isAuthenticated ? 'Disconnect' : isConnected ? 'Authenticate' : 'Connect' }} Reown Account
  </button>
</template>

<script setup>
import { inject, computed } from 'vue'
const store = inject('BallsHub/store')

const isAuthenticated = computed(() => store.isAuthenticated)
const isConnected = computed(() => store.accountConnected)

const disconnectReownAccount = () => {
  if (store.isAuthenticated) {
    store.disconnect()
  } else if (store.accountConnected) {
    store.authenticateWithWallet(store.accountAddress)
  } else {
    store.connectWallet()
  }
}
</script>

<style></style>
