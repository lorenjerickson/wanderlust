import { Role } from '@wanderlust/core';
import { Schema } from 'mongoose';

export const RoleSchema = new Schema<Role>({
  name: String,
  description: String,
});
