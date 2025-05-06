<template>
  <slot />
  <Hub v-model:hubOpen="hubOpen" :hubPageKey="hubPageKey" />
</template>

<script setup>
import { useAppKit, useAppKitEvents } from '@reown/appkit/vue'
import { useAccount, useDisconnect } from '@wagmi/vue'
import { signMessage } from '@wagmi/core'
import { computed, inject, provide, ref, watch } from 'vue'
// import { wagmiConfig } from '../config/wagmiConfig'
import { useRoute } from 'vue-router'
import hubPages from './pages/config'
import Hub from './Hub.vue'

const wagmiConfig = inject('wagmiConfig')

/* HUB OPEN/CLOSE */
const route = useRoute()
const hubOpen = ref(route.query.hub !== undefined)
const hubPageKey = ref('welcome') //route.query.hub || sessionStorage.getItem('hubPageKey') || 'welcome')

provide('hub', {
  hubOpen,
  openHub: (page) => {
    hubOpen.value = true
    return page && (hubPageKey.value = page)
  },
  closeHub: async () => {
    hubOpen.value = false
  }
})

watch(hubPageKey, (val) => {
  if (!Object.keys(hubPages).includes(val)) {
    console.warn(`hubPageKey ${val} not found in hubPages. removing from sessionStorage`)
    sessionStorage.removeItem('hubPageKey')
    return
  }
  sessionStorage.setItem('hubPageKey', val)
})

/* ACCOUNT */
const emit = defineEmits(['connected', 'disconnected'])

const { address, isConnected, chainId, isConnecting } = useAccount({
  config: wagmiConfig
})
const { disconnect } = useDisconnect({ config: wagmiConfig })

const addr = computed(() => address.value?.toLowerCase())

provide('account', { address: addr, chainId, isConnected, isConnecting })

watch(
  addr,
  (address) => {
    return address ? emit('connected', address) : emit('disconnected')
  },
  { immediate: true }
)

const { open } = useAppKit()

async function openAccountModal() {
  try {
    await open()
    return true
  } catch (e) {
    console.error(e)
    throw new Error("Oops, couldn't open Connect.")
  }
}

async function enforceConnection() {
  if (!isConnected.value) {
    await openAccountModal()
    await waitForConnection()
  }
  return true
}

const events = useAppKitEvents()

function signDiscordId(message) {
  return signMessage(wagmiConfig, { message })
}

function waitForConnection() {
  return new Promise((resolve, reject) => {
    const stopWatch = watch(
      [isConnected, events],
      (newValues) => {
        const [connected, events] = newValues
        if (connected) {
          stopWatch()
          resolve()
        } else if (events?.data?.event === 'MODAL_CLOSE') {
          stopWatch()
          reject('rejected')
        }
      },
      { deep: true, immediate: true }
    )
  })
}
provide('accountModal', {
  disconnect,
  openAccountModal,
  enforceConnection,
  signDiscordId
})
</script>
