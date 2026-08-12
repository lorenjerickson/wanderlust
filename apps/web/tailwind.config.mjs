import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/features/**/*.{ts,tsx}',
    '../../packages/common/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui({ themes: ['night --default'] })],
}

export default config
