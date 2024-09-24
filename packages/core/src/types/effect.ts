<<<<<<< HEAD
import { Ability } from "./ability";
import { Adjustment } from "./adjustment";
import { Attribute } from "./attribute";

export type Effect = {
    name: string;
    description: string;
    target: Attribute | Ability;
    adjustment: Adjustment;
}
=======
import { Ability } from "./ability"
import { Adjustment } from "./adjustment"
import { Attribute } from "./attribute"

export type Effect = {
  name: string
  description: string
  target: Attribute | Ability
  adjustment: Adjustment
}
>>>>>>> cb21b1c (feat: auth with jwt)
