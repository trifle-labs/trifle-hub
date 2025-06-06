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
          @click="
            auth.addNotification({
              message: 'Click one of your avatar\'s to set as your profile pic!'
            })
          "
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
      <div v-show="!isEditingUsername" class="_flex _justify-center _gap-1 _h-10 _items-center">
        <button
          class="_text-xl _shadow-panel _pl-[0.3em] _pr-[0.5em] _rounded-full _bg-metallic-cone _leading-none _py-[0.25em] _flex _gap-[0.2em] mouse:hover:_scale-[1.05] _duration-150"
          @click="openHub('earn')"
        >
          <span>🪩</span>
          <span class="_text-stroke-xl">{{ auth.user?.totalBalls }}</span>
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

    <!-- wallets -->
    <section class="_bg-metallic-linear _shadow-panel _p-4 _pb-5 _space-y-2 _rounded-lg">
      <div class="_flex _items-center _gap-2.5 _-mt-1.5">
        <!-- <img
          src="../../assets/imgs/ethereum-logo-white.svg"
          class="_size-6 _rounded"
          style="background-color: #f1584d; filter: grayscale(1)"
        /> -->
        <h3 class="_text-xl _weight-bold">wallet{{ walletAuths.length > 1 ? 's' : '' }}</h3>
      </div>
      <ul class="_space-y-2">
        <!-- wallets... -->
        <li
          v-for="wallet in walletAuths"
          :key="wallet.id"
          class="_flex _items-center _p-2 _pr-3.5 _justify-between _bg-metallic-linear _shadow-panel _rounded-lg"
        >
          <div class="_flex _items-center _gap-2">
            <button
              class="_size-11 _flex _items-stretch _p-1.5 _group _overflow-hidden"
              :class="[
                {
                  '_rounded-lg _shadow-panel': wallet.avatar,
                  '_shadow-panel-inset _bg-metallic-cone _cursor-default':
                    wallet.avatar === auth.user?.avatar
                }
              ]"
              :disabled="!wallet.avatar"
            >
              <div
                v-if="wallet.avatar"
                @click="() => setAvatar('wallet', wallet.id)"
                style="background: none"
                type="button"
                title="Set as profile avatar"
              >
                <img
                  :src="`${wallet.avatar}`"
                  class="_size-full _rounded-full _duration-150"
                  :class="{
                    'group-hover:_scale-[1.8]': wallet.avatar !== auth.user?.avatar
                  }"
                />
              </div>
              <div v-else class="_w-full _flex _items-center _justify-center">
                <img
                  src="../../assets/imgs/ethereum-logo-white.svg"
                  class="_size-6 _rounded"
                  style="background-color: #f1584d"
                />
              </div>
            </button>
            <div class="_flex-1 _min-w-0 _leading-tight">
              <div
                @click="
                  () =>
                    wallet.id.toLowerCase() == auth.accountAddress?.toLowerCase() &&
                    openAccountModal()
                "
                class="_flex-1 _min-w-0 _truncate _text-em-lg"
                :class="{
                  '_text-stroke-xl _tracking-wide':
                    walletAuths.length > 1 &&
                    auth.accountConnected &&
                    wallet.id.toLowerCase() === auth.accountAddress?.toLowerCase(),
                  'cursor-pointer': wallet.id.toLowerCase() == auth.accountAddress?.toLowerCase()
                }"
              >
                {{ wallet.username == wallet.id ? truncateAddress(wallet.id) : wallet.username }}
              </div>
              <div
                v-if="
                  auth.accountConnected &&
                  wallet.id.toLowerCase() === auth.accountAddress?.toLowerCase()
                "
                class="_text-em-2xs _text-gray-500 _leading-none"
              >
                connected
              </div>
            </div>
          </div>
          <!-- (disconnect wallet button) -->
          <template v-if="totalAccountConnections > 1">
            <button
              class="_bubble-btn _h-10 _text-sm _text-stroke-md _px-[1em]"
              @click="() => handleDisconnectPlatform('wallet', wallet.id)"
              styleff="filter: hue-rotate(130deg) saturate(2)"
              aria-label="Remove"
            >
              <span styleff="filter: hue-rotate(-130deg) saturate(0.5)">⛌</span>
            </button>
          </template>
        </li>
        <!-- (authenticate wallet button) -->
        <SplitWalletButton
          v-if="isAuthenticated && auth.accountConnected && auth.currentWalletNeedsAuth"
          :wallet-address="auth.accountAddress"
          :wallet-avatar="currentWallet?.avatar"
          :display-name="currentWallet?.username || accountAddress"
          >Authenticate {{ truncateAddress(auth.accountAddress) }}</SplitWalletButton
        >
        <!-- (link wallet button) -->
        <AuthButton
          v-if="isAuthenticated && !auth.accountConnected"
          platform="wallet"
          :points="!walletAuths.length ? '+10' : undefined"
          class="_w-full"
        >
          {{ walletAuths.length > 0 ? 'Link another Wallet' : 'Link Wallet' }}
        </AuthButton>
      </ul>
    </section>

    <!-- discord -->
    <section class="_bg-metallic-linear _shadow-panel _p-4 _pb-5 _space-y-2 _rounded-lg">
      <div v-if="discordAuths.length" class="_flex _items-center _gap-2.5 _-mt-1.5">
        <!-- <img
          src="../../assets/imgs/discord-logo.svg"
          class="_size-6 _rounded"
          style="background-color: #5865f2"
        /> -->
        <h3 class="_text-xl _weight-bold">discord</h3>
      </div>
      <ul class="_space-y-2">
        <!-- discords... -->
        <li
          v-for="discord in discordAuths"
          :key="discord.id"
          class="_flex _items-center _p-2 _pr-3.5 _justify-between _bg-metallic-linear _shadow-panel _rounded-lg"
        >
          <div class="_flex _items-center _gap-2">
            <button
              class="_size-11 _flex _items-stretch _p-1.5 _group _overflow-hidden"
              :class="[
                {
                  '_rounded-lg _shadow-panel': discord.avatar,
                  '_shadow-panel-inset _bg-metallic-cone _cursor-default':
                    discord.avatar === auth.user?.avatar
                }
              ]"
              :disabled="!discord.avatar"
            >
              <div
                v-if="discord.avatar"
                @click="() => setAvatar('discord', discord.id)"
                style="background: none"
                type="button"
                title="Set as profile avatar"
              >
                <img
                  :src="`${discord.avatar}`"
                  class="_size-full _rounded-full _duration-150"
                  :class="{
                    'group-hover:_scale-[1.8]': discord.avatar !== auth.user?.avatar
                  }"
                />
              </div>
              <div v-else class="_w-full _flex _items-center _justify-center">
                <img
                  src="../../assets/imgs/discord-logo.svg"
                  class="_size-6 _rounded"
                  style="background-color: #5865f2"
                />
              </div>
            </button>
            <div class="_flex-1 _min-w-0 _leading-tight">
              <div class="_flex-1 _min-w-0 _truncate _text-em-lg">
                {{ discord.username }}
              </div>
            </div>
          </div>
          <!-- (disconnect discord button) -->
          <template v-if="totalAccountConnections > 1">
            <button
              class="_bubble-btn _h-10 _text-sm _text-stroke-md _px-[1em]"
              @click="() => handleDisconnectPlatform('discord', discord.id)"
              styleff="filter: hue-rotate(130deg) saturate(2)"
              aria-label="Remove"
            >
              <span styleff="filter: hue-rotate(-130deg) saturate(0.5)">⛌</span>
            </button>
          </template>
        </li>
        <AuthButton v-if="!hasDiscordAuth" platform="discord" points="+10" class="_w-full">
          {{ discordAuths.length > 0 ? 'Link Another Discord' : 'Link Discord' }}
        </AuthButton>
      </ul>
    </section>

    <!-- farcaster -->
    <section class="_bg-metallic-linear _shadow-panel _p-4 _pb-5 _space-y-2 _rounded-lg">
      <div v-if="farcasterAuths.length" class="_flex _items-center _gap-2.5 _-mt-1.5">
        <!-- <img
          src="../../assets/imgs/farcaster-logo.svg"
          class="_size-6 _rounded"
          style="background-color: #000"
        /> -->
        <h3 class="_text-xl _weight-bold">farcaster</h3>
      </div>
      <ul class="_space-y-2">
        <!-- farcasters... -->
        <li v-for="farcaster in farcasterAuths" :key="farcaster.id">
          <div
            class="_flex _items-center _p-2 _pr-3.5 _justify-between _bg-metallic-linear _shadow-panel _rounded-lg"
          >
            <div class="_flex _items-center _gap-2">
              <button
                class="_size-11 _flex _items-stretch _p-1.5 _group _overflow-hidden"
                :class="[
                  {
                    '_rounded-lg _shadow-panel': farcaster.avatar,
                    '_shadow-panel-inset _bg-metallic-cone _cursor-default':
                      farcaster.avatar === auth.user?.avatar
                  }
                ]"
                :disabled="!farcaster.avatar"
              >
                <div
                  v-if="farcaster.avatar"
                  @click="() => setAvatar('farcaster', farcaster.id)"
                  style="background: none"
                  type="button"
                  title="Set as profile avatar"
                >
                  <img
                    :src="`${farcaster.avatar}`"
                    class="_size-full _rounded-full _duration-150"
                    :class="{
                      'group-hover:_scale-[1.8]': farcaster.avatar !== auth.user?.avatar
                    }"
                  />
                </div>
                <div v-else class="_w-full _flex _items-center _justify-center">
                  <img
                    src="../../assets/imgs/farcaster-logo.svg"
                    class="_size-6 _rounded"
                    style="background-color: #000"
                  />
                </div>
              </button>
              <div class="_flex-1 _min-w-0 _leading-tight">
                <div class="_flex-1 _min-w-0 _truncate _text-em-lg">
                  {{ farcaster.username }}
                </div>
              </div>
            </div>
            <!-- (disconnect farcaster button) -->
            <template v-if="totalAccountConnections > 1">
              <button
                class="_bubble-btn _h-10 _text-sm _text-stroke-md _px-[1em]"
                @click="() => handleDisconnectPlatform('farcaster', farcaster.id)"
                styleff="filter: hue-rotate(130deg) saturate(2)"
                aria-label="Remove"
              >
                <span styleff="filter: hue-rotate(-130deg) saturate(0.5)">⛌</span>
              </button>
            </template>
          </div>
          <div v-if="isFarcaster && !isFarcaster.client.added">
            <button class="_bubble-btn _h-10 _text-sm _text-stroke-md _px-[1em]" @click="addFrame">
              add app
            </button>
          </div>
        </li>
        <AuthButton v-if="!hasFarcasterAuth" platform="farcaster" points="+10" class="_w-full">
          {{ farcasterAuths.length > 0 ? 'Link Another Farcaster' : 'Link Farcaster' }}
        </AuthButton>
      </ul>
    </section>
    <footer
      class="_bg-metallic-cone _p-4 _rounded-lg _shadow-panel _flex _items-center _justify-center"
    >
      <button @click="handleLogout" class="_bubble-btn-full _h-16 _text-lg _bold">
        <span>logout 💤</span>
      </button>
    </footer>
  </AccountLayout>
</template>

<script setup>
import { computed, ref, inject, onMounted, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import smileyFaceSvg from '../../assets/imgs/smiley-face-dashed-outline.svg'
import AuthButton from '../../components/AuthButton.vue'
import AccountLayout from '../../components/AccountLayout.vue'
import TrifleBall from '../../components/TrifleBall/TrifleBall.vue'
import SplitWalletButton from '../../components/SplitWalletButton.vue'

const auth = inject('TrifleHub/store')
const { isAuthenticated, backendUrl } = storeToRefs(auth)

const isFarcaster = computed(() => auth.isFarcaster)

const addFrame = async () => {
  await auth.addFrame()
}

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

const totalAccountConnections = computed(
  () => walletAuths.value.length + discordAuths.value.length + farcasterAuths.value.length
)

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
    auth.addNotification({ type: 'success', message: 'Avatar updated!' })
  } catch (err) {
    auth.addNotification({ type: 'error', message: "Oops, couldn't set avatar. Try again?" })
    console.error('Failed to set avatar:', err)
  }
}

const accountConnected = computed(() => auth.accountConnected)
const currentWalletNeedsAuth = computed(() => auth.currentWalletNeedsAuth)
const accountAddress = computed(() => auth.accountAddress)
const isWalletAuthenticated = computed(() => auth.isWalletAuthenticated(accountAddress.value))
const currentWallet = computed(() => {
  if (!accountAddress.value) return null
  return walletAuths.value.find((w) => w.id?.toLowerCase() === accountAddress.value?.toLowerCase())
})
const openAccountModal = async () => {
  try {
    await auth.openAccountModal()
  } catch (e) {
    auth.addNotification({ type: 'error', message: "Couldn't open wallet modal" })
  }
}
</script>

<style></style>
