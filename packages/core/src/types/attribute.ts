import { Adjustment } from "./adjustment"

export type Attribute = {
  name: string
  description: string
  shortName: string
  baseValue: number
  adjustments: Adjustment[]
}
