import { defineAsyncComponent } from 'vue'
import bgImg from './assets/imgs/metal-gradient-conical.png'

export default {
  welcome: { 
    menuItem: false, 
    component: defineAsyncComponent(() => import('./views/Welcome.vue')), 
    bgImg: bgImg 
  },
  games: { 
    menuItem: true, 
    component: defineAsyncComponent(() => import('./views/Games.vue'))
  },
  leaderboard: { 
    menuItem: true, 
    component: defineAsyncComponent(() => import('./views/Leaderboard.vue'))
  },
  earn: { 
    menuItem: true, 
    component: defineAsyncComponent(() => import('./views/Earn.vue'))
  },
  account: { 
    menuItem: true, 
    component: defineAsyncComponent(() => import('./views/Account/AccountIndex.vue'))
  },
  theme: { 
    menuItem: false, 
    component: defineAsyncComponent(() => import('./views/Theme.vue'))
  },
  profile: { 
    menuItem: false, 
    component: defineAsyncComponent(() => import('./views/Profile.vue'))
  }
}
