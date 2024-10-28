import { Schema } from 'mongoose';
import { User } from '@wanderlust/core';

export const UserSchema = new Schema<User>({
  emailAddress: { type: String, required: true },
  password: { type: String, required: true },
  roles: [{ type: String }],
});
