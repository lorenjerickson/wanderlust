import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/main.ts'),
      name: 'wanderlust-core',
      fileName: (format) => `wanderlust-core.${format}.js`
    }
  },
  plugins: [
    tsconfigPaths(),
    dts(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "lib"),
    },
    preserveSymlinks: true,
  },
});