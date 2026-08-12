import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const auth = sqliteTable(
    'auth',
    {
        username: text().primaryKey(),
        jwt: text().notNull(),
        createdOn: text()
            .default(sql`(CURRENT_TIMESTAMP)`)
            .notNull(),
    },
    (table) => []
)
