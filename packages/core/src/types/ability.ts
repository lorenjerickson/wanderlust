import { Effect } from "./effect.js";

export interface Ability {
  value: number;
  effects: Effect[];
}
