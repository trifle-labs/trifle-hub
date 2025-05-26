import './style/index.css'
import TrifleHub from './components/TrifleHub.vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { WagmiPlugin } from '@wagmi/vue'
import { initializeWagmiConfig } from './config/wagmiConfig'
import { createPinia } from 'pinia'
import { useAuthStore } from './store'
export { TrifleHubVuePlugin, TrifleHub }

const queryClient = new QueryClient()

const TrifleHubVuePlugin = {
  install: async (app, options = {}) => {
    console.log('install')
    if (!options.reownConfig) {
      throw new Error('reownConfig is required when installing TrifleHub')
    }

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
    options.backendUrl = options.backendUrl || 'https://bot-staging.trifle.life'
    const store = useAuthStore(piniaInstanceForPlugin)

    const { wagmiConfig, appKit } = initializeWagmiConfig(options.reownConfig)

    app.provide('TrifleHub/wagmiConfig', wagmiConfig)
    app.provide('TrifleHub/appKit', appKit)

    // Provide defaultPage if specified
    app.provide('TrifleHub/defaultPage', options.defaultPage || 'welcome')

    store.initializeAuth(appKit, wagmiConfig, options.backendUrl)

    app.use(WagmiPlugin, { config: wagmiConfig })

    app.provide('trifleHubInternalPinia', piniaInstanceForPlugin)
    app.provide('TrifleHub/store', store)

    app.use(VueQueryPlugin, { queryClient })

    app.component('TrifleHub', TrifleHub)
  }
}

export default TrifleHubVuePlugin
