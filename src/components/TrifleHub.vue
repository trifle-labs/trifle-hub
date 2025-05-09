<template>
  <slot />
  <Hub v-model:hubOpen="hubOpen" :hubPageKey="hubPageKey" :position="props.position" />
</template>

<script setup>
import { provide, ref, watch, inject, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import hubPages from './pages/config'
import Hub from './Hub.vue'
const store = inject('TrifleHub/store')

const props = defineProps({
  position: {
    type: String,
    default: 'bottom-left'
  }
})

onMounted(() => {
  console.log('TrifleHub mounted')
})

/* HUB OPEN/CLOSE */
const route = useRoute()
const hubOpen = ref(route.query.hub !== undefined)
const hubPageKey = ref(route.query.hub || sessionStorage.getItem('hubPageKey') || 'welcome')

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

// TODO: delete everything below here once backwards compatibility is no longer needed
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
