import { Duration } from "./duration\.js";

export interface Adjustment {
    increment: number;
    description: string;
    duration: Duration;
}