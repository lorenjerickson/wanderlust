import type { CollectionConfig } from 'payload'
import { L } from 'vitest/dist/chunks/reporters.d.DL9pg5DB.js'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        {
          label: 'Image',
          value: 'image',
        },
        {
          label: 'Video',
          value: 'video',
        },
        {
          label: 'Document',
          value: 'document',
        },
        {
          label: 'Video',
          value: 'video',
        },
      ],
      required: true,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
  ],
  upload: true,
}
