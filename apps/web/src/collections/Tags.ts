import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      index: true,
      name: 'name',
      unique: true,
      label: 'Tag Name',
      type: 'text',
      required: true,
    },
  ],
}
