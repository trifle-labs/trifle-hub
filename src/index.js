import { App } from 'vue'
import Index from './components/Index.vue'

export { Index }

export default {
  install: (app) => {
    app.component('TrifleHub', Index)
  }
} 