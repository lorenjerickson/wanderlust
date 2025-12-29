import { Effect } from './effects'
import { Item } from './items'
import { Modifier } from './modifiers'
import { SlotType } from './slots'

export enum ArmorType {
  Light = 'light',
  Medium = 'medium',
  Heavy = 'heavy',
  Shield = 'shield',
}

export enum ArmorMaterial {
  Cloth = 'cloth',
  Leather = 'leather',
  StuddedLeather = 'studded_leather',
  Hide = 'hide',
  ChainShirt = 'chain_shirt',
  ScaleMail = 'scale_mail',
  Breastplate = 'breastplate',
  HalfPlate = 'half_plate',
  RingMail = 'ring_mail',
  ChainMail = 'chain_mail',
  Splint = 'splint',
  Plate = 'plate',
  Wood = 'wood',
  Metal = 'metal',
}

export type Armor = Item & {
  type: ArmorType
  slot: SlotType
  material: ArmorMaterial
  modifiers?: Array<Modifier>
  effects?: Array<Effect>
}
