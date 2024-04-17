import { Adjustment } from "./adjustment";

export type Attribute = {
    name: string;
    description: string;
    abbrev: string;
    baseValue: number;
    adjustments: Adjustment[];
}