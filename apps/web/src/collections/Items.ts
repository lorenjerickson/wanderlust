import {
  AttributeType,
  EffectType,
  ItemType,
  ModifierType,
  ModifierValueAdjustmentType,
  SpeedType,
  DamageType,
  WeaponType,
} from '@core/types'
import type { CollectionConfig } from 'payload'

export const Items: CollectionConfig = {
  slug: 'items',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'type',
      type: 'select',
      options: Object.keys(ItemType).map((key) => ({
        label: key,
        value: ItemType[key as keyof typeof ItemType],
      })),
      required: true,
    },
    {
      name: 'weapon',
      label: 'Weapon Details',
      type: 'group',
      fields: [
        {
          name: 'weaponType',
          type: 'select',
          options: Object.keys(WeaponType).map((key) => ({
            label: key,
            value: WeaponType[key as keyof typeof WeaponType],
          })),
        },
        {
          name: 'damageFormula',
          type: 'text',
        },
        {
          name: 'damageType',
          type: 'select',
          options: Object.keys(DamageType).map((key) => ({
            label: key,
            value: DamageType[key as keyof typeof DamageType],
          })),
        },
        {
          name: 'range',
          type: 'number',
          required: false,
          defaultValue: 5,
        },
        {
          name: 'modifiers',
          type: 'array',
          fields: [
            {
              name: 'modifier',
              type: 'group',
              fields: [
                {
                  name: 'modifierType',
                  label: 'Modifier Type',
                  type: 'select',
                  options: Object.keys(ModifierType).map((key) => ({
                    label: key,
                    value: ModifierType[key as keyof typeof ModifierType],
                  })),
                },
                {
                  name: 'effects',
                  label: 'Effects',
                  type: 'array',
                  fields: [
                    {
                      name: 'effect',
                      label: 'Effect',
                      type: 'group',
                      fields: [
                        {
                          name: 'effectType',
                          label: 'Effect Type',
                          type: 'select',
                          options: Object.keys(EffectType).map((key) => ({
                            label: key,
                            value: EffectType[key as keyof typeof EffectType],
                          })),
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      admin: {
        condition: (data, siblingData) => siblingData.type === ItemType.Weapon,
      },
    },
    {
      name: 'armor',
      label: 'Armor Details',
      type: 'group',
      fields: [
        {
          name: 'modifiers',
          type: 'array',
          fields: [
            {
              name: 'modifier',
              type: 'group',
              fields: [
                {
                  name: 'modifierType',
                  label: 'Modifier Type',
                  type: 'select',
                  options: Object.keys(ModifierType).map((key) => ({
                    label: key,
                    value: ModifierType[key as keyof typeof ModifierType],
                  })),
                },
                {
                  name: 'attribute',
                  label: 'Attribute',
                  type: 'select',
                  options: Object.keys(AttributeType).map((key) => ({
                    label: key,
                    value: AttributeType[key as keyof typeof AttributeType],
                  })),
                  admin: {
                    condition: (data, siblingData) =>
                      siblingData.modifierType === ModifierType.Attribute,
                  },
                },
                {
                  name: 'ability',
                  label: 'Ability',
                  type: 'select',
                  options: Object.keys(AttributeType).map((key) => ({
                    label: key,
                    value: AttributeType[key as keyof typeof AttributeType],
                  })),
                  admin: {
                    condition: (data, siblingData) =>
                      siblingData.modifierType === ModifierType.Ability,
                  },
                },
                {
                  name: 'speed',
                  label: 'Speed',
                  type: 'select',
                  options: Object.keys(SpeedType).map((key) => ({
                    label: key,
                    value: SpeedType[key as keyof typeof SpeedType],
                  })),
                  admin: {
                    condition: (data, siblingData) =>
                      siblingData.modifierType === ModifierType.Speed,
                  },
                },
                {
                  name: 'adjustmentType',
                  label: 'Adjustment Type',
                  type: 'select',
                  options: Object.keys(ModifierValueAdjustmentType).map(
                    (key) => ({
                      label: key,
                      value:
                        ModifierValueAdjustmentType[
                          key as keyof typeof ModifierValueAdjustmentType
                        ],
                    }),
                  ),
                  admin: {
                    condition: (data, siblingData) =>
                      siblingData.modifierType === ModifierType.Attribute ||
                      siblingData.modifierType === ModifierType.Ability ||
                      siblingData.modifierType === ModifierType.ArmorClass,
                  },
                },
                {
                  name: 'adjustmentValue',
                  label: 'Adjustment Value',
                  type: 'number',
                },
              ],
            },
          ],
        },
      ],
      admin: {
        condition: (data, siblingData) => siblingData.type === ItemType.Armor,
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
  ],
}
