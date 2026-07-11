import { randomUUID } from 'node:crypto'
import { unlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'

const legacyUrl =
    process.env.DATABASE_URL ?? `file:${resolve('local-data.sqlite')}`
const freshPath = join(tmpdir(), `wanderlust-drizzle-${randomUUID()}.sqlite`)
const freshUrl = `file:${freshPath}`

const schemaQuery = `
    SELECT type, name, sql
    FROM sqlite_master
    WHERE name NOT LIKE 'sqlite_%'
      AND name NOT LIKE '__drizzle%'
    ORDER BY type, name
`

const legacyClient = createClient({ url: legacyUrl })
const freshClient = createClient({ url: freshUrl })

try {
    await migrate(drizzle(freshClient), {
        migrationsFolder: resolve('drizzle'),
    })

    const [legacySchema, freshSchema, legacyForeignKeys, freshForeignKeys] =
        await Promise.all([
            legacyClient.execute(schemaQuery),
            freshClient.execute(schemaQuery),
            legacyClient.execute('PRAGMA foreign_key_check'),
            freshClient.execute('PRAGMA foreign_key_check'),
        ])

    if (legacyForeignKeys.rows.length || freshForeignKeys.rows.length) {
        throw new Error('A database contains foreign-key violations.')
    }

    const legacyJson = JSON.stringify(legacySchema.rows)
    const freshJson = JSON.stringify(freshSchema.rows)

    if (legacyJson !== freshJson) {
        throw new Error(
            'The Drizzle baseline does not match the legacy database schema.'
        )
    }

    console.log(
        `Verified ${freshSchema.rows.length} schema objects with no foreign-key violations.`
    )
} finally {
    legacyClient.close()
    freshClient.close()
    await unlink(freshPath).catch(() => undefined)
}
