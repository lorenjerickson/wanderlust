import { Ownership } from '@wanderlust/core';
import { Schema } from 'mongoose';
import { MappedPermissionsSchema } from './permissions.schema';

export const OwnershipSchema = new Schema<Ownership>({
  roles: [MappedPermissionsSchema],
  participants: [MappedPermissionsSchema],
});
