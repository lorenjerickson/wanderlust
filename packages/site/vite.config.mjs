import path from "path";
import { fileURLToPath } from 'url';
import federation from "@originjs/vite-plugin-federation";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODULE_NAME = "wanderlust-site";

export default defineConfig({
  build: {
    outDir: '../../apps/library/dist/wanderlust/module/site',
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'lib/main.ts'),
      name: MODULE_NAME,
      fileName: (format) => `${MODULE_NAME}.${format}.js`
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: false,
        format: 'es',
      }
    },
  },

  plugins: [
    react(),
    tsconfigPaths(),
    federation({
      name: MODULE_NAME,
      filename: "remoteEntry.js",
      exposes: {
        "./manifest": "./lib/manifest",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "lib"),
      "@wanderlust/core": path.resolve(__dirname, "../core/lib"),
      "@wanderlust/ui": path.resolve(__dirname, "../ui/lib"),
    }
  }
});