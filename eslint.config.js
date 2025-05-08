/* eslint-env node */
// eslint.config.js -- this comment can be removed or kept
import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import vueParser from 'vue-eslint-parser'

export default [
  js.configs.recommended,
  {
    ignores: ['dist/*', 'node_modules/*', '*.config.js'],
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': 'warn',
      'no-unreachable': 'warn',
      'no-console': 'off',
      'no-debugger': 'warn'
    }
  },
  {
    files: ['**/*.vue'],
    plugins: { vue },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module'
      }
    },
    rules: {
      ...vue.configs['essential'].rules,
      'vue/multi-word-component-names': 'off',
      'vue/require-v-for-key': 'warn',
      'no-undef': 'error',
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'no-debugger': 'warn'
    }
  }
]
