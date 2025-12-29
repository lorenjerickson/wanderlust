import { Item } from './items'
import { Modifier } from './modifiers'
import { SlotType } from './slots'

export enum WeaponType {
  Melee = 'melee',
  Ranged = 'ranged',
}

export enum DamageType {
  Slashing = 'slashing',
  Piercing = 'piercing',
  Bludgeoning = 'bludgeoning',
  Fire = 'fire',
  Cold = 'cold',
  Lightning = 'lightning',
  Acid = 'acid',
  Poison = 'poison',
  Psychic = 'psychic',
  Necrotic = 'necrotic',
  Radiant = 'radiant',
  Thunder = 'thunder',
  Force = 'force',
}

export type Weapon = Item & {
  weaponType: WeaponType
  damageType: DamageType
  slot: SlotType
  damageFormula: string // e.g., "1d8 + 2"
  modifiers: Array<Modifier>
}
