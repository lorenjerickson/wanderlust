import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        components: 'src/components/index.ts',
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
      cssFileName: 'style',
    },
    rollupOptions: {
      external: [
        '@mdxeditor/editor',
        '@tabler/icons-react',
        'dockview-react',
        'next/dynamic',
        'next/image',
        'next/link',
        'react',
        'react-dom',
        'react/jsx-runtime',
        'styled-components',
      ],
      output: {
        banner: (chunk) =>
          chunk.name === 'components' ? "'use client';" : '',
      },
    },
  },
})
