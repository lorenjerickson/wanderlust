import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/main.js'),
      name: 'wanderlust-core',
      fileName: (format) => `wanderlust-core.${format}.js`
    }
  },
  plugins: [
    react(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@wanderlust/core": path.resolve(__dirname, "../core/src"),
      "@wanderlust/ui": path.resolve(__dirname, "../ui/src"),
    },
    preserveSymlinks: true,
  },
});