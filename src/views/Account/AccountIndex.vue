<template>
  <Profile v-if="isAuthenticated" />
  <ConnectAccount v-else />
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { inject, onMounted, watch } from 'vue'
import Profile from '../Profile.vue'
import ConnectAccount from './ConnectAccount.vue'

const auth = inject('TrifleHub/store')
const { isAuthenticated, user } = storeToRefs(auth)

const ensureOwnProfileUsername = () => {
  if (isAuthenticated.value && user.value?.username) {
    auth.setProfileUsername(user.value.username)
  }
}

onMounted(() => {
  ensureOwnProfileUsername()
})

watch(isAuthenticated, () => {
  ensureOwnProfileUsername()
})

watch(
  () => user.value && user.value.username,
  () => {
    ensureOwnProfileUsername()
  }
)
</script>

<style></style>
