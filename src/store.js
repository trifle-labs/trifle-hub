import { defineStore } from 'pinia'
// import { useAppKit, useAppKitEvents } from '@reown/appkit/vue'
// import { useAccount } from '@reown/appkit/vue'
// import { createAppKit } from '@reown/appkit'
// import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

import { useAccount } from '@wagmi/vue'
import { signMessage, watchAccount } from '@wagmi/core'
// Platform types
const PLATFORMS = {
  WALLET: 'wallet',
  TELEGRAM: 'telegram',
  DISCORD: 'discord',
  FARCASTER: 'farcaster'
}
const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    initialized: false,
    user: null, // { id, email, linkedAccounts: { discord: [{id, username}], telegram: [{id, username}], wallet: [{address, chainId}] } }
    isAuthenticated: false,
    authMethod: null, // The platform used for initial authentication
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
    _appKitInstance: null,
    _wagmiConfigInstance: null
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
    setInstances(appKit, wagmiConfig) {
      this._appKitInstance = appKit
      this._wagmiConfigInstance = wagmiConfig
      console.log('AuthStore: appKit and wagmiConfig instances set in store.', {
        appKit,
        wagmiConfig
      })
    },
    async initializeAuth(appKit, wagmiConfig) {
      console.log('initializeAuth')
      if (this.initialized) return
      this.setInstances(appKit, wagmiConfig)
      if (!this._wagmiConfigInstance || !this._appKitInstance) {
        console.warn('AuthStore: initializeAuth called before appKit/wagmiConfig were set.')
        // Optionally, you could try to wait or re-attempt, or simply return/error.
        // For now, let's prevent execution if not set.
        this.error = 'Initialization failed: Core dependencies not set in store.'
        return
      }
      this.loading = true
      this.error = null

      try {
        // Check for existing session
        const savedSession = localStorage.getItem('auth_session')
        if (savedSession) {
          const session = JSON.parse(savedSession)
          await this.restoreSession(session)
        }

        // Check for Discord JWT token
        const token = localStorage.getItem('authToken')
        if (token) {
          console.log('initializeAuth')
          await this.fetchUserStatus()
        }

        // Initialize wallet connection state
        const unsubscribe = watchAccount(this._wagmiConfigInstance, {
          onChange: (data) => {
            console.log('watchAccount', { data })
            this.accountAddress !== data.address?.toLowerCase() &&
              this.handleWalletChange(data.address?.toLowerCase())
            this.accountChainId !== data.chainId && this.handleChainChange(data.chainId)
            this.accountConnected !== data.isConnected &&
              this.handleConnectionChange(data.isConnected)
            this.saveSession()
          }
        })

        this.initialized = true
      } catch (error) {
        console.error('Auth initialization failed:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async handleChainChange(chainId) {
      this.accountChainId = chainId
    },
    async handleConnectionChange(isConnected) {
      this.accountConnected = isConnected
      if (!isConnected) {
        console.log('not connected, setting needsWalletAuth to false')
        this.needsWalletAuth = false
      }
    },
    async handleWalletChange(newAddress) {
      console.log('handleWalletChange', { newAddress })
      // If we're switching to a new address
      if (newAddress) {
        this.accountAddress = newAddress
        // Check if the new address is authenticated
        const hasAuthenticatedWallet = this.user?.linkedAccounts?.wallet?.some(
          (w) => w.address?.toLowerCase() === newAddress?.toLowerCase()
        )

        console.log({
          hasAuthenticatedWallet,
          isAuthenticated: this.isAuthenticated
        })

        // If not authenticated and we're logged in, mark as needing auth
        if (!hasAuthenticatedWallet && this.isAuthenticated) {
          console.log('needs wallet auth, setting needsWalletAuth to true')
          this.needsWalletAuth = true
        } else {
          console.log('no need for wallet auth, setting needsWalletAuth to false')
          this.needsWalletAuth = false
        }

        this.updateWalletState()
      }
    },

    updateWalletState() {
      // The current wallet state is already tracked in accountAddress, accountChainId, and accountConnected
      this.saveSession()
    },

    async connectDiscord() {
      this.loading = true
      this.error = null

      try {
        // const hasDiscordAuth = this.user?.linkedAccounts?.discord?.length > 0
        let url = `${backendUrl}/auth/discord`
        console.log({ url })
        if (this.isAuthenticated) {
          // For additional auth, get a nonce first
          const nonceResponse = await fetch(`${backendUrl}/auth/discord-nonce`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
          })

          if (!nonceResponse.ok) {
            throw new Error('Failed to get nonce for Discord authentication')
          }

          const { nonce } = await nonceResponse.json()
          url += `?nonce=${encodeURIComponent(nonce)}`
        }

        // Open Discord auth window
        const authWindow = window.open(url, 'Discord Auth', 'width=500,height=800')

        // Listen for the auth response
        const authPromise = new Promise((resolve, reject) => {
          const handleMessage = async (event) => {
            console.log({ event })
            // Only accept messages from our backend
            if (event.origin === backendUrl) {
              console.log('event.data', event.data)
              const { token } = event.data
              if (token) {
                localStorage.setItem('authToken', token)
                console.log('listen for successful discord auth')
                await this.fetchUserStatus()
                resolve()
              }
            }
          }

          window.addEventListener('message', handleMessage)

          // Clean up if window is closed
          const checkClosed = setInterval(() => {
            if (authWindow.closed) {
              console.log('manually closing window')
              console.log({ authWindow })
              clearInterval(checkClosed)
              window.removeEventListener('message', handleMessage)
              reject(new Error('Authentication window closed'))
            }
          }, 1000)
        })

        await authPromise
      } catch (error) {
        this.error = error.message || 'Failed to connect Discord'
        throw error
      } finally {
        this.loading = false
      }
    },

    async connectWallet() {
      try {
        const isConnected = this._appKitInstance.getIsConnectedState()
        console.log({ isConnected })
        this.authSteps.wallet.connecting = true
        await this.enforceConnection()
        const { address } = useAccount({ config: this._wagmiConfigInstance })
        console.log({ address })
        console.log({ isConnected: this.accountConnected })
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

        const url = `${backendUrl}/auth/wallet/${this.isAuthenticated ? 'add-nonce' : 'nonce'}`
        const headers = {
          'Content-Type': 'application/json'
        }

        if (this.isAuthenticated) {
          headers.Authorization = `Bearer ${localStorage.getItem('authToken')}`
        }

        // 1. Get nonce from server
        this.authSteps.wallet.signing = true
        const nonceResponse = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify({ address: normalizedAddress })
        })
        console.log('nonceResponse', { nonceResponse })

        if (!nonceResponse.ok) {
          throw new Error('Failed to get nonce')
        }

        const { nonce } = await nonceResponse.json()
        console.log('sign the nonce')
        // 2. Sign the nonce message
        const signature = await signMessage(this._wagmiConfigInstance, {
          message: nonce
        })
        console.log({ signature })

        // 3. Verify signature and get token
        this.authSteps.wallet.signing = false
        this.authSteps.wallet.verifying = true

        const verifyUrl = `${backendUrl}/auth/wallet/${
          this.isAuthenticated ? 'add-verify' : 'verify'
        }`
        console.log({ verifyUrl })
        const verifyResponse = await fetch(verifyUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            address: normalizedAddress,
            signature
          })
        })
        console.log({ verifyResponse })
        if (!verifyResponse.ok) {
          throw new Error('Failed to verify signature')
        }

        if (!this.isAuthenticated) {
          const { token } = await verifyResponse.json()
          console.log('set authToken from wallet auth', { token })
          localStorage.setItem('authToken', token)
        }

        this.needsWalletAuth = false
        // Fetch updated user status which will include the new authenticated wallet
        console.log('authenticateWithWallet')
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
        this.error = error.message || `Failed to connect ${platform}`
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

      if (platform === 'discord') {
        localStorage.removeItem('authToken')
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
      console.log('disconnect')
      try {
        console.log({ accountConnected: this.accountConnected })
        if (this.accountConnected) {
          await this._appKitInstance.disconnect()
          const connected = this._appKitInstance.getIsConnectedState()
          if (connected) throw new Error('Failed to disconnect')
        }

        // Clear Discord auth
        localStorage.removeItem('authToken')

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

    // TODO: make sure that everywhere that an authenticated call is being made it's using session data from the store rather than reading directly from local storage.
    // TODO: saveSession should be used with in tandem with authenticated requests to use the current session data effectively.
    saveSession() {
      const session = {
        user: this.user,
        authMethod: this.authMethod,
        // Save current wallet state
        wallet: this.accountConnected
          ? {
              address: this.accountAddress,
              chainId: this.accountChainId
            }
          : null
      }
      console.log('save session', { session })
      localStorage.setItem('auth_session', JSON.stringify(session))
      this.session = session
    },

    async restoreSession(session) {
      console.log('restoreSession', { session })
      if (!session?.user) return false

      this.user = session.user
      this.authMethod = session.authMethod

      // Restore wallet state if it was connected
      if (session.wallet) {
        this.accountAddress = session.wallet.address
        this.accountChainId = session.wallet.chainId
        this.accountConnected = true
      }

      this.isAuthenticated = true

      // TODO: this seems strange. I think it's trying to confirm whether the discord connection is still valid with discord, meaning we can use the token stored in the database to do things for the user within discord. I don't think this is necessary since we're just using discord to authentiacte the user on our server.
      // If we have a Discord connection, verify it's still valid
      if (this.user?.linkedAccounts?.discord?.length) {
        try {
          console.log('restore session')
          await this.fetchUserStatus()
        } catch (error) {
          console.warn('Failed to restore Discord session:', error)
          // Don't throw the error, just log it
        }
      }

      return true
    },

    waitForConnection() {
      console.log('waitForConnection')
      return new Promise((resolve) => {
        const check = setInterval(() => {
          const connected = this._appKitInstance.getIsConnectedState()
          if (connected) {
            this.accountConnected = true
            clearInterval(check)
            resolve()
          } else {
            this.accountConnected = false
          }
        }, 500)
      })
    },

    async fetchUserStatus() {
      console.log('fetchUserStatus')
      try {
        const response = await fetch(`${backendUrl}/auth/status`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        })

        if (!response.ok) {
          if (response.status == 401) {
            this.disconnect()
          }
          throw new Error('Failed to fetch user status')
        }

        const json = await response.json()
        console.log({ json })

        const user = json.user
        if (user) {
          // Update user state with correct structure
          this.user = {
            id: user.id,
            username: user.username,
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
                lastUsed: p.lastUsed
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

          // Update wallet connection state if needed
          if (this.accountConnected && this.accountAddress) {
            this.updateWalletState()
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
        const response = await fetch(`${backendUrl}/auth/username`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
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
        const response = await fetch(`${backendUrl}/auth/disconnect-instance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({
            platform,
            platformId: instanceId
          })
        })

        if (!response.ok) {
          throw new Error('Failed to disconnect platform instance')
        }
        console.log('disconnecPlatformInstance')
        await this.fetchUserStatus()
      } catch (error) {
        console.error('Failed to disconnect platform instance:', error)
        throw error
      }
    }
  }
})
