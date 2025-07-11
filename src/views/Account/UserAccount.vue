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
          class="_p-1 _-m-0.5 _leading-none _flex-shrink-0 _block mouse:hover:_scale-[1.2] _duration-150 _rounded-md"
          @click="startEditingUsername"
        >
          <img
            src="../../assets/imgs/pencil-icon.png"
            class="_h-[0.72em] _opacity-20 _pointer-events-none"
          />
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
          @click="openProfile"
        >
          <span>🪩</span>
          <span class="_text-stroke-xl">{{ auth.user?.totalBalls?.toLocaleString() }}</span>
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

    <section class="_flex _flex-col _gap-[inherit]">
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
        <ul class="_flex _flex-col _gap-2">
          <!-- wallets... -->
          <li
            v-for="wallet in walletAuths"
            :key="wallet.id"
            class="_flex _items-center _p-2 _pr-3.5 _justify-between _bg-metallic-linear _shadow-panel _rounded-lg"
            :class="{
              '_order-first':
                auth.accountConnected &&
                wallet.id.toLowerCase() === auth.accountAddress?.toLowerCase()
            }"
          >
            <div class="_flex _items-center _gap-2">
              <button
                class="_size-11 _flex _items-stretch _p-1.5 _group _rounded-md _overflow-hidden"
                :class="[
                  {
                    '_shadow-panel': wallet.avatar,
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
                    @error="avatarFallback.handleImageError"
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
                  <template v-if="wallet.metadata?.origin">
                    via {{ wallet.metadata.origin }}
                  </template>
                </div>
                <div
                  class="_text-em-2xs _text-gray-500 _leading-none"
                  v-else-if="wallet.metadata?.origin"
                >
                  via {{ wallet.metadata.origin }}
                </div>
              </div>
            </div>
            <!-- (disconnect wallet button) -->
            <template v-if="totalAccountConnections > 1">
              <button
                class="_bubble-btn _h-10 _text-sm _text-stroke-md _px-[1em]"
                @click="(e) => handleDisconnectPlatform('wallet', wallet.id, e)"
                styleff="filter: hue-rotate(130deg) saturate(2)"
                aria-label="Remove"
              >
                <span styleff="filter: hue-rotate(-130deg) saturate(0.5)">
                  <template
                    v-if="
                      aboutToDisconnect.platform == 'wallet' && aboutToDisconnect.id == wallet.id
                    "
                  >
                    Confirm?
                  </template>
                  <template v-else> ⛌ </template>
                </span>
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
                class="_size-11 _flex _items-stretch _p-1.5 _group _overflow-hidden _rounded-md"
                :class="[
                  {
                    '_shadow-panel': discord.avatar,
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
                    @error="avatarFallback.handleImageError"
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
                @click="(e) => handleDisconnectPlatform('discord', discord.id, e)"
                styleff="filter: hue-rotate(130deg) saturate(2)"
                aria-label="Remove"
              >
                <span styleff="filter: hue-rotate(-130deg) saturate(0.5)">
                  <template
                    v-if="
                      aboutToDisconnect.platform == 'discord' && aboutToDisconnect.id == discord.id
                    "
                  >
                    Confirm?
                  </template>
                  <template v-else> ⛌ </template>
                </span>
              </button>
            </template>
          </li>
          <AuthButton v-if="!hasDiscordAuth" platform="discord" points="+10" class="_w-full">
            {{ discordAuths.length > 0 ? 'Link Another Discord' : 'Link Discord' }}
          </AuthButton>
        </ul>
      </section>

      <!-- twitter -->
      <section class="_bg-metallic-linear _shadow-panel _p-4 _pb-5 _space-y-2 _rounded-lg">
        <div v-if="twitterAuths.length" class="_flex _items-center _gap-2.5 _-mt-1.5">
          <h3 class="_text-xl _weight-bold">twitter</h3>
        </div>
        <ul class="_space-y-2">
          <!-- twitters... -->
          <li
            v-for="twitter in twitterAuths"
            :key="twitter.id"
            class="_flex _items-center _p-2 _pr-3.5 _justify-between _bg-metallic-linear _shadow-panel _rounded-lg"
          >
            <div class="_flex _items-center _gap-2">
              <button
                class="_size-11 _flex _items-stretch _p-1.5 _group _overflow-hidden _rounded-md"
                :class="[
                  {
                    '_shadow-panel': twitter.avatar,
                    '_shadow-panel-inset _bg-metallic-cone _cursor-default':
                      twitter.avatar === auth.user?.avatar
                  }
                ]"
                :disabled="!twitter.avatar"
              >
                <div
                  v-if="twitter.avatar"
                  @click="() => setAvatar('twitter', twitter.id)"
                  style="background: none"
                  type="button"
                  title="Set as profile avatar"
                >
                  <img
                    :src="`${twitter.avatar}`"
                    class="_size-full _rounded-full _duration-150"
                    :class="{
                      'group-hover:_scale-[1.8]': twitter.avatar !== auth.user?.avatar
                    }"
                    @error="avatarFallback.handleImageError"
                  />
                </div>
                <div v-else class="_w-full _flex _items-center _justify-center">
                  <img
                    src="../../assets/imgs/twitter-x-logo.svg"
                    class="_size-6 _rounded"
                    style="background-color: #000"
                  />
                </div>
              </button>
              <div class="_flex-1 _min-w-0 _leading-tight">
                <div class="_flex-1 _min-w-0 _truncate _text-em-lg">
                  {{ twitter.username }}
                </div>
                <div
                  v-if="twitter.metadata?.verified"
                  class="_text-em-2xs _text-blue-400 _leading-none"
                >
                  verified ✓
                </div>
              </div>
            </div>
            <!-- (disconnect twitter button) -->
            <template v-if="totalAccountConnections > 1">
              <button
                class="_bubble-btn _h-10 _text-sm _text-stroke-md _px-[1em]"
                @click="(e) => handleDisconnectPlatform('twitter', twitter.id, e)"
                styleff="filter: hue-rotate(130deg) saturate(2)"
                aria-label="Remove"
              >
                <span styleff="filter: hue-rotate(-130deg) saturate(0.5)">
                  <template
                    v-if="
                      aboutToDisconnect.platform == 'twitter' && aboutToDisconnect.id == twitter.id
                    "
                  >
                    Confirm?
                  </template>
                  <template v-else> ⛌ </template>
                </span>
              </button>
            </template>
          </li>
          <AuthButton v-if="!hasTwitterAuth" platform="twitter" points="+10" class="_w-full">
            {{ twitterAuths.length > 0 ? 'Link Another TwitterX' : 'Link TwitterX' }}
          </AuthButton>
        </ul>
      </section>

      <!-- telegram -->
      <section class="_bg-metallic-linear _shadow-panel _p-4 _pb-5 _space-y-2 _rounded-lg">
        <div v-if="telegramAuths.length" class="_flex _items-center _gap-2.5 _-mt-1.5">
          <h3 class="_text-xl _weight-bold">telegram</h3>
        </div>
        <ul class="_space-y-2">
          <!-- telegrams... -->
          <li
            v-for="telegram in telegramAuths"
            :key="telegram.id"
            class="_flex _items-center _p-2 _pr-3.5 _justify-between _bg-metallic-linear _shadow-panel _rounded-lg"
          >
            <div class="_flex _items-center _gap-2">
              <button
                class="_size-11 _flex _items-stretch _p-1.5 _group _overflow-hidden _rounded-md"
                :class="[
                  {
                    '_shadow-panel': telegram.avatar,
                    '_shadow-panel-inset _bg-metallic-cone _cursor-default':
                      telegram.avatar === auth.user?.avatar
                  }
                ]"
                :disabled="!telegram.avatar"
              >
                <div
                  v-if="telegram.avatar"
                  @click="() => setAvatar('telegram', telegram.id)"
                  style="background: none"
                  type="button"
                  title="Set as profile avatar"
                >
                  <img
                    :src="`${telegram.avatar}`"
                    class="_size-full _rounded-full _duration-150"
                    :class="{
                      'group-hover:_scale-[1.8]': telegram.avatar !== auth.user?.avatar
                    }"
                    @error="avatarFallback.handleImageError"
                  />
                </div>
                <div v-else class="_w-full _flex _items-center _justify-center">
                  <img
                    src="../../assets/imgs/telegram-logo.svg"
                    class="_size-6 _rounded"
                    style="background-color: #0088cc"
                  />
                </div>
              </button>
              <div class="_flex-1 _min-w-0 _leading-tight">
                <div class="_flex-1 _min-w-0 _truncate _text-em-lg">
                  {{ telegram.username }}
                </div>
              </div>
            </div>
            <!-- (disconnect telegram button) -->
            <template v-if="totalAccountConnections > 1">
              <button
                class="_bubble-btn _h-10 _text-sm _text-stroke-md _px-[1em]"
                @click="(e) => handleDisconnectPlatform('telegram', telegram.id, e)"
                styleff="filter: hue-rotate(130deg) saturate(2)"
                aria-label="Remove"
              >
                <span styleff="filter: hue-rotate(-130deg) saturate(0.5)">
                  <template
                    v-if="
                      aboutToDisconnect.platform == 'telegram' &&
                      aboutToDisconnect.id == telegram.id
                    "
                  >
                    Confirm?
                  </template>
                  <template v-else> ⛌ </template>
                </span>
              </button>
            </template>
          </li>
          <AuthButton v-if="!hasTelegramAuth" platform="telegram" points="+10" class="_w-full">
            {{ telegramAuths.length > 0 ? 'Link Another Telegram' : 'Link Telegram' }}
          </AuthButton>
        </ul>
      </section>

      <!-- farcaster -->
      <section
        class="_bg-metallic-linear _shadow-panel _p-4 _pb-5 _space-y-2 _rounded-lg"
        :class="{ '_order-first': auth.isFarcaster }"
      >
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
                  class="_size-11 _flex _items-stretch _p-1.5 _group _overflow-hidden _rounded-md"
                  :class="[
                    {
                      '_shadow-panel': farcaster.avatar,
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
                      @error="avatarFallback.handleImageError"
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
                  @click="(e) => handleDisconnectPlatform('farcaster', farcaster.id, e)"
                  styleff="filter: hue-rotate(130deg) saturate(2)"
                  aria-label="Remove"
                >
                  <span styleff="filter: hue-rotate(-130deg) saturate(0.5)">
                    <template
                      v-if="
                        aboutToDisconnect.platform == 'farcaster' &&
                        aboutToDisconnect.id == farcaster.id
                      "
                    >
                      Confirm?
                    </template>
                    <template v-else> ⛌ </template>
                  </span>
                </button>
              </template>
            </div>
          </li>
          <AuthButton v-if="!hasFarcasterAuth" platform="farcaster" points="+10" class="_w-full">
            {{ farcasterAuths.length > 0 ? 'Link Another Farcaster' : 'Link Farcaster' }}
          </AuthButton>
          <!-- (add mini-app to farcaster button) -->
          <template v-if="isFarcaster && !isFarcaster.client.added">
            <AuthButton platform="farcaster" points="+10" class="_w-full" @click="addFrame"
              >Add this Mini App</AuthButton
            >
          </template>
        </ul>
      </section>
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
import { computed, ref, inject, onMounted, nextTick, watch } from 'vue'
import { storeToRefs } from 'pinia'
import smileyFaceSvg from '../../assets/imgs/smiley-face-dashed-outline.svg'
import AuthButton from '../../components/AuthButton.vue'
import AccountLayout from '../../components/AccountLayout.vue'
import TrifleBall from '../../components/TrifleBall/TrifleBall.vue'
import SplitWalletButton from '../../components/AuthenticateWalletSection.vue'
import { createAvatarFallback } from '../../utils.js'

const auth = inject('TrifleHub/store')
const { isAuthenticated, backendUrl } = storeToRefs(auth)

// Avatar fallback utility
const avatarFallback = createAvatarFallback(smileyFaceSvg)

const isFarcaster = computed(() => auth.isFarcaster)

const addFrame = async () => {
  await auth.addFrame()
}

const openProfile = () => {
  auth.setProfileUsername(auth.user?.username)
  openHub('profile')
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
const twitterAuths = computed(() => auth.getPlatformData('twitter'))
const telegramAuths = computed(() => auth.getPlatformData('telegram'))

const hasDiscordAuth = computed(() => discordAuths.value.length > 0)
const hasFarcasterAuth = computed(() => farcasterAuths.value.length > 0)
const hasTwitterAuth = computed(() => twitterAuths.value.length > 0)
const hasTelegramAuth = computed(() => telegramAuths.value.length > 0)

const totalAccountConnections = computed(
  () =>
    walletAuths.value.length +
    discordAuths.value.length +
    farcasterAuths.value.length +
    twitterAuths.value.length +
    telegramAuths.value.length
)

const aboutToDisconnect = ref({ platform: null, id: null })

const handleDisconnectPlatform = async (platform, instanceId, event) => {
  event.stopPropagation() // Prevent the window listener from firing immediately
  if (aboutToDisconnect.value.platform === platform && aboutToDisconnect.value.id === instanceId) {
    try {
      await auth.disconnectPlatformInstance(platform, instanceId)
    } catch (err) {
      console.error(`Failed to disconnect ${platform} instance:`, err)
    }
    aboutToDisconnect.value = { platform: null, id: null }
    return
  }
  aboutToDisconnect.value = { platform, id: instanceId }
}

const cancelDisconnect = () => {
  aboutToDisconnect.value = { platform: null, id: null }
}

watch(aboutToDisconnect, (newValue) => {
  if (newValue.platform) {
    // If we've entered the "confirm disconnect" state, listen for a click away.
    window.addEventListener('click', cancelDisconnect, { once: true })
  } else {
    // If we've left the state, ensure the listener is removed.
    window.removeEventListener('click', cancelDisconnect)
  }
})

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
    const response = await fetch(`${backendUrl.value}/auth/update-avatar`, {
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
