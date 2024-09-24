import { list } from "@keystone-6/core"
import { allowAll } from "@keystone-6/core/access"
import { relationship, text } from "@keystone-6/core/fields"
import { changeLogSchema } from "./change-log"

export const itemSchema = {
  Tag: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
    },
  }),
}
