import { SettingsGroup } from "./settings";

export interface SemanticVersion {
  major: number;
  minor: number;
  patch: number;
}

export interface ModuleHandler {
  onInit: (app: unknown) => void;
  onDestroy: (app: unknown) => void;
  onLoad: (app: unknown) => void;
  onSuspend: (app: unknown) => void;  
}

export interface ModuleManifest {
  key: string;
  dependsOn: string[];
  version: SemanticVersion;
  handler: ModuleHandler;
  settings: SettingsGroup;  
}
