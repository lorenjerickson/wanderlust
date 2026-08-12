import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const media = sqliteTable(
    'media',
    {
        id: text().primaryKey(),
        title: text().notNull(),
        description: text().default('').notNull(),
        type: text().notNull(),
        tags: text().default('[]').notNull(),
        url: text().notNull(),
        createdOn: text()
            .default(sql`(CURRENT_TIMESTAMP)`)
            .notNull(),
        createdBy: text(),
        updatedOn: text()
            .default(sql`(CURRENT_TIMESTAMP)`)
            .notNull(),
        updatedBy: text(),
    },
    (table) => []
)
