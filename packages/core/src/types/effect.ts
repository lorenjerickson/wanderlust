import { Adjustment } from "./adjustment";

export type Effect() {
    name: string;
    description: string;
    target: Attribute | Ability;
    adjustment: Adjustment;
}