import { Item } from "./items"

export enum RationType {
  Trail = 'trail',
  Standard = 'standard',
  Gourmet = 'gourmet',
}

export type Ration = Item & {
  type: RationType
  days: number // how long a single ration lasts
  quantity: number
}
