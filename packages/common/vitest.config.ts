import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      'src/components/MediaFilter/MediaFilter.test.tsx',
      'src/components/MediaToolbar/MediaToolbar.test.tsx',
      'src/components/Select/Select.test.tsx',
      'src/components/TextInput/TextInput.test.tsx',
    ],
  },
})
