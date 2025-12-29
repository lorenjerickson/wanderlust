import { Modifier } from './modifiers'

export enum ItemType {
  Weapon = 'weapon',
  Armor = 'armor',
  Consumable = 'consumable',
  Tool = 'tool',
  Pack = 'pack',
  Ration = 'ration',
  Loot = 'loot',  
}

export type Item = {
  name: string
  type: ItemType
  description?: string
  image?: string // URL or media ID
  tags?: string[] // Array of tag IDs
}
