<template>
  <AccountLayout>
    <template #avatar>
      <object
        :data="smileyFaceSvg"
        alt="smiley face with dashed outline"
        class="_w-full _block _transform _origin-center _scale-[1.35] sm:_scale-[1.45]"
      ></object>
    </template>
    <template #title>
      {{ 'who r u??' }}
    </template>
    <template #description>
      <p>
        Link identities &rarr;
        <span class="_ffborder-b _border-current" style="border-style: dashed"> earn BALL$</span>
        🪩
      </p>
    </template>

    <section class="_w-full _px-1.5 sm:_px-8 _flex _flex-col _gap-4 _items-center">
      <nav class="_flex _flex-col _gap-1.5 _w-full _leading-none">
        <AuthButton platform="wallet" points="+10"> Login with Wallet </AuthButton>
        <AuthButton platform="discord" points="+10"> Login with Discord </AuthButton>
        <AuthButton platform="farcaster" points="+10"> Login with Farcaster </AuthButton>
      </nav>
      <!-- TODO: follow up with support request on how to do this
      <div class="_-my-2">or</div>
      <div class="_w-full _flex _flex-col _gap-1.5">
        <button class="_bubble-btn _p-4.5">
          <div class="_flex _justify-between _items-center _gap-2.5">
            <img
              src="../assets/imgs/ethereum-logo-white.svg"
              class="_size-7 _rounded-lg _bg-slate-400"
            />
            <div class="_flex-1 _min-w-0 _truncate _text-center">Create Smart Account</div>
            <div class="_size-7 _flex _justify-end _items-center">
              <div
                class="_whitespace-nowrap _leading-tight _pr-0.5 _pl-1 _bg-[rgba(250,250,255)]/40 _rounded-lg _text-[0.875em]"
              >
                +10 🪩
              </div>
            </div>
          </div>
        </button>
      </div>
      -->
    </section>
  </AccountLayout>
</template>

<script setup>
import { computed, ref, inject } from 'vue'
import { storeToRefs } from 'pinia'
import smileyFaceSvg from '../../assets/imgs/smiley-face-dashed-outline.svg'
import AuthButton from '../../components/AuthButton.vue'
import AccountLayout from '../../components/AccountLayout.vue'

const auth = inject('TrifleHub/store')
const { isAuthenticated, user, backendUrl } = storeToRefs(auth)

const telegramEnabled = ref(false)
const twitterEnabled = ref(false)
const farcasterEnabled = ref(true)

const walletAuths = computed(() => auth.getPlatformData('wallet'))
const discordAuths = computed(() => auth.getPlatformData('discord'))
const telegramAuths = computed(() => auth.getPlatformData('telegram'))
const twitterAuths = computed(() => auth.getPlatformData('twitter'))
const farcasterAuths = computed(() => auth.getPlatformData('farcaster'))

const hasDiscordAuth = computed(() => discordAuths.value.length > 0)
const hasTelegramAuth = computed(() => telegramAuths.value.length > 0)
const hasTwitterAuth = computed(() => twitterAuths.value.length > 0)
const hasFarcasterAuth = computed(() => farcasterAuths.value.length > 0)

let connectDebounce = false
const handleConnect = async (platform) => {
  if (connectDebounce) return
  connectDebounce = true
  setTimeout(() => {
    connectDebounce = false
  }, 1000)
  switch (platform) {
    case 'discord':
      await handleDiscordConnect()
      break
    case 'farcaster':
      await handleFarcasterConnect()
      break
    case 'wallet':
      await handleWalletConnect()
      break
    default:
      throw new Error(`Unsupported platform: ${platform}`)
  }
}

const handleFarcasterConnect = async () => {
  console.log('Farcaster connect clicked')
  try {
    await auth.connectFarcaster()
  } catch (err) {
    console.error('Farcaster connection failed:', err)
  }
}

const handleWalletConnect = async () => {
  try {
    await auth.connectWallet()
  } catch (err) {
    console.error('Wallet connection failed:', err)
  }
}

const handleDiscordConnect = async () => {
  try {
    await auth.connectDiscord()
  } catch (err) {
    if (err.message.includes('Authentication window closed')) {
      auth.addNotification({
        type: 'error',
        message: 'Discord authentication failed, please try again.'
      })
    }
    console.error('Discord connection failed:', err)
  }
}

const handleTelegramConnect = async () => {
  if (!telegramEnabled.value) return
  console.log('Telegram connect clicked (feature not fully implemented yet)')
}

const handleTwitterConnect = async () => {
  if (!twitterEnabled.value) return
  console.log('Twitter connect clicked (feature not fully implemented yet)')
}

const handleDisconnectPlatform = async (platform, instanceId) => {
  // TODO: @everett we need a message system for this
  // if (!confirm('Are you sure you want to disconnect this account?')) return
  console.log(`disconnecting ${platform} instance ${instanceId}`)
  try {
    await auth.disconnectPlatformInstance(platform, instanceId)
  } catch (err) {
    console.error(`Failed to disconnect ${platform} instance:`, err)
  }
}

const truncateAddress = (address) => {
  if (!address) return ''
  return `0x${address.slice(2, 6).toUpperCase()}...${address.slice(-4).toUpperCase()}`
}

const isEditingUsername = ref(false)
const newUsername = ref('')
const usernameLoading = ref(false)
const usernameError = ref('')
const isCheckingUsername = ref(false)
const usernameAvailable = ref(true)
let usernameCheckTimeout

const checkUsername = async (username) => {
  if (!username) {
    usernameAvailable.value = true
    usernameError.value = ''
    return
  }
  if (username === auth.user?.username) {
    usernameAvailable.value = true
    usernameError.value = ''
    return
  }

  const isAlphaNumeric = /^(?!.*--)[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/.test(username)
  if (!isAlphaNumeric) {
    usernameError.value = 'Username must be alphanumeric'
    return
  }

  if (username.length > 22) {
    usernameError.value = 'Username must be 22 characters or less'
    return
  }

  isCheckingUsername.value = true
  try {
    const response = await fetch(
      `${backendUrl.value}/auth/username/check?username=${encodeURIComponent(username)}`
    )
    if (!response.ok) throw new Error('Failed to check username availability')
    const data = await response.json()
    usernameAvailable.value = data.available
    usernameError.value = data.available ? '' : 'This username is already taken'
  } catch (err) {
    console.error('Failed to check username:', err)
    usernameError.value = 'Error checking username'
  } finally {
    isCheckingUsername.value = false
  }
}

const handleUsernameInput = (event) => {
  const username = event.target.value.trim()
  newUsername.value = username
  usernameError.value = ''
  if (usernameCheckTimeout) clearTimeout(usernameCheckTimeout)
  if (username) {
    usernameCheckTimeout = setTimeout(() => checkUsername(username), 500)
  } else {
    usernameAvailable.value = true
  }
}

const startEditingUsername = () => {
  isEditingUsername.value = true
  newUsername.value = auth.user?.username || ''
  usernameError.value = ''
  usernameAvailable.value = true
}

const saveUsername = async () => {
  if (!newUsername.value.trim()) {
    usernameError.value = 'Username is required'
    return
  }
  if (!usernameAvailable.value) {
    usernameError.value = 'This username is already taken'
    return
  }
  if (newUsername.value.trim() === auth.user?.username) {
    isEditingUsername.value = false
    return
  }

  usernameLoading.value = true
  try {
    await auth.updateUsername(newUsername.value.trim())
    isEditingUsername.value = false
    usernameError.value = ''
  } catch (err) {
    console.error('Failed to update username:', err)
    usernameError.value = err.message || 'Failed to update username'
  } finally {
    usernameLoading.value = false
  }
}

const cancelEditingUsername = () => {
  isEditingUsername.value = false
  newUsername.value = ''
  usernameError.value = ''
  usernameAvailable.value = true
}

const handleLogout = async () => {
  try {
    await auth.disconnect()
    console.log('User logged out')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

const setAvatar = async (platform, platformId) => {
  try {
    const response = await fetch(`${backendUrl.value}/auth/avatar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ platform, platformId })
    })
    if (!response.ok) throw new Error('Failed to set avatar')
    await auth.fetchUserStatus()
  } catch (err) {
    alert('Failed to set avatar. Please try again.')
    console.error('Failed to set avatar:', err)
  }
}
</script>
