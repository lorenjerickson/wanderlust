import { ISettingsGroup } from "./settings";

export interface SemanticVersion {
  major: number;
  minor: number;
  patch: number;
}

export interface ModuleHandler {
  onInit: (app: any) => void;
  onDestroy: (app: any) => void;
  onLoad: (app: any) => void;
  onSuspend: (app: any) => void;  
}

export interface ModuleManifest {
  key: string;
  dependsOn: string[];
  version: SemanticVersion;
  handler: ModuleHandler;
  settings: ISettingsGroup;  
}
