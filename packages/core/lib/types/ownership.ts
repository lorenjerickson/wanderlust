import { Role } from "./role.js";

export interface Permissions {
  create: boolean;
  read: boolean;
  write: boolean;
  remove: boolean;
}

export interface Ownership {
  roles?: Record<Role, Permissions>;
  participants?: Record<string, Permissions>;
}
