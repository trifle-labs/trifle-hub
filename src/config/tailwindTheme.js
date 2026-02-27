/**
 * Shared Tailwind theme extensions for trifle apps.
 * Import and spread into your tailwind.config.js theme.extend:
 *
 *   const { trifleTheme } = require('@trifle/trifle-hub/dist/config/tailwindTheme')
 *   // or
 *   import { trifleTheme } from '@trifle/trifle-hub/dist/config/tailwindTheme'
 *
 *   module.exports = {
 *     theme: { extend: { ...trifleTheme, ...yourOverrides } }
 *   }
 */

export const trifleTheme = {
  fontFamily: {
    trifle: ['"APL333"', '"Comic Sans MS"', 'sans-serif']
  },
  colors: {
    rot: 'var(--thub-color-rot)',
    'thub-primary': 'var(--thub-color-primary)',
    trifle: {
      blue: '#4100ff',
      green: '#22c55e',
      gold: '#f59e0b',
      red: '#f43c34'
    }
  },
  screens: {
    xs: '440px',
    mouse: { raw: '(hover:hover)' },
    touch: { raw: '(hover:none)' }
  },
  boxShadow: {
    px: '0 1px 1px var(--thub-shadow-color)',
    'panel-xs': '0 0.75px 0.75px var(--thub-shadow-color), inset 0 0.75px 0 rgba(255, 255, 255, 0.75)',
    panel: '0 1px 1px var(--thub-shadow-color), inset 0 1px 0 rgba(255, 255, 255, 0.75)',
    'panel-inset': '0 1px 1px var(--thub-shadow-color) inset, 0 1px 0 rgba(255, 255, 255, 0.75)',
    'panel-md': '0 1.25px 1.25px var(--thub-shadow-color), inset 0 1.25px 0 rgba(255, 255, 255, 0.75)',
    deep: '0 4px 8px 0 rgba(0, 0, 0, 0.5)'
  },
  animation: {
    'pulse-light': 'pulse-light 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    'pulse-deep': 'pulse-deep 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    wiggle: 'wiggle 0.8s linear infinite',
    'wiggle-sm': 'wiggle-sm 0.8s linear infinite',
    float: 'float 4s ease-in-out infinite',
    'scaleup-sm': 'scaleup-sm 1s ease-in-out infinite',
    'scaleup-xs': 'scaleup-xs 1s ease-in-out infinite'
  },
  keyframes: {
    'pulse-light': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.75 } },
    'pulse-deep': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.25 } },
    'wiggle-sm': {
      '0%, 100%': { transform: 'rotate(0deg)' },
      '25%': { transform: 'rotate(-1.5deg)' },
      '75%': { transform: 'rotate(1.5deg)' }
    },
    wiggle: {
      '0%, 100%': { transform: 'rotate(0deg)' },
      '25%': { transform: 'rotate(-5deg)' },
      '75%': { transform: 'rotate(5deg)' }
    },
    float: {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-4px)' }
    },
    'scaleup-sm': {
      '0%, 100%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.05)' }
    },
    'scaleup-xs': {
      '0%, 100%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.025)' }
    }
  }
}
