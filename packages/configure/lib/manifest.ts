import { ModuleManifest } from "@wanderlust/core";
import handler from "./handler";

const manifest: ModuleManifest = {
  key: "configure",
  dependsOn: [],
  version: { major: 1, minor: 0, patch: 0 },
  handler,
};

export default manifest;
