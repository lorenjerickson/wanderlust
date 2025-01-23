const path = require('path')
const { defineConfig } = require('vite')

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/main.ts'),
      name: 'wanderlust-ui',
      fileName: (format) => `wanderlust-ui.${format}.js`
    }
  }
});