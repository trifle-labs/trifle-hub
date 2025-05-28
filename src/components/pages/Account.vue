<template>
  <div
    class="_p-4 _w-full _flex _flex-col _gap-4 _items-center _overflow-y-scroll-masked _no-scrollbar"
  >
    <header class="_pt-10 _flex _flex-col _gap-3 _items-center _mb-4">
      <div class="_size-24 _rounded-full">
        <img
          v-if="auth.user?.avatar"
          :src="`${auth.user?.avatar}`"
          alt="user avatar"
          class="_w-full _block _transform _origin-center _scale-[1.35] sm:_scale-[1.45] _rounded-full"
        />
        <object
          v-else
          :data="smileyFaceSvg"
          alt="smiley face with dashed outline"
          class="_w-full _block _transform _origin-center _scale-[1.35] sm:_scale-[1.45]"
        ></object>
      </div>
      <div
        class="_text-5xl _tracking-wide _w-full _text-center _truncate _min-w-0 _leading-tight _weight-black"
      >
        {{ isAuthenticated ? 'Connections' : 'who r u??' }}
      </div>
      <div v-if="!isAuthenticated">
        Link identities &rarr;
        <span class="_ffborder-b _border-current" style="border-style: dashed"> earn BALL$</span>
        🪩
      </div>
      <p v-else class="_text-gray-600 _text-center">Manage your authenticated platforms.</p>
    </header>
    <section
      v-if="!isAuthenticated"
      class="_mt-1.5 _w-full _px-1.5 sm:_px-8 _flex _flex-col _gap-4 _items-center"
    >
      <nav class="_flex _flex-col _gap-1.5 _w-full _leading-none">
        <button
          class="_bubble-btn _p-4.5"
          :disabled="walletAuths.length > 0 && isAuthenticated"
          @click="handleConnect('wallet')"
          style="filter: hue-rotate(-236deg) saturate(1.35)"
        >
          <div
            class="_flex _justify-between _items-center _gap-2.5"
            style="filter: hue-rotate(236deg) saturate(0.75)"
          >
            <img
              src="../../assets/imgs/ethereum-logo-white.svg"
              class="_size-7 _rounded-lg"
              style="background-color: #f1584d"
            />
            <div class="_flex-1 _min-w-0 _truncate _text-center">Login with Wallet</div>
            <div class="_size-7 _flex _justify-end _items-center">
              <div
                class="_whitespace-nowrap _leading-tight _pr-0.5 _pl-1 _bg-[rgba(250,250,255)]/40 _rounded-lg _text-[0.875em]"
              >
                +10 🪩
              </div>
            </div>
          </div>
        </button>
        <button
          :disabled="hasDiscordAuth && isAuthenticated"
          class="_bubble-btn _p-4.5"
          @click="handleConnect('discord')"
          style="filter: hue-rotate(-345deg) saturate(2)"
        >
          <div
            class="_flex _justify-between _items-center _gap-2.5"
            style="filter: hue-rotate(345deg) saturate(0.5)"
          >
            <img src="../../assets/imgs/discord-logo.svg" class="_size-7 _rounded-lg" />
            <div class="_flex-1 _min-w-0 _truncate _text-center">Login with Discord</div>
            <div class="_size-7 _flex _justify-end _items-center">
              <div
                class="_whitespace-nowrap _leading-tight _pr-0.5 _pl-1 _bg-[rgba(250,250,255)]/40 _rounded-lg _text-[0.875em]"
              >
                +10 🪩
              </div>
            </div>
          </div>
        </button>
        <button
          v-if="false"
          class="_bubble-btn _p-4.5"
          :disabled="!telegramEnabled || (hasTelegramAuth && isAuthenticated)"
          @click="handleConnect('telegram')"
          :style="{
            filter: !telegramEnabled ? 'brightness(0.8)' : 'hue-rotate(-20deg) saturate(1.8)'
          }"
        >
          <div
            class="_flex _justify-between _items-center _gap-2.5"
            :style="{ filter: !telegramEnabled ? '' : 'hue-rotate(20deg) saturate(0.6)' }"
          >
            <img src="../../assets/imgs/telegram-logo.svg" class="_size-7 _rounded-lg" />
            <div class="_flex-1 _min-w-0 _truncate _text-center">Login with Telegram</div>
            <div class="_size-7 _flex _justify-end _items-center">
              <div
                v-if="telegramEnabled"
                class="_whitespace-nowrap _leading-tight _pr-0.5 _pl-1 _bg-[rgba(250,250,255)]/40 _rounded-lg _text-[0.875em]"
              >
                +10 🪩
              </div>
              <div v-else class="_text-[0.875em] _pr-0.5 _opacity-70">soon</div>
            </div>
          </div>
        </button>
        <button
          v-if="false"
          class="_bubble-btn _p-4.5"
          :disabled="!twitterEnabled || (hasTwitterAuth && isAuthenticated)"
          @click="handleConnect('twitter')"
          :style="{ filter: !twitterEnabled ? 'brightness(0.8)' : 'brightness(0.93)' }"
        >
          <div class="_flex _justify-between _items-center _gap-2.5">
            <img
              src="../../assets/imgs/twitter-x-logo.svg"
              class="_size-7 _rounded-lg"
              :style="{ filter: !twitterEnabled ? 'grayscale(1)' : '' }"
            />
            <div class="_flex-1 _min-w-0 _truncate _text-center">Login with TwitterX</div>
            <div class="_size-7 _flex _justify-end _items-center">
              <div
                v-if="twitterEnabled"
                class="_whitespace-nowrap _leading-tight _pr-0.5 _pl-1 _bg-[rgba(250,250,255)]/40 _rounded-lg _text-[0.875em]"
              >
                +10 🪩
              </div>
              <div v-else class="_text-[0.875em] _pr-0.5 _opacity-70">soon</div>
            </div>
          </div>
        </button>
        <button
          class="_bubble-btn _p-4.5"
          @click="handleConnect('farcaster')"
          :style="{
            filter: !farcasterEnabled ? 'brightness(0.8)' : 'hue-rotate(-335deg) saturate(2)'
          }"
        >
          <div
            class="_flex _justify-between _items-center _gap-2.5"
            :style="{ filter: !farcasterEnabled ? '' : 'hue-rotate(335deg) saturate(0.5)' }"
          >
            <img src="../../assets/imgs/farcaster-logo.svg" class="_size-7 _rounded-lg" />
            <div class="_flex-1 _min-w-0 _truncate _text-center">Login with Farcaster</div>
            <div class="_size-7 _flex _justify-end _items-center">
              <div
                v-if="farcasterEnabled"
                class="_whitespace-nowrap _leading-tight _pr-0.5 _pl-1 _bg-[rgba(250,250,255)]/40 _rounded-lg _text-[0.875em]"
              >
                +10 🪩
              </div>
              <div v-else class="_text-[0.875em] _pr-0.5 _opacity-70">soon</div>
            </div>
          </div>
        </button>
      </nav>
      <!-- TODO: follow up with support request on how to do this
      <div class="_-my-2">or</div>
      <div class="_w-full _flex _flex-col _gap-1.5">
        <button class="_bubble-btn _p-4.5">
          <div class="_flex _justify-between _items-center _gap-2.5">
            <img
              src="../../assets/imgs/ethereum-logo-white.svg"
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
    <section v-else class="_w-full _max-w-2xl _mx-auto _flex _flex-col _gap-4">
      <div class="_bg-white/70 _rounded-lg _shadow _p-4 sm:_p-6">
        <div class="_flex _items-center _justify-between _mb-3">
          <h3 class="_text-lg _font-medium _text-gray-900">Username</h3>
        </div>
        <div class="_relative group">
          <div
            v-if="!isEditingUsername"
            class="_flex _items-center _justify-between _p-3 _bg-gray-50/80 _rounded-lg group-hover:_bg-gray-100/80"
          >
            <span class="_text-gray-900">{{ auth.user?.username || 'Not set' }}</span>
            <button
              @click="startEditingUsername"
              class="focus:_opacity-100 _transition-opacity _text-sm _text-blue-600 hover:_text-blue-800"
            >
              Edit
            </button>
          </div>
          <div v-else class="_flex _flex-col sm:_flex-row _items-stretch sm:_items-center _gap-2">
            <input
              v-model="newUsername"
              type="text"
              maxlength="22"
              autocomplete="off"
              data-1p-ignore
              class="_flex-1 _p-2 _border _rounded focus:_ring-2 focus:_ring-blue-500 focus:_border-blue-500 _outline-none"
              :class="{ '_border-red-500': !usernameAvailable && newUsername }"
              placeholder="Enter new username"
              @input="handleUsernameInput"
              @keyup.enter="saveUsername"
            />
            <div class="_flex _items-center _gap-2 _justify-end">
              <button
                @click="saveUsername"
                class="_px-3 _py-1.5 _text-sm _bg-blue-500 _text-white _rounded hover:_bg-blue-600 _transition-colors disabled:_opacity-50 disabled:_cursor-not-allowed"
                :disabled="
                  usernameLoading ||
                  !usernameAvailable ||
                  isCheckingUsername ||
                  newUsername === auth.user?.username
                "
              >
                {{ usernameLoading ? 'Saving...' : isCheckingUsername ? 'Checking...' : 'Save' }}
              </button>
              <button
                @click="cancelEditingUsername"
                class="_px-3 _py-1.5 _text-sm _bg-gray-200 _text-gray-700 _rounded hover:_bg-gray-300 _transition-colors"
                :disabled="usernameLoading"
              >
                Cancel
              </button>
            </div>
          </div>
          <div v-if="usernameError && isEditingUsername" class="_mt-2 _text-sm _text-red-600">
            {{ usernameError }}
          </div>
        </div>
      </div>
      <div class="_bg-white/70 _rounded-lg _shadow _p-4 sm:_p-6">
        <div class="_flex _items-center _justify-between _mb-3">
          <h3 class="_text-lg _font-medium _text-gray-900">Wallet</h3>
        </div>
        <div class="_mt-2 _space-y-3">
          <div
            v-for="wallet in walletAuths"
            :key="wallet.id"
            class="_flex _items-center _justify-between _p-3 _bg-gray-50/80 _rounded-lg"
          >
            <div class="_flex _items-center _gap-2">
              <button
                v-if="wallet.avatar"
                @click="() => setAvatar('wallet', wallet.id)"
                :class="[
                  '_p-0 _rounded-full _focus:_ring-2 _focus:_ring-blue-300 _transition-shadow _cursor-pointer',
                  wallet.avatar === auth.user?.avatar
                    ? '_border-4 _border-blue-500 shadow-[0_0_0_2px_rgba(34,197,94,0.3)]'
                    : '_border-2 _border-blue-400 hover:_border-blue-600'
                ]"
                style="background: none"
                type="button"
                title="Set as profile avatar"
              >
                <img :src="`${wallet.avatar}`" class="_size-6 _rounded-full" />
              </button>
              <img
                v-else
                src="../../assets/imgs/ethereum-logo-white.svg"
                class="_size-6 _rounded"
                style="background-color: #f1584d"
              />
              <span class="_text-sm _font-mono _text-gray-800">
                {{ wallet.username == wallet.id ? truncateAddress(wallet.id) : wallet.username }}
              </span>
              <span
                v-if="
                  auth.accountConnected &&
                  wallet.id.toLowerCase() === auth.accountAddress?.toLowerCase()
                "
                class="_px-1.5 _py-0.5 _text-xs _bg-green-100 _text-green-800 _rounded"
              >
                Current
              </span>
            </div>
            <button
              @click="() => handleDisconnectPlatform('wallet', wallet.id)"
              class="_text-sm _text-red-600 hover:_text-red-800 _font-medium"
            >
              Remove
            </button>
          </div>

          <button
            v-if="isAuthenticated && auth.accountConnected && auth.currentWalletNeedsAuth"
            @click="() => auth.authenticateWithWallet(auth.accountAddress)"
            class="_bubble-btn _p-3.5 _w-full"
            style="filter: hue-rotate(-200deg) saturate(1.5)"
          >
            <div
              class="_flex _justify-center _items-center _gap-2"
              style="filter: hue-rotate(200deg) saturate(0.65)"
            >
              <img
                src="../../assets/imgs/ethereum-logo-white.svg"
                class="_size-6 _rounded-lg"
                style="background-color: #5ca4e2"
              />
              <span class="_text-center"
                >Authenticate {{ truncateAddress(auth.accountAddress) }}</span
              >
            </div>
          </button>
          <button
            v-else-if="isAuthenticated && !auth.accountConnected"
            @click="handleConnect('wallet')"
            class="_bubble-btn _p-3.5 _w-full"
            style="filter: hue-rotate(-236deg) saturate(1.35)"
          >
            <div
              class="_flex _justify-center _items-center _gap-2"
              style="filter: hue-rotate(236deg) saturate(0.75)"
            >
              <img
                src="../../assets/imgs/ethereum-logo-white.svg"
                class="_size-6 _rounded-lg"
                style="background-color: #f1584d"
              />
              <span class="_text-center">Link Wallet</span>
            </div>
          </button>
        </div>
      </div>
      <div class="_bg-white/70 _rounded-lg _shadow _p-4 sm:_p-6">
        <div class="_flex _items-center _justify-between _mb-3">
          <h3 class="_text-lg _font-medium _text-gray-900">Discord</h3>
        </div>
        <div class="_mt-2 _space-y-3">
          <div
            v-for="discord in discordAuths"
            :key="discord.id"
            class="_flex _items-center _justify-between _p-3 _bg-gray-50/80 _rounded-lg"
          >
            <div class="_flex _items-center _gap-2">
              <button
                v-if="discord.avatar"
                @click="() => setAvatar('discord', discord.id)"
                :class="[
                  '_p-0 _rounded-full _focus:_ring-2 _focus:_ring-blue-300 _transition-shadow _cursor-pointer',
                  discord.avatar === auth.user?.avatar
                    ? '_border-4 _border-blue-500 shadow-[0_0_0_2px_rgba(34,197,94,0.3)]'
                    : '_border-2 _border-blue-400 hover:_border-blue-600'
                ]"
                style="background: none"
                type="button"
                title="Set as profile avatar"
              >
                <img
                  :src="`${discord.avatar}`"
                  :alt="discord.username"
                  class="_size-6 _rounded-full"
                />
              </button>
              <img v-else src="../../assets/imgs/discord-logo.svg" class="_size-6 _rounded-lg" />
              <span class="_text-gray-800">{{ discord.username }}</span>
            </div>
            <button
              @click="() => handleDisconnectPlatform('discord', discord.id)"
              class="_text-sm _text-red-600 hover:_text-red-800 _font-medium"
            >
              Remove
            </button>
          </div>
          <button
            v-if="!hasDiscordAuth"
            @click="handleDiscordConnect"
            class="_bubble-btn _p-3.5 _w-full"
            style="filter: hue-rotate(-345deg) saturate(2)"
          >
            <div
              class="_flex _justify-center _items-center _gap-2"
              style="filter: hue-rotate(345deg) saturate(0.5)"
            >
              <img src="../../assets/imgs/discord-logo.svg" class="_size-6 _rounded-lg" />
              <span class="_text-center">{{
                discordAuths.length > 0 ? 'Link Another Discord' : 'Link Discord'
              }}</span>
            </div>
          </button>
        </div>
      </div>
      <div class="_bg-white/70 _rounded-lg _shadow _p-4 sm:_p-6">
        <div class="_flex _items-center _justify-between _mb-3">
          <h3 class="_text-lg _font-medium _text-gray-900">Farcaster</h3>
        </div>
        <div class="_mt-2 _space-y-3">
          <div
            v-for="farcaster in farcasterAuths"
            :key="farcaster.id"
            class="_flex _items-center _justify-between _p-3 _bg-gray-50/80 _rounded-lg"
          >
            <div class="_flex _items-center _gap-2">
              <button
                v-if="farcaster.avatar"
                @click="() => setAvatar('farcaster', farcaster.id)"
                :class="[
                  '_p-0 _rounded-full _focus:_ring-2 _focus:_ring-blue-300 _transition-shadow _cursor-pointer',
                  farcaster.avatar === auth.user?.avatar
                    ? '_border-4 _border-blue-500 shadow-[0_0_0_2px_rgba(34,197,94,0.3)]'
                    : '_border-2 _border-blue-400 hover:_border-blue-600'
                ]"
                style="background: none"
                type="button"
                title="Set as profile avatar"
              >
                <img
                  :src="`${farcaster.avatar}`"
                  :alt="farcaster.username"
                  class="_size-6 _rounded-full"
                />
              </button>
              <img v-else src="../../assets/imgs/farcaster-logo.svg" class="_size-6 _rounded-lg" />
              <span class="_text-gray-800">{{ farcaster.username }}</span>
            </div>
            <button
              @click="() => handleDisconnectPlatform('farcaster', farcaster.id)"
              class="_text-sm _text-red-600 hover:_text-red-800 _font-medium"
            >
              Remove
            </button>
          </div>
          <button
            v-if="!hasFarcasterAuth"
            @click="handleConnect('farcaster')"
            class="_bubble-btn _p-3.5 _w-full"
            style="filter: hue-rotate(-335deg) saturate(2)"
          >
            <div
              class="_flex _justify-center _items-center _gap-2"
              style="filter: hue-rotate(335deg) saturate(0.5)"
            >
              <img src="../../assets/imgs/farcaster-logo.svg" class="_size-6 _rounded-lg" />
              <span class="_text-center">{{
                farcasterAuths.length > 0 ? 'Link Another Farcaster' : 'Link Farcaster'
              }}</span>
            </div>
          </button>
        </div>
      </div>
      <div class="_mt-8 _pt-4 _border-t _border-gray-200/80 _text-center">
        <button
          @click="handleLogout"
          class="_px-5 _py-2 _text-sm _font-medium _text-red-600 _bg-red-100/80 hover:_bg-red-200/80 _rounded-lg _transition-colors"
        >
          Logout
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, inject } from 'vue'
import { storeToRefs } from 'pinia'
import smileyFaceSvg from '../../assets/imgs/smiley-face-dashed-outline.svg'

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
  return `${address.slice(0, 6)}...${address.slice(-4)}`
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

<style>
._bubble-btn {
  border-radius: 10px;
  border-image-source: url(../../assets/imgs/bubblegum-recess.png);
  border-image-slice: 82 95 77 92 fill;
  border-image-width: 17px;
  border-image-outset: 0px;
  border-image-repeat: stretch;
  background-color: transparent;
  user-select: none;
  margin: -4px -8px -5px -8px;
  transition: border-image-width 0.1s ease-in-out;
}
._bubble-btn:active:not([disabled]) {
  border-image-width: 15px;
}
._bubble-btn:active:not([disabled]) > * {
  transform: scale(0.995);
  transform-origin: center;
}
@media (hover: hover) {
  ._bubble-btn:hover:not([disabled]) {
    border-image-width: 19px;
  }
}
._simple-btn {
  @apply _px-3 _py-1.5 _text-sm _text-white _rounded _transition-colors;
}
._simple-btn-blue {
  @apply _bg-blue-500 hover:_bg-blue-600;
}
._simple-btn-red {
  @apply _bg-red-500 hover:_bg-red-600;
}
</style>
