import { App } from 'vue'
import Index from './components/Index.vue'
import { wagmiConfig } from './config/wagmiConfig'

export { Index, wagmiConfig }

export default {
  install: (app) => {
    app.component('TrifleHub', Index)
  }
} 