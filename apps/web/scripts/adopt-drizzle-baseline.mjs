import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { createClient } from '@libsql/client'

const databaseUrl =
    process.env.DATABASE_URL ?? `file:${resolve('local-data.sqlite')}`
const migrationPath = resolve('drizzle/0000_v6_baseline.sql')
const journalPath = resolve('drizzle/meta/_journal.json')

const [migrationSql, journalJson] = await Promise.all([
    readFile(migrationPath, 'utf8'),
    readFile(journalPath, 'utf8'),
])

const journal = JSON.parse(journalJson)
const baseline = journal.entries.find(
    (entry) => entry.tag === '0000_v6_baseline'
)

if (!baseline) {
    throw new Error('The v6 Drizzle baseline is missing from the journal.')
}

const db = createClient({ url: databaseUrl })

try {
    const versionResult = await db.execute(
        'SELECT currentVersion FROM SCHEMA_VERSION LIMIT 1'
    )
    const currentVersion = versionResult.rows[0]?.currentVersion

    if (Number(currentVersion) !== 6) {
        throw new Error(
            `Expected legacy schema version 6, received ${String(currentVersion)}.`
        )
    }

    await db.executeMultiple(`
        CREATE TABLE IF NOT EXISTS __drizzle_migrations (
            id SERIAL PRIMARY KEY,
            hash TEXT NOT NULL,
            created_at NUMERIC
        );
    `)

    const existing = await db.execute(
        'SELECT COUNT(*) AS count FROM __drizzle_migrations'
    )

    if (Number(existing.rows[0]?.count) !== 0) {
        throw new Error(
            'This database already has a Drizzle migration history.'
        )
    }

    const hash = createHash('sha256').update(migrationSql).digest('hex')

    await db.execute({
        sql: `
            INSERT INTO __drizzle_migrations (hash, created_at)
            VALUES (?, ?)
        `,
        args: [hash, baseline.when],
    })

    console.log(`Adopted Drizzle baseline for ${databaseUrl}.`)
} finally {
    db.close()
}
