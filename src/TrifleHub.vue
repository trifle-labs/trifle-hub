<template>
  <slot />
  <Hub v-model:hubOpen="hubOpen" :hubPageKey="hubPageKey" :position="props.position" />
</template>

<script setup>
import { provide, ref, watch, inject, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import hubPages from './routes'
import Hub from './components/Hub.vue'
const store = inject('TrifleHub/store')
const props = defineProps({
  position: {
    type: String,
    default: 'bottom-left'
  }
})

const defaultPage = inject('TrifleHub/defaultPage', 'welcome')

onMounted(() => {
  console.log('TrifleHub mounted')
})

/* HUB OPEN/CLOSE */
const route = useRoute()
const hubOpen = ref(route.query.hub !== undefined)
const hubPageKey = ref(route.query.hub || sessionStorage.getItem('hubPageKey') || defaultPage)

const watcherCleanup = { stop: null, timeout: null }
let resolveFunction = null
const hubActions = {
  hubOpen,
  openHub: (page, closeAfterLogin = false, { timeoutPeriod = 5 * 60 * 1_000 } = {}) => {
    hubOpen.value = true
    store.closeHubAfterLogin = closeAfterLogin

    // Clean up any previous watcher/timeout
    if (watcherCleanup.stop) {
      watcherCleanup.stop()
      watcherCleanup.stop = null
    }
    if (watcherCleanup.timeout) {
      clearTimeout(watcherCleanup.timeout)
      watcherCleanup.timeout = null
    }

    // Only set up watcher if not already authenticated and closeAfterLogin is true
    if (closeAfterLogin && !store.isAuthenticated) {
      const closedPromise = new Promise((resolve) => {
        resolveFunction = resolve
        const stop = watch(
          () => store.isAuthenticated,
          (val) => {
            if (val && store.closeHubAfterLogin) {
              store.closeHubAfterLogin = false
              if (watcherCleanup.stop) watcherCleanup.stop()
              if (watcherCleanup.timeout) clearTimeout(watcherCleanup.timeout)
              watcherCleanup.stop = null
              watcherCleanup.timeout = null
              hubOpen.value = false

              resolve()
            }
          },
          { immediate: false }
        )
        watcherCleanup.stop = stop
        watcherCleanup.timeout = setTimeout(() => {
          if (watcherCleanup.stop) watcherCleanup.stop()
          watcherCleanup.stop = null
          watcherCleanup.timeout = null
        }, timeoutPeriod)
      })
      return closedPromise
    }
    return page && (hubPageKey.value = page)
  },
  closeHub: async () => {
    hubOpen.value = false
    // Clean up watcher/timeout on close
    if (watcherCleanup.stop) {
      watcherCleanup.stop()
      watcherCleanup.stop = null
    }
    if (watcherCleanup.timeout) {
      clearTimeout(watcherCleanup.timeout)
      watcherCleanup.timeout = null
    }
    if (resolveFunction) {
      resolveFunction()
      resolveFunction = null
    }
  },
  goToPage: (page) => {
    if (!hubPages[page]) {
      throw new Error(`Page '${page}' not found in TrifleHub`)
    }
    hubPageKey.value = page
  },
  getAvailablePages: () => Object.keys(hubPages)
}
store.setCloseHubCallback(hubActions.closeHub)
provide('hub', hubActions)

watch(hubPageKey, (val) => {
  if (!Object.keys(hubPages).includes(val)) {
    console.warn(`hubPageKey ${val} not found in hubPages. removing from sessionStorage`)
    sessionStorage.removeItem('hubPageKey')
    return
  }
  sessionStorage.setItem('hubPageKey', val)
})

// TODO: delete everything below here once backwards compatibility is no longer needed (after installed in anybody and kudzu)
const emit = defineEmits(['connected', 'disconnected'])
const address = computed(() => store?.accountAddress)
const chainId = computed(() => store?.accountChainId)
const isConnected = computed(() => store?.accountConnected)
const isConnecting = computed(() => store?.authSteps?.wallet?.connecting)
provide('account', { address, chainId, isConnected, isConnecting })
watch(
  address,
  (address) => {
    return address ? emit('connected', address) : emit('disconnected')
  },
  { immediate: true }
)
const disconnect = () => store.disconnect()
const openAccountModal = () => store.openAccountModal()
const enforceConnection = () => store.enforceConnection()
const signDiscordId = (message) => store.signDiscordId(message)
provide('accountModal', {
  disconnect,
  openAccountModal,
  enforceConnection,
  signDiscordId
})
</script>
