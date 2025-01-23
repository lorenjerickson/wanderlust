import path from "path";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vite";

const MODULE_NAME = "wanderlust-configure";

export default defineConfig({
  build: {
    outDir: "dist",
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
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "lib"),
    },
    preserveSymlinks: true,
  },
});
