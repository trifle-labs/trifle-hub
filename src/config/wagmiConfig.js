import { createAppKit } from '@reown/appkit/vue'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet } from '@reown/appkit/networks'

// Default configuration
const defaultConfig = {
  projectId: '',
  metadata: {
    name: 'Trifle Auth',
    description: 'Authenticate your account with Trifle',
    url: typeof window !== 'undefined' ? window.location.origin : '',
    icons: []
  },
  networks: [mainnet],
  features: {
    analytics: true,
    email: false,
    socials: ['google', 'x', 'github', 'discord', 'apple', 'facebook', 'farcaster'],
    emailShowWallets: true
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-font-size-master': '13px'
  }
}

export function initializeWagmiConfig(config) {
  const finalConfig = {
    ...defaultConfig,
    ...config,
    metadata: {
      ...defaultConfig.metadata,
      ...config.metadata
    },
    features: {
      ...defaultConfig.features,
      ...config.features
    }
  }

  // Create Wagmi Adapter
  const wagmiAdapter = new WagmiAdapter({
    projectId: finalConfig.projectId,
    networks: finalConfig.networks
  })

  // Create modal
  createAppKit({
    adapters: [wagmiAdapter],
    networks: finalConfig.networks,
    metadata: finalConfig.metadata,
    projectId: finalConfig.projectId,
    features: finalConfig.features,
    themeMode: finalConfig.themeMode,
    themeVariables: finalConfig.themeVariables
  })

  return wagmiAdapter.wagmiConfig
}

// Export a default config for backward compatibility
// export const wagmiConfig = initializeWagmiConfig({})
