import { list } from "@keystone-6/core"
import { allowAll } from "@keystone-6/core/access"
import { relationship, text } from "@keystone-6/core/fields"

export const itemSchema = {
  Item: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    // this is the fields for our User list
    fields: {
      name: text({ validation: { isRequired: true } }),
      description: text({ validation: { isRequired: true } }),
      value: text({ validation: { isRequired: false }, defaultValue: "0" }),
      weight: text({ validation: { isRequired: false }, defaultValue: "0" }),
      tags: relationship({ ref: "Tag", many: true }),
      changeLog: relationship({ ref: "ChangeLog", many: false }),
    },
  }),
}
