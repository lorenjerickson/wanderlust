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
  plugins: [daisyui({ themes: ['night --default'] })],
}

export default config
