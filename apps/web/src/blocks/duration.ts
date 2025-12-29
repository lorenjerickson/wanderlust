import { DurationType } from '@/types/duration'

export const DurationBlock = [
  {
    type: 'block',
    fields: [
      {
        name: 'duration',
        type: 'select',
        options: Object.keys(DurationType).map((key) => ({
          label: key,
          value: DurationType[key as keyof typeof DurationType],
        })),
        required: true,
      },
      {
        name: 'interval',
        type: 'number',
        required: false,
        admin: {
          condition: (_data: unknown, siblingData: { duration?: DurationType }) =>
            siblingData.duration === DurationType.Temporary,
        },
      },
      {
        name: 'durationUnits',
        type: 'select',
        options: Object.keys(DurationType).map((key) => ({
          label: key,
          value: DurationType[key as keyof typeof DurationType],
        })),
        required: true,
      },
    ],
  },
]
