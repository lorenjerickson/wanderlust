<<<<<<< HEAD
import { Effect } from "./effect";
=======
import { Effect } from "./effect"
>>>>>>> cb21b1c (feat: auth with jwt)

export class Ability {
  value: number
  effects: Effect[]

  constructor(value: number) {
    this.value = value
    this.effects = []
  }

  get effectiveValue() {
    return this.value
  }
}
