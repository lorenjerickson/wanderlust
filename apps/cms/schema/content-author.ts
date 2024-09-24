import { text } from "@keystone-6/core/fields"

export const ContentAuthorSchema = {
  ContentAuthor: {
    fields: {
      name: text({ validation: { isRequired: true } }),
      role: text({ validation: { isRequired: true } }),
    },
  },
}
