import { Participant } from "./participant";
import { Role } from "./role";

export type Permissions = {
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
};

export type Ownership = {
  roles: Record<Role, Permissions>;
  participants: Record<string, Permissions>;
};
