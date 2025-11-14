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
      // Externalize peer dependencies so they aren't bundled
      // Dependencies like @wagmi/*, viem, @reown/appkit, etc. are bundled with the library
      external: [
        'vue',
        'vue-router',
        'pinia',
        'three' // Externalize peer dependencies only
        // Note: @vueuse/core is bundled (in dependencies)
        // Note: tailwindcss is a build tool, not a runtime dependency
      ],
      output: {
        // Provide global variables to use in the UMD build
        // Only needed for externalized peer dependencies
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          pinia: 'Pinia',
          three: 'THREE' // For UMD builds
        }
      }
    }
    // CSS is now automatically injected by cssInjectedByJsPlugin
  }
})
