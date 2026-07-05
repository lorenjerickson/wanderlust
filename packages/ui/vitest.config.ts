import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: [
      "lib/components/Workspace/**/*.test.ts",
      "lib/components/Workspace/**/*.test.tsx",
      "lib/components/Panel/**/*.test.ts",
      "lib/components/Panel/**/*.test.tsx",
      "lib/components/Scene/**/*.test.ts",
      "lib/components/Scene/**/*.test.tsx",
      "lib/components/ActorDetail/**/*.test.ts",
      "lib/components/ActorDetail/**/*.test.tsx",
      "lib/components/Actors/**/*.test.ts",
      "lib/components/Actors/**/*.test.tsx",
      "lib/components/Compendium/**/*.test.ts",
      "lib/components/Compendium/**/*.test.tsx",
      "lib/components/Chat/**/*.test.ts",
      "lib/components/Chat/**/*.test.tsx",
      "lib/components/Campaign/**/*.test.ts",
      "lib/components/Campaign/**/*.test.tsx",
      "lib/components/Encounter/**/*.test.ts",
      "lib/components/Encounter/**/*.test.tsx",
    ],
  },
});
