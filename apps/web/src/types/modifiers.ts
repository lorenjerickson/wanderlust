import { AbilityType } from './abilities'
import { AttributeType } from './attributes'
import { Duration } from './duration'
import { EffectType } from './effects'
import { SpeedType } from './speed'

export type ModifierTarget =
  | AbilityType
  | AttributeType
  | 'initiative'
  | SpeedType
  | 'defense'
  | 'offense'
  | 'health'
  | EffectType

export enum ModifierValueAdjustmentType {
  Fixed = 'fixed',
  Increment = 'increment',
}

export type Modifier = {
  name: string
  target: ModifierTarget
  valueType: ModifierValueAdjustmentType
  value?: number
  formula?: string
  // fixed = set to value, increment = add value to existing
  duration: Duration
}

export enum ModifierType {
  Ability = 'ability',
  Attribute = 'attribute',
  Initiative = 'initiative',
  Speed = 'speed',
  ArmorClass = 'armorClass',
  Health = 'health',
  Effect = 'effect',
}
