// /Users/billy/Github/trifle-labs/trifle-hub/vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import dts from 'vite-plugin-dts'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Helper to get __dirname in ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
    vue(),
    cssInjectedByJsPlugin(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.js', 'src/**/*.vue'],
      insertTypesEntry: true,
      outDir: 'dist',
      compilerOptions: {
        allowJs: true,
        checkJs: false
      }
    })
  ],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: path.resolve(__dirname, 'src/index.js'), // Use path.resolve and __dirname
      name: 'TrifleHub', // Your library's name - used for UMD builds
      fileName: (format) => `index.${format}.js`, // Generates index.es.js and index.umd.js
      formats: ['es', 'umd'] // Include ES and UMD formats
    },
    rollupOptions: {
      // Externalize peer dependencies (consumers interact with these directly)
      // Bundle internal dependencies (@tanstack/vue-query, @reown/appkit, etc.)
      external: [
        'vue',
        'vue-router',
        '@wagmi/core',
        '@wagmi/vue',
        'viem',
        '@farcaster/miniapp-sdk',
        '@farcaster/miniapp-wagmi-connector',
        'pinia',
        'three',
        'siwe', // Part of viem, but listed for completeness
        'tailwindcss' // Build tool, not runtime
      ],
      output: {
        // Provide global variables to use in the UMD build
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          '@wagmi/core': 'WagmiCore',
          '@wagmi/vue': 'WagmiVue',
          viem: 'Viem',
          '@farcaster/miniapp-sdk': 'FarcasterMiniappSdk',
          '@farcaster/miniapp-wagmi-connector': 'FarcasterMiniappWagmiConnector',
          pinia: 'Pinia',
          three: 'THREE'
        }
      }
    }
    // CSS is now automatically injected by cssInjectedByJsPlugin
  }
})
