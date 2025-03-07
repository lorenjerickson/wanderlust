// vite.config.js
import { defineConfig } from "file:///home/loren/dev/wanderlust/node_modules/.pnpm/vite@4.5.9_@types+node@22.10.10_sass@1.83.4_sugarss@4.0.1_postcss@8.5.3__terser@5.37.0/node_modules/vite/dist/node/index.js";
import react from "file:///home/loren/dev/wanderlust/node_modules/.pnpm/@vitejs+plugin-react@4.3.4_vite@4.5.9_@types+node@22.10.10_sass@1.83.4_sugarss@4.0.1_postcss@8.5.3__terser@5.37.0_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { extname, relative, resolve } from "path";
import { fileURLToPath } from "node:url";
import { glob } from "file:///home/loren/dev/wanderlust/node_modules/.pnpm/glob@11.0.1/node_modules/glob/dist/esm/index.js";
import { libInjectCss } from "file:///home/loren/dev/wanderlust/node_modules/.pnpm/vite-plugin-lib-inject-css@2.2.1_vite@4.5.9_@types+node@22.10.10_sass@1.83.4_sugarss@4.0.1_postcss@8.5.3__terser@5.37.0_/node_modules/vite-plugin-lib-inject-css/dist/index.js";
import dts from "file:///home/loren/dev/wanderlust/node_modules/.pnpm/vite-plugin-dts@4.5.0_@types+node@22.10.10_rollup@4.32.0_typescript@5.7.3_vite@4.5.9_@types+n_i7yz2eyvocnn2mnrzldsqmymjy/node_modules/vite-plugin-dts/dist/index.mjs";
import path from "path";
import tsconfigPaths from "file:///home/loren/dev/wanderlust/node_modules/.pnpm/vite-tsconfig-paths@5.1.4_typescript@5.7.3_vite@4.5.9_@types+node@22.10.10_sass@1.83.4_sugars_6w2dkymhds4cnwpkhkxisrlxzq/node_modules/vite-tsconfig-paths/dist/index.js";
var __vite_injected_original_import_meta_url = "file:///home/loren/dev/wanderlust/packages/configure/vite.config.js";
var __filename = fileURLToPath(__vite_injected_original_import_meta_url);
var __dirname = path.dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [react(), tsconfigPaths(), libInjectCss(), dts({ include: ["lib"] })],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      formats: ["es"]
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
      input: Object.fromEntries(
        glob.sync("lib/**/*.{ts,tsx}", {
          ignore: ["lib/**/*.d.ts"]
        }).map((file) => [
          // The name of the entry point
          // lib/nested/foo.ts becomes nested/foo
          relative("lib", file.slice(0, file.length - extname(file).length)),
          // The absolute path to the entry file
          // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
          fileURLToPath(new URL(file, __vite_injected_original_import_meta_url))
        ])
      ),
      output: {
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "[name].js"
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9sb3Jlbi9kZXYvd2FuZGVybHVzdC9wYWNrYWdlcy9jb25maWd1cmVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2xvcmVuL2Rldi93YW5kZXJsdXN0L3BhY2thZ2VzL2NvbmZpZ3VyZS92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9sb3Jlbi9kZXYvd2FuZGVybHVzdC9wYWNrYWdlcy9jb25maWd1cmUvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHsgZXh0bmFtZSwgcmVsYXRpdmUsIHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gXCJub2RlOnVybFwiO1xuaW1wb3J0IHsgZ2xvYiB9IGZyb20gXCJnbG9iXCI7XG5pbXBvcnQgeyBsaWJJbmplY3RDc3MgfSBmcm9tIFwidml0ZS1wbHVnaW4tbGliLWluamVjdC1jc3NcIjtcbmltcG9ydCBkdHMgZnJvbSBcInZpdGUtcGx1Z2luLWR0c1wiO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJ1xuXG5jb25zdCBfX2ZpbGVuYW1lID0gZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpO1xuY29uc3QgX19kaXJuYW1lID0gcGF0aC5kaXJuYW1lKF9fZmlsZW5hbWUpO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCksIHRzY29uZmlnUGF0aHMoKSwgbGliSW5qZWN0Q3NzKCksIGR0cyh7IGluY2x1ZGU6IFtcImxpYlwiXSB9KV0sXG4gIGJ1aWxkOiB7XG4gICAgY29weVB1YmxpY0RpcjogZmFsc2UsXG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsIFwibGliL21haW4udHNcIiksXG4gICAgICBmb3JtYXRzOiBbXCJlc1wiXSxcbiAgICB9LFxuXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgZXh0ZXJuYWw6IFtcInJlYWN0XCIsIFwicmVhY3QvanN4LXJ1bnRpbWVcIl0sXG4gICAgICBpbnB1dDogT2JqZWN0LmZyb21FbnRyaWVzKFxuICAgICAgICBnbG9iXG4gICAgICAgICAgLnN5bmMoXCJsaWIvKiovKi57dHMsdHN4fVwiLCB7XG4gICAgICAgICAgICBpZ25vcmU6IFtcImxpYi8qKi8qLmQudHNcIl0sXG4gICAgICAgICAgfSlcbiAgICAgICAgICAubWFwKChmaWxlKSA9PiBbXG4gICAgICAgICAgICAvLyBUaGUgbmFtZSBvZiB0aGUgZW50cnkgcG9pbnRcbiAgICAgICAgICAgIC8vIGxpYi9uZXN0ZWQvZm9vLnRzIGJlY29tZXMgbmVzdGVkL2Zvb1xuICAgICAgICAgICAgcmVsYXRpdmUoXCJsaWJcIiwgZmlsZS5zbGljZSgwLCBmaWxlLmxlbmd0aCAtIGV4dG5hbWUoZmlsZSkubGVuZ3RoKSksXG4gICAgICAgICAgICAvLyBUaGUgYWJzb2x1dGUgcGF0aCB0byB0aGUgZW50cnkgZmlsZVxuICAgICAgICAgICAgLy8gbGliL25lc3RlZC9mb28udHMgYmVjb21lcyAvcHJvamVjdC9saWIvbmVzdGVkL2Zvby50c1xuICAgICAgICAgICAgZmlsZVVSTFRvUGF0aChuZXcgVVJMKGZpbGUsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgICAgICAgIF0pXG4gICAgICApLFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiBcImFzc2V0cy9bbmFtZV1bZXh0bmFtZV1cIixcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6IFwiW25hbWVdLmpzXCIsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeVQsU0FBUyxvQkFBb0I7QUFDdFYsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsU0FBUyxVQUFVLGVBQWU7QUFDM0MsU0FBUyxxQkFBcUI7QUFDOUIsU0FBUyxZQUFZO0FBQ3JCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLFVBQVU7QUFDakIsT0FBTyxtQkFBbUI7QUFSd0ssSUFBTSwyQ0FBMkM7QUFVblAsSUFBTSxhQUFhLGNBQWMsd0NBQWU7QUFDaEQsSUFBTSxZQUFZLEtBQUssUUFBUSxVQUFVO0FBR3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLEdBQUcsY0FBYyxHQUFHLGFBQWEsR0FBRyxJQUFJLEVBQUUsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7QUFBQSxFQUM3RSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsSUFDZixLQUFLO0FBQUEsTUFDSCxPQUFPLFFBQVEsV0FBVyxhQUFhO0FBQUEsTUFDdkMsU0FBUyxDQUFDLElBQUk7QUFBQSxJQUNoQjtBQUFBLElBRUEsZUFBZTtBQUFBLE1BQ2IsVUFBVSxDQUFDLFNBQVMsbUJBQW1CO0FBQUEsTUFDdkMsT0FBTyxPQUFPO0FBQUEsUUFDWixLQUNHLEtBQUsscUJBQXFCO0FBQUEsVUFDekIsUUFBUSxDQUFDLGVBQWU7QUFBQSxRQUMxQixDQUFDLEVBQ0EsSUFBSSxDQUFDLFNBQVM7QUFBQTtBQUFBO0FBQUEsVUFHYixTQUFTLE9BQU8sS0FBSyxNQUFNLEdBQUcsS0FBSyxTQUFTLFFBQVEsSUFBSSxFQUFFLE1BQU0sQ0FBQztBQUFBO0FBQUE7QUFBQSxVQUdqRSxjQUFjLElBQUksSUFBSSxNQUFNLHdDQUFlLENBQUM7QUFBQSxRQUM5QyxDQUFDO0FBQUEsTUFDTDtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ04sZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
