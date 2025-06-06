<template>
  test provided functionality from balls-hub component
  <div class="_flex _flex-wrap _w-1/2 _gap-2 _whitespace-nowrap">
    <button class="_border" @click="openHub('games')">Open Balls Hub</button>
    <!-- <button class="_border" @click="hubButtonHidden = !hubButtonHidden">Toggle Hub Button</button> -->
    <button class="_border">Open Reown Appkit Account Modal</button>
    <button class="_border" @click="disconnectReownAccount">
      {{ isAuthenticated ? 'Disconnect' : isConnected ? 'Authenticate' : 'Connect' }} Reown Account
    </button>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue'
const store = inject('TrifleHub/store')
const { openHub } = inject('hub')

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
