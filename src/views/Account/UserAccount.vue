<template>
  <AccountLayout>
    <template #avatar>
      <div
        class="_size-full _flex _items-center _justify-center _rounded-full _duration-150 _delay-50"
        style="box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.4)"
        :class="{ '_opacity-0': !doneAnimating }"
      >
        <TrifleBall
          v-if="doneAnimating"
          :key="auth.user?.avatar || auth.isFarcaster?.user?.avatar || 'smiley-face'"
          mode="glass-inner-wall"
          :image-source="auth.user?.avatar || auth.isFarcaster?.user?.avatar || smileyFaceSvg"
          style="width: 175%; height: 175%"
          class="_cursor-grab"
        />
      </div>
    </template>
    <template #title>
      <!-- (username) -->
      <div
        v-show="!isEditingUsername"
        class="_h-12 _flex _items-center _gap-1 _w-full _justify-center _pl-[1em] _border _border-transparent"
      >
        <span class="_text-stroke-2xl _min-w-0 _truncate _px-0.5">
          {{ auth.user?.username || 'Not set' }}
        </span>
        <!-- edit username button -->
        <button
          class="_p-0.5 _-m-0.5 _leading-none _flex-shrink-0 _block mouse:hover:_scale-[1.2] _duration-150"
          @click="startEditingUsername"
        >
          <div class="_scale-x-[-1] _rotate-[-35deg] _text-stroke-lg _opacity-20">✏</div>
        </button>
      </div>
      <!-- (edit username form) -->
      <div
        v-show="isEditingUsername"
        class="_relative _h-12 _flex _items-stretch _gap-0.5 _px-1 _rounded-lg _shadow-panel-inset _text-center _bg-metallic-linear"
      >
        <input
          ref="usernameInput"
          v-model="newUsername"
          type="text"
          maxlength="22"
          autocomplete="off"
          data-1p-ignore
          class="_flex-1 _text-stroke-2xl _bg-transparent _text-center _w-full _outline-none"
          :class="{ '_border-red-500': !usernameAvailable && newUsername }"
          placeholder="Enter new username"
          @input="handleUsernameInput"
          @keyup.enter="saveUsername"
        />
      </div>
    </template>
    <template #description>
      <!-- <p class="_text-gray-600 _text-center">Manage your authenticated platforms.</p> -->
      <div v-show="!isEditingUsername" class="_flex _justify-center _gap-1 _h-10 _items-center">
        <button
          class="_text-xl _shadow-panel _pl-[0.3em] _pr-[0.5em] _rounded-full _bg-metallic-cone _leading-none _py-[0.25em] _flex _gap-[0.2em]"
          @click="openHub('earn')"
        >
          <span>🪩</span>
          <!-- TODO: use live points -->
          <span class="_text-stroke-xl">1,524</span>
        </button>
      </div>
      <div v-show="isEditingUsername" class="_flex _justify-center _gap-1 _h-10 _items-center">
        <button
          class="_bubble-btn _h-11 _text-base _min-w-[5em] _weight-semibold"
          style="filter: hue-rotate(-340deg) saturate(1.8)"
          @click="saveUsername"
        >
          <span style="filter: hue-rotate(340deg) saturate(0.5)">Save</span>
        </button>
        <button
          class="_bubble-btn _h-11 _text-base _min-w-[5em] _weight-semibold"
          @click="cancelEditingUsername"
        >
          <span>Cancel</span>
        </button>
      </div>
    </template>

    <section class="_w-full _max-w-2xl _mx-auto _flex _flex-col _gap-4">
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

          <!-- <button
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
                src="../assets/imgs/ethereum-logo-white.svg"
                class="_size-6 _rounded-lg"
                style="background-color: #5ca4e2"
              />
              <span class="_text-center"
                >Authenticate {{ truncateAddress(auth.accountAddress) }}</span
              >
            </div>
          </button> -->
          <AuthButton
            v-if="isAuthenticated && auth.accountConnected && auth.currentWalletNeedsAuth"
            platform="wallet"
            class="_w-full"
            @click="() => auth.authenticateWithWallet(auth.accountAddress)"
            >Authenticate {{ truncateAddress(auth.accountAddress) }}</AuthButton
          >
          <AuthButton
            v-if="isAuthenticated && !auth.accountConnected"
            platform="wallet"
            :points="!walletAuths.length ? '+10' : undefined"
            class="_w-full"
          >
            Link Wallet
          </AuthButton>
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
          <AuthButton v-if="!hasDiscordAuth" platform="discord" points="+10" class="_w-full">
            {{ discordAuths.length > 0 ? 'Link Another Discord' : 'Link Discord' }}
          </AuthButton>
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
          <AuthButton v-if="!hasFarcasterAuth" platform="farcaster" points="+10" class="_w-full">
            {{ farcasterAuths.length > 0 ? 'Link Another Farcaster' : 'Link Farcaster' }}
          </AuthButton>
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
  </AccountLayout>
</template>

<script setup>
import { computed, ref, inject, onMounted, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import smileyFaceSvg from '../../assets/imgs/smiley-face-dashed-outline.svg'
import AuthButton from '../../components/AuthButton.vue'
import AccountLayout from '../../components/AccountLayout.vue'
import TrifleBall from '../../components/TrifleBall/TrifleBall.vue'

const auth = inject('TrifleHub/store')
const { isAuthenticated, backendUrl } = storeToRefs(auth)

const doneAnimating = ref(false)
onMounted(() => {
  setTimeout(() => {
    doneAnimating.value = true
  }, 300) // need to wait for hub open animation otherwise webgl 0px error
})

const { openHub } = inject('hub')

const usernameInput = ref(null)

const walletAuths = computed(() => auth.getPlatformData('wallet'))
const discordAuths = computed(() => auth.getPlatformData('discord'))
const farcasterAuths = computed(() => auth.getPlatformData('farcaster'))

const hasDiscordAuth = computed(() => discordAuths.value.length > 0)
const hasFarcasterAuth = computed(() => farcasterAuths.value.length > 0)

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

const startEditingUsername = async () => {
  usernameError.value = ''
  newUsername.value = auth.user?.username || ''
  isEditingUsername.value = true
  usernameAvailable.value = true
  await nextTick()
  usernameInput.value.focus()
  usernameInput.value.select()
}

const saveUsername = async () => {
  if (!newUsername.value.trim()) {
    auth.addNotification({ type: 'error', message: "Oops, name can't be empty!" })
    return
  }
  if (!usernameAvailable.value) {
    auth.addNotification({ type: 'error', message: 'This name is already taken' })
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
    auth.addNotification({ type: 'success', message: 'Name updated!' })
  } catch (err) {
    console.error('Failed to update name:', err)
    auth.addNotification({ type: 'error', message: 'Hmm, something went wrong' })
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

<style></style>
