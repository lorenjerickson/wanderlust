import { Effect } from "./effect";

export class Ability {
    value: number;
    effects: Effect[];

    constructor(value: number) {
        this.value = value;
        this.effects = [];
    }

    get effectiveValue() {
        return this.value;
    }
}