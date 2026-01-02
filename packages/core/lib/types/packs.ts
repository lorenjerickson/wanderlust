import { Item } from './items'

export enum PackType {
  Adventurer = 'adventurer',
  Explorer = 'explorer',
  Survival = 'survival',
  Priest = 'priest',
  Thief = 'thief',
  Burglar = 'burglar',
  Diplomat = 'diplomat',
  Noble = 'noble',
  Entertainer = 'entertainer',
}

export type Pack = Item & {
  type: PackType
  capacity: number // e.g., total weight the pack can hold
  volume: number // e.g., total volume (cubic units) the pack can hold
  contents: Array<Item>
}
