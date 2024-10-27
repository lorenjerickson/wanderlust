import { Schema } from 'mongoose';
import * as core from '@wanderlust/core';

export const UserSchema = new Schema<core.User>({
  emailAddress: { type: String, required: true },
  password: { type: String, required: true },
  roles: [{ type: String }],
});
