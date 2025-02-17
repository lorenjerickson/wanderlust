import { Schema } from 'mongoose';
import { User } from '@wanderlust/core';

export const UserSchema = new Schema<User>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  emailAddress: { type: String, required: true },
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  zipCode: { type: String, required: true },
  roles: [{ type: Schema.ObjectId, ref: 'Role', required: true }],
  // access: { type: Schema.ObjectId, ref: 'Access', required: true },
  // revisions: { type: Schema.ObjectId, ref: 'Revisions', required: true },
  // social: { type: Schema.ObjectId, ref: 'Social', required: false },
});

export const AccessSchema = new Schema({
  active: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  isSuspended: { type: Boolean, default: false },
  lastActive: { type: Date, default: Date.now },
  lastOnline: { type: Date, default: Date.now },
});

export const SocialSchema = new Schema({
  discord: { type: String, default: '' },
  facebook: { type: String, default: '' },
  instagram: { type: String, default: '' },
  twitter: { type: String, default: '' },
});

export const RevisionsSchema = new Schema({
  createdOn: { type: Date, default: Date.now },
  createdBy: { type: Schema.ObjectId, ref: 'User' },
  updatedOn: { type: Date, default: Date.now },
  updatedBy: { type: Schema.ObjectId, ref: 'User' },
});
