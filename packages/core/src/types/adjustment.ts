import { Duration } from "./duration";

export type Adjustment = {
    increment: number;
    description: string;
    duration: Duration;
}