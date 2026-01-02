import { AccessArgs, CollectionConfig } from 'payload'

export const Invitations: CollectionConfig = {
  slug: 'invitations',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'who',
      type: 'group',
      fields: [
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
          name: 'message',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'invitation',
      type: 'group',
      fields: [
        {
          name: 'invitedBy',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'invitedOn',
          type: 'date',
          required: true,
        },
        {
          name: 'acceptedOn',
          type: 'date',
        },

        {
          name: 'expiresOn',
          type: 'date',
        },
        {
          name: 'code',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
