import { Schema } from 'mongoose';
import { SettingsGroup, Setting, SettingOption } from '@wanderlust/core';

export const SettingOptionsSchema = new Schema<SettingOption>({
  label: { type: String, required: true },
  value: { type: String, required: true },
});

export const SettingsSchema = new Schema<Setting>({
  key: { type: String, required: true },
  label: { type: String, required: true },
  description: { type: String, required: true },
  required: { type: Boolean, required: false },
  placeholder: { type: String },
  value: { type: String },
  defaultValue: { type: String },
  type: { type: String, required: true },
  options: [{ type: Schema.Types.ObjectId, ref: 'SettingOption' }],
  min: { type: Number },
  max: { type: Number },
  increment: { type: Number },
  disabled: { type: Boolean },
  ownership: { type: Object, required: true },
});

export const SettingsGroupSchema = new Schema<SettingsGroup>({
  key: { type: String, required: true },
  label: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String },
  settings: { type: [SettingsSchema], required: true },
});
