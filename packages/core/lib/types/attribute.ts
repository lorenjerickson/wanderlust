import { Adjustment } from "./adjustment.js";

export interface Attribute {
  name: string;
  description: string;
  abbrev: string;
  baseValue: number;
  adjustments: Adjustment[];
}
