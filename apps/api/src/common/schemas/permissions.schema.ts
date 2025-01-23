import { MappedPermissions, Permissions } from '@wanderlust/core';
import { Schema } from 'mongoose';

export const PermissionsSchema = new Schema<Permissions>({
  create: { type: Boolean, required: true },
  read: { type: Boolean, required: true },
  write: { type: Boolean, required: true },
  remove: { type: Boolean, required: true },
});

export const MappedPermissionsSchema = new Schema<MappedPermissions>({
  key: String,
  permissions: PermissionsSchema,
});
