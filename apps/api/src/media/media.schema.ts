import { Schema } from 'mongoose';
import { Media } from '@wanderlust/core';

export const MediaSchema = new Schema<Media>({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  type: { type: String, required: true },
  tags: [{ type: Schema.ObjectId, ref: 'Tag' }],
  url: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
  createdBy: { type: Schema.ObjectId, ref: 'User' },
  updatedOn: { type: Date, default: Date.now },
  updatedBy: { type: Schema.ObjectId, ref: 'User' },
});
