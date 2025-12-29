import { Effect } from './effects'
import { Modifier } from './modifiers'

export enum ConsumableType {
  Potion = 'potion',
  Scroll = 'scroll',
  Food = 'food',
  Drink = 'drink',
  Other = 'other',
  Ammunition = 'ammunition',
  Charges = 'charges',
}

export type Consumable = {
  type: ConsumableType
  modifiers?: Array<Modifier>
  effects?: Array<Effect>
  uses: number
}
