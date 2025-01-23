import { Schema } from 'mongoose';

export const RolesSchema = new Schema({
  name: String,
  description: String,
});
