import path from "path";
import federation from "@originjs/vite-plugin-federation";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vite";

const MODULE_NAME = "wanderlust-configure";

export default defineConfig({
  build: {
    outDir: "../../apps/library/dist/wanderlust/module/configure",
    emptyOutDir: true,
    target: 'esnext',
    output: {
      inlineDynamicImports: false,
      format: "es",
    },
    lib: {
      entry: path.resolve(__dirname, "lib/main.ts"),
      name: MODULE_NAME,
      fileName: (format) => `${MODULE_NAME}.${format}.js`,
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
      remotes: {
        "wanderlust-site": "http://localhost:3001/wanderlust/module/site/assets/remoteEntry.js",
      }
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "lib"),
      "@wanderlust/core": path.resolve(__dirname, "../core/lib"),
      "@wanderlust/ui": path.resolve(__dirname, "../ui/lib"),
    },
    preserveSymlinks: true,
  },
});
