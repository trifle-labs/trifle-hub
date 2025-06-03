import Welcome from './views/Welcome.vue'
import Games from './views/Games.vue'
import Leaderboard from './views/Leaderboard.vue'
import Earn from './views/Earn.vue'
import Account from './views/Account/AccountIndex.vue'
import Theme from './views/Theme.vue'
import bgImg from './assets/imgs/metal-gradient-conical.png'

export default {
  welcome: { menuItem: false, component: Welcome, bgImg: bgImg },
  games: { menuItem: true, component: Games },
  leaderboard: { menuItem: true, component: Leaderboard },
  earn: { menuItem: true, component: Earn },
  account: { menuItem: true, component: Account },
  theme: { menuItem: false, component: Theme }
}
