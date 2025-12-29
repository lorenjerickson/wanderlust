import { DamageType } from '@/types/weapon'

export const DamageBlock = {
  admin: {
    useAsTitle: (data: any) =>
      data?.fields.damage?.fields.formula + ' (' + data?.fields.damage?.fields.type + ')',
  },
  fields: [
    {
      name: 'damage',
      type: 'block',
      fields: [
        {
          name: 'formula',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          options: Object.keys(DamageType).map((key) => ({
            label: key,
            value: DamageType[key as keyof typeof DamageType],
          })),
          required: true,
        },
      ],
    },
  ],
}
