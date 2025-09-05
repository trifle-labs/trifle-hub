import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './devApp.css'
import { TrifleHubVuePlugin } from '../../src'
import { createPinia } from 'pinia'
import '../../src/style/index.css'

// Initialize wagmi config for dev
const reownConfig = {
  projectId: '8e5ec9e73068bb361965380989cde68c', // Replace with your dev project ID
  metadata: {
    name: 'Balls Hub Dev',
    description: 'Balls Hub Development Environment',
    url: window.location.origin
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('./views/Home.vue')
    }
  ]
})

const app = createApp(App)
app.use(router)

const pinia = createPinia()
app.use(pinia)

// wagmiConfig and appKit are available as inject('TrifleHub/wagmiConfig') and inject('TrifleHub/appKit')
// as wel as via inject('wagmiConfig') thanks to WagmiPlugin from '@wagmi/vue'
app.use(TrifleHubVuePlugin, {
  reownConfig,
  devHookPiniaInstance: pinia,
  backendUrl: import.meta.env.VITE_API_URL || 'https://bot.trifle.life'
})

router.isReady().then(() => {
  app.mount('#app')
})
