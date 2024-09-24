import { list } from "@keystone-6/core"
import { allowAll } from "@keystone-6/core/access"
import { text, timestamp } from "@keystone-6/core/fields"

export const changeLogSchema = {
  ChangeLog: list({
    access: allowAll,
    fields: {
      itemId: text({ validation: { isRequired: true } }),
      createdAt: timestamp({
        defaultValue: { kind: "now" },
      }),
      createdBy: text({ validation: { isRequired: true } }),
      lastUpdatedAt: timestamp({
        defaultValue: { kind: "now" },
      }),
      lastUpdatedBy: text({ validation: { isRequired: true } }),
    },
  }),
}
