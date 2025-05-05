import Welcome from './Welcome.vue'
import Games from './Games.vue'
import Leaderboard from './Leaderboard.vue'
import Earn from './Earn.vue'
import Account from './Account.vue'

export default {
  welcome: { menuItem: false, component: Welcome },
  games: { menuItem: true, component: Games },
  leaderboard: { menuItem: true, component: Leaderboard },
  earn: { menuItem: true, component: Earn },
  account: { menuItem: true, component: Account }
}
