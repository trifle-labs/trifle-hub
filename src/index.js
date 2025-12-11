import './style/index.css'
import TrifleHub from './TrifleHub.vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { WagmiPlugin } from '@wagmi/vue'
import { initializeWagmiConfig } from './config/wagmiConfig'
import { createPinia } from 'pinia'
import { useAuthStore } from './store'
import { defineAsyncComponent } from 'vue'

// Dynamic import for code splitting
const TrifleGuide = () => import('./components/TrifleGuide.vue')
const SwapBalls = () => import('./components/SwapBalls.vue')

const queryClient = new QueryClient()

/**
 * @typedef {Object} TrifleHubPluginOptions
 * @property {Object} reownConfig - Reown AppKit configuration (required)
 * @property {string} reownConfig.projectId - Reown project ID
 * @property {Object} [reownConfig.metadata] - App metadata
 * @property {string} [reownConfig.metadata.name] - App name
 * @property {string} [reownConfig.metadata.description] - App description
 * @property {string} [reownConfig.metadata.url] - App URL
 * @property {string[]} [reownConfig.metadata.icons] - App icons
 * @property {Array} [reownConfig.networks] - Blockchain networks
 * @property {Object} [reownConfig.features] - AppKit features configuration
 * @property {string[]} [reownConfig.featuredWalletIds] - Featured wallet IDs
 * @property {string} [reownConfig.themeMode] - Theme mode ('light' | 'dark')
 * @property {Object<string, string>} [reownConfig.themeVariables] - CSS theme variables
 * @property {Array} [connectors] - Wagmi connectors array
 * @property {string} [backendUrl] - Backend API URL (default: 'https://bot-staging.trifle.life')
 * @property {string} [defaultPage] - Default page to show when hub opens (default: 'welcome')
 * @property {import('pinia').Pinia} [devHookPiniaInstance] - Optional Pinia instance for devtools integration
 */

/**
 * TrifleHub Vue Plugin
 *
 * A Vue 3 plugin that provides authentication and wallet integration for Trifle Hub.
 *
 * @example
 * ```javascript
 * import { createApp } from 'vue'
 * import { TrifleHubVuePlugin } from '@trifle/trifle-hub'
 *
 * const app = createApp(App)
 *
 * app.use(TrifleHubVuePlugin, {
 *   reownConfig: {
 *     projectId: 'your-project-id',
 *     metadata: {
 *       name: 'My App',
 *       description: 'My App Description'
 *     }
 *   },
 *   backendUrl: 'https://api.example.com'
 * })
 * ```
 *
 * @type {import('vue').Plugin<TrifleHubPluginOptions>}
 */
const TrifleHubVuePlugin = {
  /**
   * Install the TrifleHub plugin
   *
   * @param {import('vue').App} app - Vue application instance
   * @param {TrifleHubPluginOptions} options - Plugin configuration options
   * @returns {Promise<void>}
   * @throws {Error} Throws if reownConfig is not provided
   */
  install: async (app, options = {}) => {
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

    const { wagmiConfig, appKit } = initializeWagmiConfig(options.reownConfig, options.connectors)

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

    // Register async components for code splitting
    app.component('TrifleGuide', defineAsyncComponent(TrifleGuide))
    app.component('SwapBalls', defineAsyncComponent(SwapBalls))
  }
}

/**
 * TrifleHub main component
 * @type {import('vue').Component}
 */
export { TrifleHubVuePlugin, TrifleHub, TrifleGuide, SwapBalls }

// export default TrifleHubVuePlugin
