import { defineStore } from 'pinia'
// import { useAppKit, useAppKitEvents } from '@reown/appkit/vue'
// import { useAccount } from '@reown/appkit/vue'
// import { createAppKit } from '@reown/appkit'
// import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { createAppClient, viemConnector } from '@farcaster/auth-client'
import { isMobile } from './utils'
import { useAccount } from '@wagmi/vue'
import { signMessage, watchAccount, getChainId } from '@wagmi/core'
import { createSiweMessage } from 'viem/siwe'
import { sdk } from '@farcaster/miniapp-sdk'

// Platform types
const PLATFORMS = {
  WALLET: 'wallet',
  TELEGRAM: 'telegram',
  DISCORD: 'discord',
  FARCASTER: 'farcaster',
  TWITTER: 'twitter'
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    backendUrl: null,
    initialized: false,
    user: null, // { id, email, linkedAccounts: { discord: [{id, username}], telegram: [{id, username}], wallet: [{address, chainId}] } }
    isAuthenticated: false,
    authMethod: null, // The platform used for initial authentication
    authToken: null,
    loading: false,
    error: null,
    session: null,
    // Store current wallet state
    accountAddress: null,
    accountChainId: null,
    accountConnected: false,
    // Track if the current wallet needs authentication
    needsWalletAuth: false,
    authSteps: {
      wallet: {
        connecting: false,
        signing: false,
        verifying: false
      }
    },
    isFarcaster: false,
    isSuperApp: false,
    _appKitInstance: null,
    _wagmiConfigInstance: null,
    notifications: [], // { id, type: 'error'|'success', message }
    closeHubCallback: null,
    currentProfileUsername: null,
    // Telegram polling cleanup
    telegramPollingCleanup: null
  }),

  getters: {
    currentUser: (state) => state.user,
    hasWallet: (state) => state.accountConnected,
    hasEmail: (state) => !!state.user?.email,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    isPlatformConnected: (state) => (platform) => {
      return (state.user?.linkedAccounts?.[platform]?.length || 0) > 0
    },
    getPlatformData: (state) => (platform) => {
      return state.user?.linkedAccounts?.[platform] || []
    },
    // Wallet auth state getters
    isWalletAuthenticated: (state) => (address) => {
      // Check if the wallet exists in user's authenticated accounts
      return (
        state.user?.linkedAccounts?.wallet?.some(
          (w) => w.id?.toLowerCase() === address?.toLowerCase()
        ) ?? false
      )
    },
    currentWalletNeedsAuth: (state) => {
      if (!state.accountConnected || !state.accountAddress) return false
      // Check if the current wallet is in user's authenticated accounts
      return !state.user?.linkedAccounts?.wallet?.some(
        (w) => w.id?.toLowerCase() === state.accountAddress?.toLowerCase()
      )
    },
    currentWalletAddress: (state) => state.accountAddress
  },

  actions: {
    handleClick(e) {
      const link = e.target.closest('a')
      if (!link) return
      const href = link.href.replace(/\/$/, '')
      const linkMatchesDomain = href.includes(window.location.host)

      const linkMatchesFarcaster = href.includes('farcaster.xyz/') || href.includes('warpcast.com/')

      const isFarcasterProfile = linkMatchesFarcaster && href.split('/').length == 4
      const fid = isFarcasterProfile && link.attributes.fid?.value

      const isFarcasterPost = linkMatchesFarcaster && href.split('/').length == 5

      const linkMatchesDomainExactly = href == window.location.href.replace(/\/$/, '')

      const miniAppURLs = [
        'gm.trifle.life',
        'anybody.gg',
        'like.trifle.life',
        'like.trifle.life/lottery'
      ]
      const isFarcasterMiniApp =
        href.includes('farcaster.xyz/miniapps/') || miniAppURLs.some((url) => href.endsWith(url))
      console.log({ href, link, location: window.location })
      console.log({
        isFarcasterProfile,
        fid,
        isFarcasterPost,
        isFarcasterMiniApp,
        linkMatchesDomain
      })
      if (this.isFarcaster && isFarcasterProfile && fid) {
        e.preventDefault()
        sdk.actions.viewProfile({
          fid
        })
      } else if (this.isFarcaster && isFarcasterPost) {
        e.preventDefault()
        sdk.actions.viewCast({
          hash: href.split('/')[4]
        })
      } else if (linkMatchesDomainExactly) {
        e.preventDefault()
        this.closeHub()
      } else if (this.isFarcaster && isFarcasterMiniApp) {
        e.preventDefault()

        sdk.actions.openMiniApp({ url: href })
      } else if (this.isFarcaster && !linkMatchesDomain) {
        e.preventDefault()
        sdk.actions.openUrl(link.href)
      } else if (this.isFarcaster && linkMatchesDomain) {
        e.preventDefault()
        this.closeHub()
      }
    },
    setInstances(appKit, wagmiConfig) {
      this._appKitInstance = appKit
      this._wagmiConfigInstance = wagmiConfig
    },
    async initializeAuth(appKit, wagmiConfig, backendUrl) {
      console.log('initializeAuthhh')
      if (this.initialized) return
      this.backendUrl = backendUrl
      this.setInstances(appKit, wagmiConfig)
      if (!this._wagmiConfigInstance || !this._appKitInstance) {
        console.warn('AuthStore: initializeAuth called before appKit/wagmiConfig were set.')
        // Optionally, you could try to wait or re-attempt, or simply return/error.
        // For now, let's prevent execution if not set.
        this.addNotification({
          type: 'error',
          message: 'Initialization failed: Core dependencies not set in store.'
        })
        return
      }
      this.loading = true
      this.error = null

      try {
        try {
          // Initialize Farcaster miniapp if present
          await sdk.actions.ready()
        } catch (e) {
          console.warn('error initializing farcaster', e)
        }

        const token = localStorage.getItem('authToken')
        if (token) {
          this.setAuthToken(token)
          await this.fetchUserStatus()
        } else {
          console.log('no auth token found, not fetching user status')
        }

        // Initialize wallet connection state
        const unsubscribe = watchAccount(this._wagmiConfigInstance, {
          onChange: (data) => {
            this.accountAddress !== data.address?.toLowerCase() &&
              this.handleWalletChange(data.address?.toLowerCase())
            this.accountChainId !== data.chainId && this.handleChainChange(data.chainId)
            this.accountConnected !== data.isConnected &&
              this.handleConnectionChange(data.isConnected)
            this.saveSession()
          }
        })

        document.addEventListener('click', this.handleClick)
        const isMiniApp = await sdk.isInMiniApp()
        if (isMiniApp) {
          const context = await sdk.context
          this.isFarcaster = context
          // Check if this is a Trifle super app domain (only allow addFrame on these)
          const hostname = window.location.hostname
          this.isSuperApp = hostname === 'like.trifle.life' || hostname === 'trifle.life'
          await this.connectFarcaster()
        }

        this.initialized = true
      } catch (error) {
        console.error('Auth initialization failed:', error)
        this.addNotification({
          type: 'error',
          message: error.message
        })
      } finally {
        this.loading = false
      }
    },
    async fetchFarcasterUserInfo() {
      if (!this.isFarcaster) return
      const fid = this.isFarcaster.user.fid
      const url = `${this.backendUrl}/farcaster/user-info?fid=${fid}`
      const res = await fetch(url)
      const json = await res.json()
      console.log({ json })
      this.isFarcaster.user = { ...this.isFarcaster.user, ...json.user }
    },
    async handleChainChange(chainId) {
      this.accountChainId = chainId
    },
    async handleConnectionChange(isConnected) {
      this.accountConnected = isConnected
      if (!isConnected) {
        this.needsWalletAuth = false
      }
    },
    async handleWalletChange(newAddress) {
      // If we're switching to a new address
      if (newAddress) {
        this.accountAddress = newAddress
        // Check if the new address is authenticated
        const hasAuthenticatedWallet = this.user?.linkedAccounts?.wallet?.some(
          (w) => w.id?.toLowerCase() === newAddress?.toLowerCase()
        )
        // If not authenticated and we're logged in, mark as needing auth
        if (!hasAuthenticatedWallet && this.isAuthenticated) {
          this.needsWalletAuth = true
        } else {
          this.needsWalletAuth = false
        }
      }
    },

    async connectFarcaster() {
      let url, data, authWindow
      if (this.isFarcaster) {
        console.log('connecting farcaster')
        data = await sdk.quickAuth.getToken()

        url = `${this.backendUrl}/farcaster/${
          this.isAuthenticated ? 'add-quick-auth' : 'quick-auth'
        }`
      } else {
        console.log('this is not farcaster, using remote sign-in')
        // Always close any previous popup before opening a new one
        if (window.__trifleFarcasterPopup) {
          try {
            if (window.__trifleFarcasterPopup) {
              window.__trifleFarcasterPopup.close()
            }
          } catch (e) {
            console.warn('Error closing previous Farcaster popup:', e)
          }
          window.__trifleFarcasterPopup = null
        }
        const { nonce } = await fetch(this.backendUrl + '/farcaster/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((res) => res.json())
        let farcasterTimeout = null
        if (this.isFarcaster) {
          data = await sdk.actions.signIn({
            nonce
          })
        } else {
          const appClient = createAppClient({
            relay: 'https://relay.farcaster.xyz',
            ethereum: viemConnector({ rpcUrl: 'https://eth.drpc.org' })
          })
          const currentURL = window.location.href
          const channel = await appClient.createChannel({
            siweUri: currentURL,
            domain: currentURL.split('/')[2],
            nonce
          })
          const channelToken = channel.data?.channelToken
          const url = channel.data?.url.replace('warpcast.com', 'farcaster.xyz')
          if (isMobile()) {
            authWindow = window.open(url, '_top')
          } else {
            // If a popup is already open, close it before opening a new one
            if (window.__trifleFarcasterPopup && !window.__trifleFarcasterPopup.closed) {
              window.__trifleFarcasterPopup.close()
            }
            authWindow = window.open(url, '_blank', 'width=500,height=800')
            window.__trifleFarcasterPopup = authWindow
          }

          if (!authWindow) {
            this.addNotification({
              type: 'error',
              message:
                'Could not open Farcaster authentication window. Please check your popup blocker settings.'
            })
            throw new Error(
              'Could not open Farcaster authentication window. Please check your popup blocker settings.'
            )
          }

          // Timeout for 5 minutes
          farcasterTimeout = setTimeout(() => {
            if (authWindow && !authWindow.closed) authWindow.close()
            window.__trifleFarcasterPopup = null
            this.addNotification({
              type: 'error',
              message: 'Farcaster authentication timed out after 5 minutes.'
            })
          }, 300000)

          data = await new Promise((resolve, reject) => {
            appClient
              .watchStatus({
                channelToken,
                timeout: 300_000, // 5 minutes
                interval: 1_000,
                onResponse: async ({ response, data }) => {
                  if (response.status !== 200) return
                  console.log('Response code:', response.status)
                  console.log('Status data:', data)
                  clearTimeout(farcasterTimeout)
                  if (authWindow && !authWindow.closed) authWindow.close()
                  window.__trifleFarcasterPopup = null
                  resolve(data)
                }
              })
              .catch((err) => {
                clearTimeout(farcasterTimeout)
                if (authWindow && !authWindow.closed) authWindow.close()
                window.__trifleFarcasterPopup = null
                this.addNotification({
                  type: 'error',
                  message: 'Farcaster authentication failed.'
                })
                reject(err)
              })
          })
        }

        url = `${this.backendUrl}/farcaster/${this.isAuthenticated ? 'add-signin' : 'signin'}`
      }
      const headers = {
        'Content-Type': 'application/json'
      }
      if (this.isAuthenticated) {
        headers.Authorization = `Bearer ${this.authToken}`
      }
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        console.error('error signing in with farcaster', res)
        authWindow && authWindow.close()
        throw new Error('Failed to sign in with Farcaster')
      }

      const jsonRes = await res.json()
      this.setAuthToken(jsonRes.token)
      await this.fetchUserStatus()
      console.log({ isFarcaster: this.isFarcaster })
      this.addFrame()
    },

    setAuthToken(token) {
      this.authToken = token
      localStorage.setItem('authToken', token)
    },

    async addFrame() {
      try {
        // Only add frame if this is a Trifle super app domain
        if (this.isFarcaster && !this.isFarcaster.client.added && this.isSuperApp) {
          await sdk.actions.addFrame()
          this.isFarcaster = await sdk.context
        }
      } catch (e) {
        console.warn('non-fatal error adding frame', e)
      }
    },

    async connectDiscord() {
      this.loading = true
      this.error = null

      // Always close any previous popup before opening a new one
      if (window.__trifleDiscordPopup) {
        try {
          if (window.__trifleDiscordPopup) {
            window.__trifleDiscordPopup.close()
          }
        } catch (e) {
          console.warn('Error closing previous Discord popup:', e)
        }
        window.__trifleDiscordPopup = null
      }

      try {
        // const hasDiscordAuth = this.user?.linkedAccounts?.discord?.length > 0
        let url = `${this.backendUrl}/auth/discord`
        if (this.isAuthenticated) {
          // For additional auth, get a nonce first
          const nonceResponse = await fetch(`${this.backendUrl}/auth/discord-nonce`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.authToken}`
            }
          })

          if (!nonceResponse.ok) {
            throw new Error('Failed to get nonce for Discord authentication')
          }

          const { nonce } = await nonceResponse.json()
          url += `?nonce=${encodeURIComponent(nonce)}`
        }

        if (this.isFarcaster) {
          console.log('this is farcaster, opening url', url)
          this.discordAuthBeforeFarcaster = this.user?.linkedAccounts?.discord
            ?.map((d) => d.username)
            .join(',')
          console.log({ discordAuthBeforeFarcaster: this.discordAuthBeforeFarcaster })
          await sdk.actions.openUrl(url)
        } else {
          // Open Discord auth window
          window.__trifleDiscordPopup = window.open(url, '_blank', 'width=500,height=800')

          // If window failed to open
          if (!window.__trifleDiscordPopup) {
            throw new Error(
              'Could not open Discord authentication window. Please check your popup blocker settings.'
            )
          }
        }
        const authPromise = new Promise((resolve, reject) => {
          let checkClosedInterval
          let validResponse = false
          const handleMessage = async (event) => {
            console.log('handleMessage', event)
            // Only accept messages from our backend
            if (event.origin === this.backendUrl) {
              console.log('event.data', event.data)
              validResponse = true
              // Clear the interval since we got a valid response
              if (checkClosedInterval) {
                clearInterval(checkClosedInterval)
              }

              // Handle successful authentication
              if (event.data.token) {
                this.setAuthToken(event.data.token)
                await this.fetchUserStatus()
                window.__trifleDiscordPopup = null
                resolve()
                return
              }

              // Handle authentication error
              if (event.data.error) {
                console.error('Authentication error:', event.data.error)
                window.__trifleDiscordPopup = null
                reject(event.data.error)
                return
              }
            } else {
              console.warn(`message from ${event.origin} not from ${this.backendUrl}`)
            }
          }

          window.addEventListener('message', handleMessage)

          // Clean up if window is closed
          checkClosedInterval = setInterval(() => {
            console.log(
              'checkClosedInterval',
              window.__trifleDiscordPopup?.closed,
              this.discordAuthBeforeFarcaster
            )
            if (window.__trifleDiscordPopup?.closed) {
              console.log('manually closing window')
              clearInterval(checkClosedInterval)
              window.removeEventListener('message', handleMessage)
              window.__trifleDiscordPopup = null
              if (!validResponse) {
                reject(
                  'Discord window closed before authentication was completed. Please try again.'
                )
              }
            } else if (typeof this.discordAuthBeforeFarcaster === 'string') {
              this.fetchUserStatus().then(() => {
                const discordAuthAfter = this.user?.linkedAccounts?.discord
                  ?.map((d) => d.username)
                  .join(',')
                console.log({
                  discordAuthAfter,
                  discordAuthBeforeFarcaster: this.discordAuthBeforeFarcaster
                })
                if (discordAuthAfter !== this.discordAuthBeforeFarcaster) {
                  clearInterval(checkClosedInterval)
                  window.removeEventListener('message', handleMessage)
                  window.__trifleDiscordPopup = null
                  resolve()
                }
              })
            }
          }, 1000)
        })

        await authPromise
      } catch (error) {
        console.error('Discord authentication error:', error)
        this.addNotification({
          type: 'error',
          message: error.message || 'Failed to connect Discord'
        })
      } finally {
        this.loading = false
      }
    },

    async cancelTwitterAuth() {
      if (!this.isAuthenticated) return
      const url = `${this.backendUrl}/auth/twitter-purge-orphans`
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authToken}`
        }
      })
      if (!res.ok) {
        throw new Error('Failed to cancel TwitterX authentication')
      }
      return res.json()
    },

    async connectTwitter() {
      this.loading = true
      this.error = null

      // Always close any previous popup before opening a new one
      if (window.__trifleTwitterPopup) {
        try {
          if (window.__trifleTwitterPopup) {
            window.__trifleTwitterPopup.close()
          }
        } catch (e) {
          console.warn('Error closing previous TwitterX popup:', e)
        }
        window.__trifleTwitterPopup = null
      }
      await this.cancelTwitterAuth()

      try {
        let url = `${this.backendUrl}/auth/twitter`
        if (this.isAuthenticated) {
          // authenticated users need a nonce to connect the accounts
          const nonceResponse = await fetch(`${this.backendUrl}/auth/twitter-nonce`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.authToken}`
            }
          })

          if (!nonceResponse.ok) {
            throw new Error('Failed to get nonce for TwitterX authentication')
          }

          const { nonce } = await nonceResponse.json()
          url += `?nonce=${encodeURIComponent(nonce)}`
        }

        if (this.isFarcaster) {
          console.log('this is farcaster, opening url', url)
          this.twitterAuthBeforeFarcaster = this.user?.linkedAccounts?.twitter
            ?.map((t) => t.username)
            .join(',')
          console.log({ twitterAuthBeforeFarcaster: this.twitterAuthBeforeFarcaster })
          await sdk.actions.openUrl(url)
        } else {
          // Open TwitterX auth window
          window.__trifleTwitterPopup = window.open(
            url,
            '_blank',
            'width=600,height=600,scrollbars=yes,resizable=yes'
          )

          // If window failed to open
          if (!window.__trifleTwitterPopup) {
            this.cancelTwitterAuth()
            throw new Error(
              'Could not open TwitterX authentication window. Please check your popup blocker settings.'
            )
          }
        }

        const authPromise = new Promise((resolve, reject) => {
          let checkClosedInterval
          let validResponse = false
          const handleMessage = async (event) => {
            console.log('TwitterX handleMessage', event)
            // Only accept messages from our backend
            if (event.origin === this.backendUrl) {
              console.log('TwitterX event.data', event.data)
              validResponse = true
              // Clear the interval since we got a valid response
              if (checkClosedInterval) {
                clearInterval(checkClosedInterval)
              }

              // Handle successful authentication
              if (event.data.token) {
                this.setAuthToken(event.data.token)
                await this.fetchUserStatus()
                window.__trifleTwitterPopup = null
                resolve()
                return
              }

              // Handle authentication error
              if (event.data.error) {
                this.cancelTwitterAuth()
                console.error('TwitterX authentication error:', event.data.error)
                window.__trifleTwitterPopup = null
                reject(event.data.error)
                return
              }
            } else {
              console.warn(`TwitterX message from ${event.origin} not from ${this.backendUrl}`)
            }
          }

          window.addEventListener('message', handleMessage)

          // Clean up if window is closed
          checkClosedInterval = setInterval(() => {
            console.log(
              'checkClosedInterval',
              window.__trifleTwitterPopup?.closed,
              this.twitterAuthBeforeFarcaster
            )
            if (window.__trifleTwitterPopup?.closed) {
              console.log('TwitterX window manually closing')
              clearInterval(checkClosedInterval)
              window.removeEventListener('message', handleMessage)
              window.__trifleTwitterPopup = null
              if (!validResponse) {
                this.cancelTwitterAuth()
                reject(
                  'TwitterX window closed before authentication was completed. Please try again.'
                )
              }
            } else if (typeof this.twitterAuthBeforeFarcaster === 'string') {
              this.fetchUserStatus().then(() => {
                const twitterAuthAfter = this.user?.linkedAccounts?.twitter
                  ?.map((t) => t.username)
                  .join(',')
                console.log({
                  twitterAuthAfter,
                  twitterAuthBeforeFarcaster: this.twitterAuthBeforeFarcaster
                })
                if (twitterAuthAfter !== this.twitterAuthBeforeFarcaster) {
                  clearInterval(checkClosedInterval)
                  window.removeEventListener('message', handleMessage)
                  window.__trifleTwitterPopup = null
                  resolve()
                }
              })
            }
          }, 1000)
        })

        await authPromise
      } catch (error) {
        this.cancelTwitterAuth()
        console.error('TwitterX authentication error:', error)
        this.addNotification({
          type: 'error',
          message: error.message || 'Failed to connect TwitterX'
        })
      } finally {
        this.loading = false
      }
    },

    async connectWallet() {
      try {
        const isConnected = this._appKitInstance.getIsConnectedState()
        if (isConnected) {
          console.log('wallet already connected, no need to connect')
          return true
        }

        this.authSteps.wallet.connecting = true
        await this.enforceConnection()
        const { address } = useAccount({ config: this._wagmiConfigInstance })
        if (!address.value) throw new Error('Failed to connect wallet')

        // Don't automatically authenticate if user is already logged in with another method
        if (!this.isAuthenticated) {
          return this.authenticateWithWallet(address.value)
        }

        return true
      } catch (error) {
        console.error('Wallet connection error:', error)
        throw error
      } finally {
        this.authSteps.wallet.connecting = false
      }
    },
    async signDiscordId(message) {
      try {
        const signature = await signMessage(this._wagmiConfigInstance, {
          message
        })
        return signature
      } catch (error) {
        console.error('Failed to sign Discord ID:', error)
        throw error
      }
    },
    // TODO: replace with siwe to reduce clicks (https://docs.reown.com/appkit/vue/core/siwe#one-click-auth)
    async authenticateWithWallet(address) {
      console.log('authenticateWithWallet', { address })
      try {
        const normalizedAddress = address.toLowerCase()

        // If already authenticated with this wallet, no need to re-authenticate
        if (
          this.user?.linkedAccounts?.wallet?.some(
            (w) => w.address?.toLowerCase() === normalizedAddress
          )
        ) {
          this.needsWalletAuth = false
          console.log('already authenticated with this wallet, no need to re-authenticate')
          return true
        }

        const url = `${this.backendUrl}/auth/wallet/nonce`
        const headers = {
          'Content-Type': 'application/json'
        }

        if (this.isAuthenticated) {
          headers.Authorization = `Bearer ${this.authToken}`
        }

        // 1. Get nonce from server
        this.authSteps.wallet.signing = true
        const nonceResponse = await fetch(url, {
          method: 'POST',
          headers
        })

        if (!nonceResponse.ok) {
          throw new Error('Failed to get nonce')
        }

        const { nonce } = await nonceResponse.json()

        // Ensure we have a valid chainId for the SIWE message
        let chainId = this.accountChainId
        if (chainId == null && this._wagmiConfigInstance) {
          try {
            chainId = getChainId(this._wagmiConfigInstance)
            if (chainId != null) {
              this.accountChainId = chainId
            }
          } catch (e) {
            console.warn('Failed to get chain ID from wagmi config:', e)
          }
        }
        if (chainId == null) {
          throw new Error(
            'Unable to determine chain ID. Please ensure your wallet is connected to a network.'
          )
        }

        const message = createSiweMessage({
          domain: window.location.host,
          address: normalizedAddress,
          statement: 'Sign this message to prove you own this wallet (at no cost to you).',
          uri: window.location.origin,
          version: '1',
          chainId,
          nonce
        })

        // 2. Sign the nonce message
        // const signature = await signMessage(this._wagmiConfigInstance, {
        //   message: nonce
        // })
        const signature = await signMessage(this._wagmiConfigInstance, {
          message
        })

        // 3. Verify signature and get token
        this.authSteps.wallet.signing = false
        this.authSteps.wallet.verifying = true

        const verifyUrl = `${this.backendUrl}/auth/wallet/${
          this.isAuthenticated ? 'add-verify' : 'verify'
        }`
        const verifyResponse = await fetch(verifyUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            signature,
            message
          })
        })
        if (!verifyResponse.ok) {
          throw new Error('Failed to verify signature')
        }
        const verifyResponse_ = await verifyResponse.json()
        if (verifyResponse_.token) {
          const { token } = verifyResponse_
          this.setAuthToken(token)
        }

        this.needsWalletAuth = false
        // Fetch updated user status which will include the new authenticated wallet
        await this.fetchUserStatus()
        return true
      } catch (error) {
        console.error('Wallet authentication error:', error)
        throw error
      } finally {
        this.authSteps.wallet.signing = false
        this.authSteps.wallet.verifying = false
      }
    },

    async connectPlatform(platform, platformData) {
      if (!Object.values(PLATFORMS).includes(platform)) {
        throw new Error('Invalid platform')
      }

      this.loading = true
      try {
        // Ensure user exists
        if (!this.user) {
          this.user = {
            linkedAccounts: {},
            email: null
          }
        }

        // Update user's linked accounts directly
        if (!this.user.linkedAccounts[platform]) {
          this.user.linkedAccounts[platform] = []
        }
        // TODO: make sure that the platformData is not already in the array or confirm it is not possible to add the same platformData twice
        this.user.linkedAccounts[platform].push(platformData)

        if (!this.isAuthenticated) {
          this.isAuthenticated = true
          this.authMethod = platform
        }

        this.saveSession()
      } catch (error) {
        this.addNotification({
          type: 'error',
          message: error.message || `Failed to connect ${platform}`
        })
        throw error
      } finally {
        this.loading = false
      }
    },

    async disconnectPlatform(platform) {
      // TODO make sure this is necessary. It seems like if you are disconnecting a platform, it doesn't matter whether that wallet account is currently connected or not
      if (platform === 'wallet') {
        if (!this.accountConnected) return
      } else if (!this.user?.linkedAccounts?.[platform]?.length) {
        return
      }

      if (this.user?.linkedAccounts) {
        delete this.user.linkedAccounts[platform]
      }

      // TODO: make sure this is necessary. IT seems like if you are disconnecting a platform the current authMethod is determined by the remaining platforms, it should be determined by the authToken
      // If this was the primary auth method, check if we should switch to another
      if (this.authMethod === platform) {
        const remainingPlatforms = Object.entries(this.user?.linkedAccounts || {}).filter(
          ([, accounts]) => accounts?.length > 0
        )

        if (remainingPlatforms.length > 0) {
          this.authMethod = remainingPlatforms[0][0]
        } else {
          // No other auth methods available
          await this.disconnect()
          return
        }
      }

      this.saveSession()
    },

    async openAccountModal() {
      try {
        await this._appKitInstance.open()
        return true
      } catch (error) {
        console.error(error)
        throw new Error("Oops, couldn't open modal.")
      }
    },

    async enforceConnection() {
      if (!this.accountConnected) {
        await this.openAccountModal()
        await this.waitForConnection()
      }
      return true
    },

    async disconnect() {
      console.log('disconnecting')
      try {
        if (this.accountConnected) {
          await this._appKitInstance.disconnect()
          const connected = this._appKitInstance.getIsConnectedState()
          if (connected) throw new Error('Failed to disconnect')
        }

        // Clear Discord auth
        localStorage.removeItem('authToken')
        this.authToken = null

        // Cleanup any ongoing Telegram authentication
        this.cleanupTelegramAuth()

        // Clear all state
        this.user = null
        this.isAuthenticated = false
        this.authMethod = null
        this.session = null
        this.accountAddress = null
        this.accountChainId = null
        this.accountConnected = false
        this.needsWalletAuth = false

        // Clear saved session
        localStorage.removeItem('auth_session')
      } catch (error) {
        console.error('Disconnect error:', error)
        throw error
      }
    },

    saveSession() {
      const session = {
        user: this.user,
        authMethod: this.authMethod,
        wallet: this.accountConnected
          ? {
              address: this.accountAddress,
              chainId: this.accountChainId
            }
          : null
      }
      localStorage.setItem('auth_session', JSON.stringify(session))
      this.session = session
    },

    waitForConnection() {
      if (this.checkingConnection) {
        clearInterval(this.checkingConnection)
      }
      console.log('waitForConnection')
      return new Promise((resolve) => {
        this.checkingConnection = setInterval(() => {
          const connected = this._appKitInstance.getIsConnectedState()
          if (connected) {
            this.accountConnected = true
            clearInterval(this.checkingConnection)
            resolve()
          } else {
            this.accountConnected = false
          }
        }, 500)
      })
    },

    async fetchUserStatus() {
      try {
        const response = await fetch(`${this.backendUrl}/auth/status`, {
          headers: {
            Authorization: `Bearer ${this.authToken}`
          }
        })

        if (!response.ok) {
          if (response.status == 401) {
            console.log('401, disconnecting')
            this.disconnect()
          }
          throw new Error('Failed to fetch user status')
        }

        const json = await response.json()

        const user = json.user
        if (user) {
          // Update user state with correct structure
          this.user = {
            id: user.id,
            avatar: user.avatar,
            username: user.username,
            totalBalls: user.totalBalls,
            linkedAccounts: {}
          }

          // Map platforms array to linkedAccounts structure
          Object.values(PLATFORMS).forEach((platform) => {
            this.user.linkedAccounts[platform] = user.platforms
              .filter((p) => p.type === platform)
              .map((p) => ({
                id: p.id,
                username: p.username,
                avatar: p.avatar,
                lastUsed: p.lastUsed,
                metadata: p.metadata
              }))
          })

          if (!this.isAuthenticated) {
            this.isAuthenticated = true
            // Set authMethod to the first connected platform if not already set
            if (!this.authMethod) {
              const firstConnectedPlatform = Object.entries(this.user.linkedAccounts).find(
                ([, accounts]) => accounts?.length > 0
              )
              if (firstConnectedPlatform) {
                this.authMethod = firstConnectedPlatform[0]
              }
            }
          }

          this.saveSession()
        }
      } catch (error) {
        console.error('Failed to fetch user status:', error)
        throw error
      }
    },

    async updateUsername(newUsername) {
      try {
        const response = await fetch(`${this.backendUrl}/auth/username`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.authToken}`
          },
          body: JSON.stringify({ username: newUsername })
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to update username')
        }

        const { username } = await response.json()

        // Update the user's username in the store
        if (this.user) {
          this.user.username = username
          this.saveSession()
        }

        return username
      } catch (error) {
        console.error('Failed to update username:', error)
        throw error
      }
    },

    async disconnectPlatformInstance(platform, instanceId) {
      console.log('disconnectPlatformInstance', {
        platform,
        instanceId
      })

      try {
        // Call the server to disconnect the instance
        const response = await fetch(`${this.backendUrl}/auth/disconnect-instance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.authToken}`
          },
          body: JSON.stringify({
            platform,
            platformId: instanceId
          })
        })

        if (!response.ok) {
          throw new Error('Failed to disconnect platform instance')
        }
        console.log('disconnectPlatformInstance')
        await this.fetchUserStatus()
      } catch (error) {
        console.error('Failed to disconnect platform instance:', error)
        throw error
      }
    },
    addNotification({ type, message }) {
      const id = Date.now() + Math.random()
      this.notifications.push({ id, type, message })
      setTimeout(() => {
        this.removeNotification(id)
      }, 5000)
    },
    removeNotification(id) {
      const idx = this.notifications.findIndex((n) => n.id === id)
      if (idx !== -1) this.notifications.splice(idx, 1)
    },
    setCloseHubCallback(fn) {
      this.closeHubCallback = fn
    },
    closeHub() {
      if (this.closeHubCallback) this.closeHubCallback()
    },
    setProfileUsername(username) {
      this.currentProfileUsername = username
    },

    // Cleanup any ongoing Telegram authentication
    cleanupTelegramAuth() {
      if (this.telegramPollingCleanup) {
        this.telegramPollingCleanup()
        this.telegramPollingCleanup = null
      }
      if (window.__trifleTelegramPopup) {
        try {
          window.__trifleTelegramPopup.close()
        } catch (e) {
          console.warn('Error closing Telegram popup during cleanup:', e)
        }
        window.__trifleTelegramPopup = null
      }
    },
    async connectTelegram() {
      this.loading = true
      this.error = null

      // Cleanup any previous Telegram authentication
      this.cleanupTelegramAuth()

      try {
        // Get nonce
        let url = `${this.backendUrl}/telegram/nonce${this.isAuthenticated ? '-login' : ''}`
        const headers = {
          'Content-Type': 'application/json'
        }
        if (this.isAuthenticated) {
          headers.Authorization = `Bearer ${this.authToken}`
        }

        const nonceResponse = await fetch(url, {
          method: 'POST',
          headers
        })

        if (!nonceResponse.ok) {
          throw new Error('Failed to get nonce for Telegram authentication')
        }

        const { nonce } = await nonceResponse.json()

        // Provide user guidance
        this.addNotification({
          type: 'success',
          message: 'Opening Telegram... Complete authentication there, then return here!'
        })

        const botInfo = await fetch(`${this.backendUrl}/telegram/bot-info`)
        if (!botInfo.ok) {
          throw new Error('Failed to get bot information')
        }
        const { botUsername } = await botInfo.json()
        if (!botUsername) {
          throw new Error('Failed to get bot information')
        }

        // Open Telegram in popup window
        const telegramUrl = `https://t.me/${botUsername}?start=${nonce}`

        if (this.isFarcaster) {
          await sdk.actions.openUrl(telegramUrl)
        } else {
          window.__trifleTelegramPopup = window.open(
            telegramUrl,
            '_blank',
            'width=500,height=700,scrollbars=yes,resizable=yes'
          )

          // If window failed to open
          if (!window.__trifleTelegramPopup) {
            throw new Error(
              'Could not open Telegram authentication window. Please check your popup blocker settings.'
            )
          }
        }

        // Start polling for completion (store cleanup function)
        // For Farcaster, we'll poll to detect when the account is added
        await this.pollTelegramAuth(nonce)
      } catch (error) {
        console.error('Telegram authentication error:', error)
        this.addNotification({
          type: 'error',
          message: error.message || 'Failed to connect Telegram'
        })
      } finally {
        this.loading = false
      }
    },

    async pollTelegramAuth(nonce) {
      const maxAttempts = 150 // 5 minutes at 2-second intervals
      let attempts = 0

      return new Promise((resolve, reject) => {
        let checkClosedInterval
        let authCompleted = false

        // Store cleanup function
        this.telegramPollingCleanup = () => {
          if (pollInterval) clearInterval(pollInterval)
          if (checkClosedInterval) clearInterval(checkClosedInterval)
          authCompleted = true
        }

        const pollInterval = setInterval(async () => {
          attempts++

          try {
            const response = await fetch(`${this.backendUrl}/telegram/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ nonce })
            })

            const data = await response.json()

            if (response.ok && data.status === 'completed') {
              console.log('data.status === completed')
              clearInterval(pollInterval)
              if (checkClosedInterval) clearInterval(checkClosedInterval)
              authCompleted = true
              this.telegramPollingCleanup = null

              // Close the popup window
              if (window.__trifleTelegramPopup && !window.__trifleTelegramPopup.closed) {
                window.__trifleTelegramPopup.close()
              }
              window.__trifleTelegramPopup = null

              // Handle successful authentication
              if (data.token) {
                console.log('data.token present')
                localStorage.setItem('authToken', data.token)
                await this.fetchUserStatus()
                this.addNotification({
                  type: 'success',
                  message: 'Telegram connected successfully!'
                })
                resolve()
                return
              }
            } else if (response.status === 401 || response.status === 404) {
              // Expired or not found
              clearInterval(pollInterval)
              if (checkClosedInterval) clearInterval(checkClosedInterval)
              authCompleted = true
              this.telegramPollingCleanup = null

              // Close the popup window
              if (window.__trifleTelegramPopup && !window.__trifleTelegramPopup.closed) {
                window.__trifleTelegramPopup.close()
              }
              window.__trifleTelegramPopup = null

              this.addNotification({
                type: 'error',
                message: 'Telegram authentication expired. Please try again.'
              })
              reject(new Error('Authentication expired'))
              return
            } else if (response.status === 202) {
              // Still pending, continue polling
              console.log('Waiting for Telegram authentication...')
            }
            // Check timeout
            if (attempts >= maxAttempts) {
              clearInterval(pollInterval)
              if (checkClosedInterval) clearInterval(checkClosedInterval)
              authCompleted = true
              this.telegramPollingCleanup = null

              // Close the popup window
              if (window.__trifleTelegramPopup && !window.__trifleTelegramPopup.closed) {
                window.__trifleTelegramPopup.close()
              }
              window.__trifleTelegramPopup = null

              this.addNotification({
                type: 'error',
                message: 'Telegram authentication timed out. Please try again.'
              })
              reject(new Error('Authentication timeout'))
            }
          } catch (err) {
            console.error('Polling error:', err)
            // Continue polling unless it's a critical error
          }
        }, 2000) // Poll every 2 seconds

        // Check if popup is manually closed by user
        checkClosedInterval = setInterval(() => {
          if (window.__trifleTelegramPopup && window.__trifleTelegramPopup.closed) {
            console.log('Telegram popup was manually closed by user')
            clearInterval(pollInterval)
            clearInterval(checkClosedInterval)
            window.__trifleTelegramPopup = null
            this.telegramPollingCleanup = null

            if (!authCompleted) {
              reject(new Error('Authentication cancelled by user'))
            }
          }
        }, 1000)
      })
    }
  }
})
