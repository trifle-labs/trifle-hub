// /Users/billy/GitHub/trifle-labs/trifle-hub/vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path' // Use node: prefix

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: path.resolve(__dirname, 'src/index.js'), // Use path.resolve and __dirname
      name: 'TrifleHub', // Your library's name - used for UMD builds
      fileName: (format) => `index.${format}.js`, // Generates index.es.js and index.umd.js
      formats: ['es', 'umd'] // Include ES and UMD formats
    },
    rollupOptions: {
      // Make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        'vue',
        'vue-router',
        '@wagmi/core',
        '@wagmi/vue',
        '@reown/appkit',
        '@reown/appkit/vue', // Make sure deep imports are external too
        '@reown/appkit/networks', // Make sure deep imports are external too
        '@reown/appkit-adapter-wagmi',
        '@reown/appkit-siwe',
        'viem',
        '@farcaster/frame-sdk',
        '@farcaster/frame-wagmi-connector',
        '@tanstack/vue-query',
        '@vueuse/core',
        'pinia',
        'siwe',
        'tailwindcss' // Usually external if host provides Tailwind setup
        // Or use a regex for broader matching if needed:
        // /^vue/,
        // /^@wagmi\\/.*/,
        // /^@reown\\/appkit/,
        // /^viem/,
        // ... etc
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps (less critical for ES module usage)
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          '@wagmi/core': 'WagmiCore',
          '@wagmi/vue': 'WagmiVue',
          viem: 'Viem',
          '@reown/appkit': 'ReownAppkit',
          pinia: 'Pinia'
          // Add globals for other externalized dependencies if UMD support is important
        }
      }
    }
    // Optional: Improve CSS handling for library mode
    // cssCodeSplit: true, // Extracts CSS into a separate file
  }
})
