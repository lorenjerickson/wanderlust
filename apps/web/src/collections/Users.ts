import { UserStatus } from '@core/types'
import { RoleName } from '@core/types/role'
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'handle',
  },
  auth: true,
  fields: [
    {
      name: 'handle',
      type: 'text',
      required: true,
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: Object.keys(RoleName).map((key) => ({
        label: key,
        value: RoleName[key as keyof typeof RoleName],
      })),
      defaultValue: RoleName.Player,
      required: true,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'status',
      type: 'select',
      options: Object.keys(UserStatus).map((key) => ({
        label: key,
        value: UserStatus[key as keyof typeof UserStatus],
      })),
      defaultValue: UserStatus.Active,
      required: true,
    },    
  ],
}
