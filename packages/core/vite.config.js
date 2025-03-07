import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";
import { extname, relative, resolve } from 'path'
import { fileURLToPath } from 'node:url'
import { glob } from 'glob'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      formats: ['es']
    },
    rollupOptions: {
      input: Object.fromEntries(
        glob.sync('lib/**/*.{ts,tsx}', {
          ignore: ["lib/**/*.d.ts"],
        }).map(file => [
          // The name of the entry point
          // lib/nested/foo.ts becomes nested/foo
          relative(
            'lib',
            file.slice(0, file.length - extname(file).length)
          ),
          // The absolute path to the entry file
          // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
          fileURLToPath(new URL(file, import.meta.url))
        ])
      ),
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
      }
    }
  },
  plugins: [
    tsconfigPaths(),
    dts({ include: ['lib'] }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "lib"),
    },
    preserveSymlinks: true,
  },
});