import Welcome from './Welcome.vue'
import Games from './Games.vue'
import Leaderboard from './Leaderboard.vue'
import Earn from './Earn.vue'
import Account from './Account.vue'
import Theme from './Theme.vue'
import bgImg from '../../assets/imgs/metal-gradient-conical.png'
export default {
  welcome: { menuItem: false, component: Welcome, bgImg: bgImg },
  games: { menuItem: true, component: Games },
  leaderboard: { menuItem: true, component: Leaderboard },
  earn: { menuItem: true, component: Earn },
  account: { menuItem: true, component: Account, bgImg: bgImg },
  theme: { menuItem: false, component: Theme }
}
