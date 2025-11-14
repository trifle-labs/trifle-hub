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
      // Externalize dependencies to keep bundle size small
      // These are in dependencies but externalized so they're not bundled
      external: [
        'vue',
        'vue-router',
        'pinia',
        'three',
        '@wagmi/core',
        '@wagmi/vue',
        '@reown/appkit',
        '@reown/appkit/vue', // Externalize deep imports too
        '@reown/appkit/networks', // Externalize deep imports too
        '@reown/appkit-adapter-wagmi',
        '@reown/appkit-siwe',
        'viem',
        '@farcaster/miniapp-sdk',
        '@farcaster/miniapp-wagmi-connector',
        '@tanstack/vue-query',
        '@vueuse/core'
        // Note: @farcaster/auth-client is bundled (not externalized)
        // Note: tailwindcss is a build tool, not a runtime dependency
      ],
      output: {
        // Provide global variables to use in the UMD build
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          pinia: 'Pinia',
          three: 'THREE',
          '@wagmi/core': 'WagmiCore',
          '@wagmi/vue': 'WagmiVue',
          viem: 'Viem',
          '@reown/appkit': 'ReownAppkit',
          '@reown/appkit-adapter-wagmi': 'ReownAppkitAdapterWagmi',
          '@reown/appkit-siwe': 'ReownAppkitSiwe',
          '@tanstack/vue-query': 'TanStackVueQuery',
          '@farcaster/miniapp-sdk': 'FarcasterMiniappSdk',
          '@farcaster/miniapp-wagmi-connector': 'FarcasterMiniappWagmiConnector',
          '@vueuse/core': 'VueUse'
        }
      }
    }
    // CSS is now automatically injected by cssInjectedByJsPlugin
  }
})
