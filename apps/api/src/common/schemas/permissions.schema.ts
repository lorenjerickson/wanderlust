import { MappedPermissions, Permissions, RoleName } from '@wanderlust/core';
import { Schema } from 'mongoose';

export const PermissionsSchema = new Schema<Permissions>({
  create: { type: Boolean, required: true },
  read: { type: Boolean, required: true },
  write: { type: Boolean, required: true },
  remove: { type: Boolean, required: true },
});

export const MappedPermissionsSchema = new Schema<MappedPermissions>({
  [RoleName.GlobalAdmin]: { type: PermissionsSchema, required: true },
  [RoleName.LocalAdmin]: { type: PermissionsSchema, required: true },
  [RoleName.GameMaster]: { type: PermissionsSchema, required: true },
  [RoleName.Player]: { type: PermissionsSchema, required: true },
  [RoleName.Spectator]: { type: PermissionsSchema, required: true },
});
