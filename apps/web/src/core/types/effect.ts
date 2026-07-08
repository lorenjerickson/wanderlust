import { Ability } from "./ability.js";
import { Adjustment } from "./adjustment.js";
import { Attribute } from "./attribute.js";

export interface Effect {
  name: string;
  description: string;
  target: Attribute | Ability;
  adjustment: Adjustment;
}
