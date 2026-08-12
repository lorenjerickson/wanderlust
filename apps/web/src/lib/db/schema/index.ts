import { sqliteTable, numeric } from 'drizzle-orm/sqlite-core'

export * from './users'
export * from './auth'
export * from './settings'
export * from './media'
export * from './campaigns'
export * from './worlds'
export * from './actors'
export * from './catalogs'
export * from './inventory'
export * from './effects'

export const schemaVersion = sqliteTable(
    'SCHEMA_VERSION',
    {
        currentVersion: numeric().notNull(),
    },
    (table) => []
)
