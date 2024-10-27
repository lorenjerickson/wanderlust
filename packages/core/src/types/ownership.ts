import { Role } from "./role.js";

export interface Permissions {
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export interface Ownership {
  roles: Record<Role, Permissions>;
  participants: Record<string, Permissions>;
}
