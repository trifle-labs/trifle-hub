// /Users/billy/Github/trifle-labs/trifle-hub/vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import dts from 'vite-plugin-dts'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Fix default imports of viem (which doesn't have a default export)
const fixViemImports = () => ({
  name: 'fix-viem-imports',
  generateBundle(options, bundle) {
    Object.keys(bundle).forEach((fileName) => {
      const chunk = bundle[fileName]
      if (chunk.type === 'chunk' && chunk.code) {
        // Replace default imports with namespace imports
        chunk.code = chunk.code.replace(
          /import\s+(\w+)\s+from\s+["']viem["']/g,
          "import * as $1 from 'viem'"
        )
      }
    })
  }
})

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
    }),
    fixViemImports()
  ],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: path.resolve(__dirname, 'src/index.js'), // Use path.resolve and __dirname
      fileName: () => 'index.es.js', // ES module only
      formats: ['es'] // ES module format only
    },
    rollupOptions: {
      external: (id) => {
        const peerDeps = new Set([
          'vue',
          'vue-router',
          '@wagmi/core',
          '@wagmi/vue',
          'viem',
          '@farcaster/miniapp-sdk',
          '@farcaster/miniapp-wagmi-connector',
          'pinia',
          'three',
          'tailwindcss'
        ])
        return peerDeps.has(id) || id.startsWith('viem/')
      },
      output: {
        format: 'es',
        entryFileNames: '[name].es.js',
        interop: 'esModule'
      }
    }
    // CSS is now automatically injected by cssInjectedByJsPlugin
  }
})
