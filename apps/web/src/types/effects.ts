import { AbilityType } from './abilities'
import { AttributeType } from './attributes'
import { Duration } from './duration'
import { Modifier } from './modifiers'
import { RollType } from './roll'
import { DamageType } from './weapon'

export enum EffectType {
  Grant = 'grant',
  Revoke = 'revoke',
  Condition = 'condition',
}

export enum GrantType {
  Advantage = 'advantage',
  Disadvantage = 'disadvantage',
  Immunity = 'immunity',
  Resistance = 'resistance',
  Vulnerability = 'vulnerability',
}

export type Grant = {
  type: GrantType
  target: DamageType | ConditionType | RollType
  secondaryTarget?: AttributeType | AbilityType
}

export enum ConditionType {
  Prone = 'prone',
  Restrained = 'restrained',
  Stunned = 'stunned',
  Invisible = 'invisible',
  Incapacitated = 'incapacitated',
  Charmed = 'charmed',
  Frightened = 'frightened',
  Grappled = 'grappled',
  Paralyzed = 'paralyzed',
  Petrified = 'petrified',
  Poisoned = 'poisoned',
  Unconscious = 'unconscious',
  Blinded = 'blinded',
  Deafened = 'deafened',
  Silenced = 'silenced',
}

export type Effect = {
  type: EffectType
  grant?: Grant
  condition?: ConditionType
  modifier?: Modifier // e.g., +1d4 poison damage per turn
  duration: Duration
}
