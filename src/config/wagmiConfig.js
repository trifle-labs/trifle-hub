import { createAppKit } from '@reown/appkit/vue'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, base } from '@reown/appkit/networks'
import { farcasterFrame as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'
import { sdk } from '@farcaster/miniapp-sdk'
// Default configuration
const defaultConfig = {
  projectId: '',
  metadata: {
    name: 'Trifle Auth',
    description: 'Authenticate your account with Trifle',
    url: typeof window !== 'undefined' ? window.location.origin : '',
    icons: []
  },
  networks: [mainnet, base],
  enableNetworkSwitch: true,
  allowUnsupportedChain: true,
  features: {
    analytics: true,
    email: true,
    socials: [], //['google', 'x', 'github', 'discord', 'apple', 'facebook', 'farcaster'],
    emailShowWallets: true
  },
  // coinbasePreference: 'smartWalletOnly',
  featuredWalletIds: [
    'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa' // coinbase
    // '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369' // rainbow
  ],
  themeMode: 'light',
  themeVariables: {
    '--w3m-font-size-master': '13px'
  }
}

export async function initializeWagmiConfig(config) {
  const finalConfig = {
    ...defaultConfig,
    ...(config || {}),
    metadata: {
      ...defaultConfig.metadata,
      ...(config.metadata || {})
    },
    networks: [...defaultConfig.networks, ...(config.networks || [])],
    features: {
      ...defaultConfig.features,
      ...(config.features || {})
    },
    featuredWalletIds: [...defaultConfig.featuredWalletIds, ...(config.featuredWalletIds || [])],
    themeVariables: {
      ...defaultConfig.themeVariables,
      ...(config.themeVariables || {})
    }
  }
  // const context = await sdk.context
  const connectors = (await sdk.context) ? [miniAppConnector()] : []

  // Create Wagmi Adapter
  const wagmiAdapter = new WagmiAdapter({
    projectId: finalConfig.projectId,
    networks: finalConfig.networks,
    connectors
  })

  const createAppKitObject = {}
  Object.assign(createAppKitObject, finalConfig)
  Object.adapters = [wagmiAdapter]

  // Create modal
  const appKit = createAppKit(createAppKitObject)

  return { wagmiConfig: wagmiAdapter.wagmiConfig, appKit }
}
