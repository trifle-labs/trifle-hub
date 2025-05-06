import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './index.css'
import { BallsHubVuePlugin, initializeWagmiConfig } from '../../src'

// Initialize wagmi config for dev
const wagmiConfig = initializeWagmiConfig({
  projectId: 'YOUR_PROJECT_ID', // Replace with your dev project ID
  metadata: {
    name: 'Balls Hub Dev',
    description: 'Balls Hub Development Environment',
    url: window.location.origin
  }
})

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
app.use(BallsHubVuePlugin, { wagmiConfig })

router.isReady().then(() => {
  app.mount('#app')
}) 