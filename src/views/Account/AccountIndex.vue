<template>
  <UserAccount v-if="isAuthenticated" />
  <ConnectAccount v-else />
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { inject } from 'vue'
import UserAccount from './UserAccount.vue'
import ConnectAccount from './ConnectAccount.vue'

const auth = inject('TrifleHub/store')
const { isAuthenticated } = storeToRefs(auth)
</script>

<style></style>
