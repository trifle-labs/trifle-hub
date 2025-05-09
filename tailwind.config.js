/** @type {import('tailwindcss').Config} */
export default {
  prefix: '_',
  content: [
    // for vite build
    './src/**/*.{vue,js,ts,jsx,tsx}',
    // for local dev from /dev
    '../src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      spacing: { 4.5: '1.125rem', 5.5: '1.375rem', 13: '3.25rem', 18: '4.5rem' },
      screens: {
        sm: '440px', // (typically 600px)
        mouse: { raw: '(hover:hover)' },
        touch: { raw: '(hover:none)' }
      },
      gridTemplateColumns: {
        9: 'repeat(9, minmax(0, 1fr))',
        10: 'repeat(10, minmax(0, 1fr))',
        11: 'repeat(11, minmax(0, 1fr))',
        12: 'repeat(12, minmax(0, 1fr))',
        13: 'repeat(13, minmax(0, 1fr))',
        14: 'repeat(14, minmax(0, 1fr))',
        15: 'repeat(15, minmax(0, 1fr))',
        16: 'repeat(16, minmax(0, 1fr))',
        17: 'repeat(17, minmax(0, 1fr))',
        18: 'repeat(18, minmax(0, 1fr))',
        19: 'repeat(19, minmax(0, 1fr))',
        20: 'repeat(20, minmax(0, 1fr))',
        21: 'repeat(21, minmax(0, 1fr))'
      },
      animation: {
        'pulse-light': 'pulse-light 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-deep': 'pulse-deep 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-deep-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blink-fast': 'blink 200ms linear infinite',
        blink: 'blink 400ms linear infinite',
        'blink-deep': 'blink-deep 1000ms linear infinite',
        'blink-red-fast': 'blink-red 100ms linear infinite',
        wiggle: 'wiggle 0.8s ease-in-out infinite',
        'wiggle-sm': 'wiggle-sm 0.8s ease-in-out infinite'
      },
      fontFamily: { trifle: ['APL333', 'sans-serif'] },
      fontSize: {
        xs: '0.875rem',
        sm: '1rem',
        md: '1.125rem',
        base: '1.22rem',
        lg: '1.375rem',
        xl: '1.5rem',
        '2xl': '1.75rem',
        '3xl': '2rem',
        '4xl': '2.375rem',
        '5xl': '2.5rem'
      },
      borderWidth: { 3: '3px' },
      keyframes: {
        'pulse-light': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.75 } },
        'pulse-deep': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.25 } },
        blink: { '0%, 49%': { opacity: 1 }, '50%, 100%': { opacity: 0.5 } },
        'blink-deep': { '0%, 49%': { opacity: 1 }, '50%, 100%': { opacity: 0.33 } },
        'blink-red': {
          '50%, 100%': { color: 'red' }
        },
        'wiggle-sm': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-1.5deg)' },
          '75%': { transform: 'rotate(1.5deg)' }
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(5deg)' }
        }
      }
    }
  },
  plugins: []
}
