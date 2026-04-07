<template>
  <section class="_flex _flex-col _gap-[inherit]" :class="$attrs.class">
    <!-- wallets -->
    <section
      class="_bg-metallic-linear _shadow-panel _p-4 _space-y-1.5 _rounded-lg"
      :class="{ '_order-last': !walletAuths?.length }"
    >
      <header v-if="walletAuths.length" class="_flex _items-center _gap-2.5 _-mt-1.5">
        <h3 class="_text-mlg _opacity-30 _weight-bold">
          wallet{{ walletAuths.length > 1 ? 's' : '' }}
        </h3>
      </header>
      <ul class="_flex _flex-col _gap-0.5">
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
                />
              </div>
              <div v-else class="_w-full _flex _items-center _justify-center">
                <img
                  src="../assets/imgs/ethereum-logo-white.svg"
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
                class="_text-em-2xs _text-primary _leading-none _weight-semibold"
              >
                connected
                <span v-if="wallet.metadata?.origin" class="_opacity-30">
                  via {{ wallet.metadata.origin }}
                </span>
              </div>
              <div
                class="_text-em-2xs _text-gray-500 _leading-none _weight-semibold"
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
                  v-if="aboutToDisconnect.platform == 'wallet' && aboutToDisconnect.id == wallet.id"
                >
                  Confirm?
                </template>
                <template v-else> ⛌ </template>
              </span>
            </button>
          </template>
        </li>
        <!-- (authenticate wallet button) -->
        <AuthenticateWalletSection
          v-if="isAuthenticated && auth.accountConnected && auth.currentWalletNeedsAuth"
          :wallet-address="auth.accountAddress"
          :wallet-avatar="currentWallet?.avatar"
          :display-name="currentWallet?.username || accountAddress"
          :disabled="auth.isSimulationMode"
        >
          Authenticate {{ truncateAddress(auth.accountAddress) }}
        </AuthenticateWalletSection>
        <!-- (link wallet button) -->
        <AuthButton
          v-if="isAuthenticated && !auth.accountConnected"
          platform="wallet"
          :points="!walletAuths.length ? '+10' : undefined"
          :disabled="auth.isSimulationMode"
          class="_w-full"
        >
          {{ walletAuths.length > 0 ? 'Link another Wallet' : 'Link Wallet' }}
        </AuthButton>
      </ul>
    </section>

    <!-- solana -->
    <section
      class="_bg-metallic-linear _shadow-panel _p-4 _space-y-1.5 _rounded-lg"
      :class="{ '_order-last': !solanaAuths?.length }"
    >
      <div v-if="solanaAuths.length" class="_flex _items-center _gap-2.5 _-mt-1.5">
        <h3 class="_text-mlg _opacity-30 _weight-bold">
          solana wallet{{ solanaAuths.length > 1 ? 's' : '' }}
        </h3>
      </div>
      <ul class="_flex _flex-col _gap-0.5">
        <li
          v-for="solana in solanaAuths"
          :key="solana.id"
          class="_flex _items-center _p-2 _pr-3.5 _justify-between _bg-metallic-linear _shadow-panel _rounded-lg"
        >
          <div class="_flex _items-center _gap-2">
            <div class="_size-11 _flex _items-stretch _p-1.5 _rounded-md">
              <div class="_w-full _flex _items-center _justify-center">
                <img
                  src="../assets/imgs/solana-logo.svg"
                  class="_size-6 _rounded"
                  style="background-color: #000"
                />
              </div>
            </div>
            <div class="_flex-1 _min-w-0 _leading-tight">
              <div class="_flex-1 _min-w-0 _truncate _text-em-lg">
                {{ truncateSolanaAddress(solana.id) }}
              </div>
            </div>
          </div>
          <!-- (disconnect solana button) -->
          <template v-if="totalAccountConnections > 1">
            <button
              class="_bubble-btn _h-10 _text-sm _text-stroke-md _px-[1em]"
              @click="(e) => handleDisconnectPlatform('solana', solana.id, e)"
              aria-label="Remove"
            >
              <span>
                <template
                  v-if="aboutToDisconnect.platform == 'solana' && aboutToDisconnect.id == solana.id"
                >
                  Confirm?
                </template>
                <template v-else> ⛌ </template>
              </span>
            </button>
          </template>
        </li>
        <AuthButton
          v-if="!hasSolanaAuth"
          platform="solana"
          :points="!solanaAuths.length ? '+10' : undefined"
          :disabled="auth.isSimulationMode"
          class="_w-full"
        >
          {{ solanaAuths.length > 0 ? 'Link another Solana' : 'Link Solana' }}
        </AuthButton>
      </ul>
    </section>

    <!-- discord -->
    <section
      class="_bg-metallic-linear _shadow-panel _p-4 _space-y-1.5 _rounded-lg"
      :class="{ '_order-last': !discordAuths?.length }"
    >
      <div v-if="discordAuths.length" class="_flex _items-center _gap-2.5 _-mt-1.5">
        <h3 class="_text-mlg _opacity-30 _weight-bold">discord</h3>
      </div>
      <ul class="_space-y-0.5">
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
                />
              </div>
              <div v-else class="_w-full _flex _items-center _justify-center">
                <img
                  src="../assets/imgs/discord-logo.svg"
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
        <AuthButton
          v-if="!hasDiscordAuth"
          platform="discord"
          points="+10"
          :disabled="auth.isSimulationMode"
          class="_w-full"
        >
          {{ discordAuths.length > 0 ? 'Link Another Discord' : 'Link Discord' }}
        </AuthButton>
      </ul>
    </section>

    <!-- twitter -->
    <section
      class="_bg-metallic-linear _shadow-panel _p-4 _space-y-1.5 _rounded-lg"
      :class="{ '_order-last': !twitterAuths?.length }"
    >
      <div v-if="twitterAuths.length" class="_flex _items-center _gap-2.5 _-mt-1.5">
        <h3 class="_text-mlg _opacity-30 _weight-bold">twitter</h3>
      </div>
      <ul class="_space-y-0.5">
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
                />
              </div>
              <div v-else class="_w-full _flex _items-center _justify-center">
                <img
                  src="../assets/imgs/twitter-x-logo.svg"
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
        <AuthButton
          v-if="!hasTwitterAuth"
          platform="twitter"
          points="+10"
          :disabled="auth.isSimulationMode"
          class="_w-full"
        >
          {{ twitterAuths.length > 0 ? 'Link Another TwitterX' : 'Link TwitterX' }}
        </AuthButton>
      </ul>
    </section>

    <!-- telegram -->
    <section
      class="_bg-metallic-linear _shadow-panel _p-4 _space-y-1.5 _rounded-lg"
      :class="{ '_order-last': !telegramAuths?.length }"
    >
      <div v-if="telegramAuths.length" class="_flex _items-center _gap-2.5 _-mt-1.5">
        <h3 class="_text-mlg _opacity-30 _weight-bold">telegram</h3>
      </div>
      <ul class="_space-y-0.5">
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
                />
              </div>
              <div v-else class="_w-full _flex _items-center _justify-center">
                <img
                  src="../assets/imgs/telegram-logo.svg"
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
                    aboutToDisconnect.platform == 'telegram' && aboutToDisconnect.id == telegram.id
                  "
                >
                  Confirm?
                </template>
                <template v-else> ⛌ </template>
              </span>
            </button>
          </template>
        </li>
        <template v-if="!hasTelegramAuth">
          <AuthButton
            v-if="!hasTelegramAuth"
            platform="telegram"
            points="+10"
            :disabled="auth.isSimulationMode"
          >
            {{ telegramAuths.length > 0 ? 'Link Another Telegram' : 'Link Telegram' }}
          </AuthButton>
        </template>
      </ul>
    </section>

    <!-- farcaster -->
    <section
      class="_bg-metallic-linear _shadow-panel _p-4 _space-y-1.5 _rounded-lg"
      :class="{ '_order-first': auth.isFarcaster }"
    >
      <div v-if="farcasterAuths.length" class="_flex _items-center _gap-2.5 _-mt-1.5">
        <h3 class="_text-mlg _opacity-30 _weight-bold">farcaster</h3>
      </div>
      <ul class="_space-y-0.5">
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
                  />
                </div>
                <div v-else class="_w-full _flex _items-center _justify-center">
                  <img
                    src="../assets/imgs/farcaster-logo.svg"
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
        <AuthButton
          v-if="!hasFarcasterAuth"
          platform="farcaster"
          points="+10"
          :disabled="auth.isSimulationMode"
          class="_w-full"
        >
          {{ farcasterAuths.length > 0 ? 'Link Another Farcaster' : 'Link Farcaster' }}
        </AuthButton>
        <!-- (add mini-app to farcaster button) - only show on super app domains -->
        <template v-if="isFarcaster && !isFarcaster.client.added && isSuperApp">
          <AuthButton
            platform="farcaster"
            points="+10"
            :disabled="auth.isSimulationMode"
            class="_w-full"
            @click="addFrame"
          >
            Add this Mini App
          </AuthButton>
        </template>
      </ul>
    </section>

    <footer class="_order-last _bg-metallic-cone _p-4 _rounded-lg _shadow-panel">
      <div class="_w-full">
        <button @click="handleLogout" class="_bubble-btn-full _h-16 _text-lg _bold">
          <span>logout 💤</span>
        </button>
      </div>
    </footer>
  </section>
</template>

<script setup>
import { computed, ref, inject, watch } from 'vue'
import { storeToRefs } from 'pinia'
import AuthButton from './AuthButton.vue'
import AuthenticateWalletSection from './AuthenticateWalletSection.vue'

const auth = inject('TrifleHub/store')
const { isAuthenticated, backendUrl } = storeToRefs(auth)

const isFarcaster = computed(() => auth.isFarcaster)
const isSuperApp = computed(() => auth.isSuperApp)

const addFrame = async () => {
  await auth.addFrame()
}

const walletAuths = computed(() => auth.getPlatformData('wallet'))
const solanaAuths = computed(() => auth.getPlatformData('solana'))
const discordAuths = computed(() => auth.getPlatformData('discord').filter((d) => d.username))
const farcasterAuths = computed(() => auth.getPlatformData('farcaster'))
const twitterAuths = computed(() => auth.getPlatformData('twitter').filter((t) => t.username))
const telegramAuths = computed(() => auth.getPlatformData('telegram').filter((t) => t.username))

const hasDiscordAuth = computed(() => discordAuths.value.length > 0)
const hasFarcasterAuth = computed(() => farcasterAuths.value.length > 0)
const hasTwitterAuth = computed(() => twitterAuths.value.length > 0)
const hasTelegramAuth = computed(() => telegramAuths.value.length > 0)
const hasSolanaAuth = computed(() => solanaAuths.value.length > 0)

const totalAccountConnections = computed(
  () =>
    walletAuths.value.length +
    solanaAuths.value.length +
    discordAuths.value.length +
    farcasterAuths.value.length +
    twitterAuths.value.length +
    telegramAuths.value.length
)

const aboutToDisconnect = ref({ platform: null, id: null })

const handleDisconnectPlatform = async (platform, instanceId, event) => {
  event.stopPropagation()

  if (auth.isSimulationMode) {
    auth.addNotification({
      message: 'Cannot disconnect platforms in simulation mode',
      type: 'error'
    })
    return
  }

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
    window.addEventListener('click', cancelDisconnect, { once: true })
  } else {
    window.removeEventListener('click', cancelDisconnect)
  }
})

const truncateAddress = (address) => {
  if (!address) return ''
  return `0x${address.slice(2, 6).toUpperCase()}...${address.slice(-4).toUpperCase()}`
}

const truncateSolanaAddress = (address) => {
  if (!address) return ''
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

const handleLogout = async () => {
  try {
    await auth.disconnect()
    console.log('User logged out')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

const isWalletAuthenticated = computed(() => auth.isWalletAuthenticated(auth.accountAddress))
const accountAddress = computed(() => auth.accountAddress)
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

const setAvatar = async (platform, platformId) => {
  if (auth.isSimulationMode) {
    auth.addNotification({
      message: 'Cannot set avatar in simulation mode',
      type: 'error'
    })
    return
  }

  try {
    const response = await fetch(`${backendUrl.value}/auth/update-avatar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.authToken}`
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
</script>

<style></style>
