import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/main.ts'),
      name: 'wanderlust-settings',
      fileName: (format) => `wanderlust-settings.${format}.js`
    }
  },
  plugins: [
    react(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      "@settings/*": path.resolve(__dirname, "lib/*"),
    },
    preserveSymlinks: true,
  },
});