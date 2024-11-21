import { ModuleManifest } from "@wanderlust/core";
import settings from "./settings";
import handler from "./handler";

const manifest: ModuleManifest = {
  key: "site",
  dependsOn: [],
  version: { major: 1, minor: 0, patch: 0 },
  handler,
  settings,
};

export default manifest;
