import { createAppKit } from '@reown/appkit/vue'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { base, mainnet } from '@reown/appkit/networks'

// 1. Get projectId from https://cloud.reown.com
const projectId = import.meta.env.VITE_REOWN_ID

// 2. Create a metadata object - optional
const metadata = {
  name: 'Trifle Auth',
  description: 'Authenticate your account with Trifle',
  url: window.location.origin, // origin must match your domain & subdomain
  // TODO: icon
  icons: [] // ['https://kudzucup.netlify.app/apple-touch-icon.png'],
}

const networks = [mainnet, base]

// 3. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  // ssr: true,
  projectId,
  networks
})

export const wagmiConfig = wagmiAdapter.wagmiConfig

// 4. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  metadata,
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    email: false, // default to true
    socials: ['google', 'x', 'github', 'discord', 'apple', 'facebook', 'farcaster'],
    emailShowWallets: true // This boolean defines whether you want to show the wallet options on the first connect screen. If this is false and socials are enabled, it will show a button that directs you to a new screen displaying the wallet options. Default true
  },
  // coinbasePreference: 'smartWalletOnly',
  // featuredWalletIds: [
  // IDs: https://explorer.walletconnect.com
  // * "installed" wallets appear automatically (Metamask, Brave, ...)
  // "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // metamask
  // '3ed8cc046c6211a798dc5ec70f1302b43e07db9639fd287de44a9aa115a21ed6', // leap
  // '6adb6082c909901b9e7189af3a4a0223102cd6f8d5c39e39f3d49acb92b578bb' // keplr
  // 'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa', // coinbase
  // '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369', // rainbow
  // ],
  themeMode: 'light',
  themeVariables: {
    // '--w3m-font-family': '"Space"',

    // font-size (default 13.33px it seems)
    '--w3m-font-size-master': '13px' // '0.625rem',

    // '--w3m-accent': 'var(--color-primary)',
    // '--w3m-color-mix': '#F0C4EE', // don't see this in account modals?
  }
})
