import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/features/**/*.{ts,tsx}',
    './src/core/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ['dark', 'night'],
  },
  plugins: [daisyui],
}

export default config
