import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig(async () => {
  return {
    plugins: [
      react(),
      tsconfigPaths(),
      federation({
        name: 'wanderlust-host',
        filename: 'remoteEntry.js',
        remotes: {
          'wanderlust-configure': 'http://localhost:3001/wanderlust/module/configure/assets/remoteEntry.js',
        },
      })
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './vitest.setup.mjs',
    },
  }
});
