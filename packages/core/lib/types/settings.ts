import { Ownership, Permissions } from "./ownership";

type SettingDataType = string | number | boolean;
type ArraySettingDataType = Array<SettingDataType>;

export type OptionValue = { label: string; value: string };
export type ControlType = "text" | "number" | "choice" | "toggle" | "range" | "password";
export type ValueType = SettingDataType | ArraySettingDataType;

export interface ISetting {
  key: string;
  label: string;
  description: string;
  required: boolean;
  placeholder?: string;
  value?: ValueType;
  defaultValue?: ValueType;
  type: ControlType;
  options?: Array<OptionValue>;
  min?: number;
  max?: number;
  increment?: number; // for range
  disabled?: boolean;
  ownership: Ownership;
}

export interface ISettingsGroup {
  key: string;
  label: string;
  description: string;
  icon?: string;
  settings: ISetting[];
}

export type Settings = Array<ISettingsGroup>;
