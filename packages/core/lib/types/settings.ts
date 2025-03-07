import { Ownership, Permissions } from "./ownership";

type SettingDataType = string | number | boolean;
type ArraySettingDataType = Array<SettingDataType>;

export type ControlType = "text" | "number" | "choice" | "toggle" | "range" | "password";
export type ValueType = SettingDataType | ArraySettingDataType;

export interface SettingOption {
  label: string;
  value: string;
}

export interface Setting {
  key: string;
  label: string;
  description: string;
  required: boolean;
  placeholder?: string;
  value?: ValueType;
  defaultValue?: ValueType;
  type: ControlType;
  options?: Array<SettingOption>;
  min?: number;
  max?: number;
  increment?: number; // for range
  disabled?: boolean;
  ownership: Ownership;
}

export interface SettingsGroup {
  key: string;
  label: string;
  description: string;
  icon?: string;
  moduleId: string;
  settings: Setting[];
}

export type Settings = Array<SettingsGroup>;
