import './style/index.css'
import Index from './components/Index.vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { WagmiPlugin } from '@wagmi/vue'
import { initializeWagmiConfig } from './config/wagmiConfig'

export { initializeWagmiConfig, BallsHubVuePlugin }

const queryClient = new QueryClient()

const BallsHubVuePlugin = {
  install: (app, options = {}) => {
    if (!options.wagmiConfig) {
      throw new Error('wagmiConfig is required when installing BallsHub')
    }
    app.provide('wagmiConfig', options.wagmiConfig)
    app.use(VueQueryPlugin, { queryClient })
    app.use(WagmiPlugin, { config: options.wagmiConfig })
    app.component('TrifleHub', Index)
  }
} 

export default BallsHubVuePlugin