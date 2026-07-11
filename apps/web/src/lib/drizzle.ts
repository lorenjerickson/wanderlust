import { createClient, type Client } from '@libsql/client'
import { drizzle, type LibSQLDatabase } from 'drizzle-orm/libsql'
import { resolve } from 'node:path'

import * as relations from './db/schema/relations'
import * as schema from './db/schema'

const databaseUrl =
    process.env.DATABASE_URL ?? `file:${resolve('local-data.sqlite')}`

const fullSchema = { ...schema, ...relations }

export type DrizzleDatabase = LibSQLDatabase<typeof fullSchema>

let client: Client | null = null
let instance: DrizzleDatabase | null = null
let instancePromise: Promise<DrizzleDatabase> | null = null

async function openDrizzleDb() {
    client = createClient({ url: databaseUrl })

    await client.executeMultiple(`
        PRAGMA foreign_keys = ON;
        PRAGMA journal_mode = WAL;
        PRAGMA busy_timeout = 5000;
        PRAGMA synchronous = NORMAL;
    `)

    instance = drizzle(client, { schema: fullSchema })
    return instance
}

export async function getDrizzleDb() {
    if (instance) return instance

    if (!instancePromise) {
        instancePromise = openDrizzleDb().catch((error) => {
            client?.close()
            client = null
            instancePromise = null
            throw error
        })
    }

    return instancePromise
}
