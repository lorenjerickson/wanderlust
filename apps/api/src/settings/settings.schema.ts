import { Schema } from 'mongoose';
import { ISettingsGroup } from '@wanderlust/core';

export const SettingsSchema = new Schema<ISettingsGroup>({
  key: { type: String, required: true },
  label: { type: String, required: true },
  description: { type: String, required: true },
  required: { type: Boolean, required: false },
  placeholder: { type: String },
  value: { type: String },
  defaultValue: { type: String },
  type: { type: String, required: true },
  options: { type: Object },
  min: { type: Number },
  max: { type: Number },
  increment: { type: Number },
  disabled: { type: Boolean },
  ownership: { type: Object, required: true },
});

export const SettingsGroupSchema = new Schema<ISettingsGroup>({
  key: { type: String, required: true },
  label: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String },
  settings: { type: [SettingsSchema], required: true },
});
