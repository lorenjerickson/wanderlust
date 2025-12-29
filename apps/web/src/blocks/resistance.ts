import { ConditionType } from '@/types/effects'
import { DamageType } from '@/types/weapon'
import { DurationBlock } from './duration'

export const ResistanceBlock = {
  type: 'block',
  fields: [
    {
      name: 'resistanceType',
      type: 'select',
      options: Object.keys(DamageType)
        .map((key) => ({
          label: key,
          value: DamageType[key as keyof typeof DamageType] as DamageType | ConditionType,
        }))
        .concat(
          Object.keys(ConditionType).map((key) => ({
            label: key,
            value: ConditionType[key as keyof typeof ConditionType] as DamageType | ConditionType,
          })),
        ),
      required: true,
    },
    {
      name: 'value',
      type: 'number',
      required: true,
    },
    ...DurationBlock,
  ],
}
