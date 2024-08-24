import { Ability } from "./ability";
import { Adjustment } from "./adjustment";
import { Attribute } from "./attribute";

export type Effect = {
    name: string;
    description: string;
    target: Attribute | Ability;
    adjustment: Adjustment;
}