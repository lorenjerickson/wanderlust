import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const settingsGroups = sqliteTable(
    'settings_groups',
    {
        key: text().primaryKey(),
        label: text().notNull(),
        description: text().notNull(),
        icon: text(),
        moduleId: text(),
        settings: text().notNull(),
    },
    (table) => []
)
