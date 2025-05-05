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
        '@reown/appkit/vue',
        '@wagmi/vue',
        '@wagmi/core',
        'vue-router',
        '@reown/appkit-adapter-wagmi',
        '@reown/appkit/networks'
      ],
      output: {
        globals: {
          vue: 'Vue',
          '@reown/appkit/vue': 'AppkitVue',
          '@wagmi/vue': 'WagmiVue',
          '@wagmi/core': 'WagmiCore',
          'vue-router': 'VueRouter',
          '@reown/appkit-adapter-wagmi': 'AppkitAdapterWagmi',
          '@reown/appkit/networks': 'AppkitNetworks'
        }
      }
    }
  }
}) 