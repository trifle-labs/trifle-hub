import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'balls-hub': resolve(__dirname, '../src')
    }
  },
  server: {
    port: 5173, // 5173, 5174 allowed on live servers
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..']
    },
    allowedHosts: ['gm-trifle.ngrok.app']
  }
})
