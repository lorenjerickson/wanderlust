import { RoleName } from "./role.js";

export interface Permissions {
  create: boolean;
  read: boolean;
  write: boolean;
  remove: boolean;
}

export type MappedPermissions = Record<RoleName, Permissions>;

export interface Ownership {
  roles?: MappedPermissions;
  participants?: MappedPermissions;
}
