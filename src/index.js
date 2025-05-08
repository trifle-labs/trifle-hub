import './style/index.css'
import Index from './components/Index.vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { WagmiPlugin } from '@wagmi/vue'
import { initializeWagmiConfig } from './config/wagmiConfig'
import { createPinia } from 'pinia'
import { useAuthStore } from './store'
export { BallsHubVuePlugin }

const queryClient = new QueryClient()

const BallsHubVuePlugin = {
  install: async (app, options = {}) => {
    console.log('install')
    if (!options.reownConfig) {
      throw new Error('reownConfig is required when installing BallsHub')
    }

    const { wagmiConfig, appKit } = await initializeWagmiConfig(options.reownConfig)
    app.provide('BallsHub/wagmiConfig', wagmiConfig)
    app.provide('BallsHub/appKit', appKit)

    let piniaInstanceForPlugin

    if (options.devHookPiniaInstance) {
      // If a Pinia instance is passed for devtools hook, use it
      piniaInstanceForPlugin = options.devHookPiniaInstance
    } else {
      // Otherwise, create a new internal, encapsulated Pinia instance
      piniaInstanceForPlugin = createPinia()
    }
    // Provide this instance (either the hooked one or the new internal one)
    // for your plugin's components to inject.
    const store = useAuthStore(piniaInstanceForPlugin)
    store.initializeAuth(appKit, wagmiConfig)

    app.provide('trifleHubInternalPinia', piniaInstanceForPlugin)
    console.log({ store })
    app.provide('BallsHub/store', store)

    app.use(VueQueryPlugin, { queryClient })
    app.use(WagmiPlugin, { config: wagmiConfig })

    app.component('TrifleHub', Index)
  }
}

export default BallsHubVuePlugin
