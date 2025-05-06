import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'BallsHub',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`
    },
    rollupOptions: {
      external: [
        'vue',
        '@reown/appkit',
        '@reown/appkit/vue',
        '@reown/appkit/networks',
        '@wagmi/vue',
        '@wagmi/core',
        'vue-router',
        '@reown/appkit-adapter-wagmi'
      ],
      output: {
        globals: {
          vue: 'Vue',
          '@reown/appkit': 'Appkit',
          '@reown/appkit/vue': 'AppkitVue',
          '@reown/appkit/networks': 'AppkitNetworks',
          '@wagmi/vue': 'WagmiVue',
          '@wagmi/core': 'WagmiCore',
          'vue-router': 'VueRouter',
          '@reown/appkit-adapter-wagmi': 'AppkitAdapterWagmi'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'index.css'
          if (assetInfo.name === 'balls-hub.css') return 'index.css'
          return assetInfo.name
        }
      }
    },
    cssCodeSplit: false
  }
}) 