import { Item } from "./items"

export enum LootType {
  Currency = 'currency',
  Jewelry = 'jewelry',
  Gem = 'gem',
  Art = 'art',
  Junk = 'junk',
  Artifact = 'artifact',
  Mundane = 'mundane',
  Other = 'other',
}

export type Loot = Item & {
  type: LootType
  quantity: number
  valuePerItem?: number // value of a single item
}
