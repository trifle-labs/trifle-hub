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
      <div class="_text-stroke-2xl">
        {{ 'who r u??' }}
      </div>
    </template>
    <template #description>
      <p class="_-mt-2">
        Link identities &rarr;
        <span class="_ffborder-b _border-current" style="border-style: dashed"> earn BALL$</span>
        🪩
      </p>
    </template>

    <section
      class="_w-full _max-w-[22em] _mx-auto _px-1.5 sm:_px-8 _flex _flex-col _gap-4 _items-center"
    >
      <nav class="_flex _flex-col _w-full _leading-none">
        <template v-if="accountConnected && currentWalletNeedsAuth && !isFarcasterCtx">
          <AuthenticateWalletSection
            :wallet-address="accountAddress"
            :wallet-avatar="currentWallet?.avatar"
            :display-name="currentWallet?.username || accountAddress"
            class="_mb-1"
          />
        </template>
        <template v-else>
          <AuthButton platform="wallet" points="+10" :disabled="isFarcasterCtx">
            Wallet Login
          </AuthButton>
        </template>
        <AuthButton platform="solana" points="+10" :disabled="isFarcasterCtx">
          Solana Login
        </AuthButton>
        <AuthButton platform="discord" points="+10" :disabled="isFarcasterCtx">
          Discord Login
        </AuthButton>
        <AuthButton platform="twitter" points="+10" :disabled="isFarcasterCtx">
          TwitterX Login
        </AuthButton>
        <AuthButton platform="telegram" points="+10" :disabled="isFarcasterCtx">
          Telegram Login
        </AuthButton>
        <AuthButton platform="farcaster" points="+10" :class="{ '_order-first': isFarcasterCtx }">
          Farcaster Login
        </AuthButton>
        <!-- Email login opens the same Reown AppKit modal as Wallet Login
             (email + socials + wallets all live inside that modal). Pinned
             to the bottom of the list in the web flow. -->
        <AuthButton platform="email" points="+10" :disabled="isFarcasterCtx" class="_order-last">
          Email Login
        </AuthButton>
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
import smileyFaceSvg from '../../assets/imgs/smiley-face-dashed-outline.svg'
import AuthButton from '../../components/AuthButton.vue'
import AccountLayout from '../../components/AccountLayout.vue'
import AuthenticateWalletSection from '../../components/AuthenticateWalletSection.vue'
import { inject, computed } from 'vue'

const auth = inject('TrifleHub/store')
// auth.isFarcaster is the raw context object from sdk.context (truthy when in a Farcaster mini-app)
// — coerce to a proper Boolean so we can bind it to the AuthButton `disabled` prop.
const isFarcasterCtx = computed(() => !!auth.isFarcaster)
const walletAuths = computed(() => auth.getPlatformData('wallet'))
const accountConnected = computed(() => auth.accountConnected)
const currentWalletNeedsAuth = computed(() => auth.currentWalletNeedsAuth)
const accountAddress = computed(() => auth.accountAddress)

const currentWallet = computed(() => {
  if (!accountAddress.value) return null
  return walletAuths.value.find((w) => w.id?.toLowerCase() === accountAddress.value?.toLowerCase())
})
</script>
