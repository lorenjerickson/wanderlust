import { Database } from 'sqlite'

import * as v0InitialSchema from './v0_initial_schema'
import * as v1CampaignLobbyTables from './v1_campaign_lobby_tables'
import * as v2WorldScenarioEncounter from './v2_world_scenario_encounter'
import * as v3FirstGmUserFlags from './v3_first_gm_user_flags'

type Migration = {
    migrationId: string
    schemaVersion: number
    up: (db: Database) => Promise<void>
}

type SchemaVersionRow = {
    currentVersion: number
}

type SqliteTableRow = {
    name: string
}

const migrations: Migration[] = [
    v0InitialSchema,
    v1CampaignLobbyTables,
    v2WorldScenarioEncounter,
    v3FirstGmUserFlags,
]

function getVersionFromMigrationId(migrationId: string) {
    const match = /^v(\d+)[_-].+/.exec(migrationId)

    if (!match) {
        throw new Error(
            `Invalid migration id "${migrationId}". Use "v[schema version number]_[summary]".`
        )
    }

    return Number(match[1])
}

function getOrderedMigrations() {
    const seenVersions = new Set<number>()

    return [...migrations]
        .map((migration) => {
            const versionFromId = getVersionFromMigrationId(
                migration.migrationId
            )

            if (versionFromId !== migration.schemaVersion) {
                throw new Error(
                    `Migration ${migration.migrationId} exports schemaVersion ${migration.schemaVersion}, expected ${versionFromId}.`
                )
            }

            if (seenVersions.has(migration.schemaVersion)) {
                throw new Error(
                    `Duplicate schema migration version ${migration.schemaVersion}.`
                )
            }

            seenVersions.add(migration.schemaVersion)
            return migration
        })
        .sort((left, right) => left.schemaVersion - right.schemaVersion)
}

async function hasSchemaVersionTable(db: Database) {
    const row = await db.get<SqliteTableRow>(
        `
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
        AND name = 'SCHEMA_VERSION'
    `
    )

    return Boolean(row)
}

async function getCurrentSchemaVersion(db: Database) {
    if (!(await hasSchemaVersionTable(db))) {
        return null
    }

    const row = await db.get<SchemaVersionRow>(
        'SELECT currentVersion FROM SCHEMA_VERSION LIMIT 1'
    )

    return typeof row?.currentVersion === 'number' ? row.currentVersion : null
}

async function assertMigrationSetVersion(
    db: Database,
    expectedVersion: number
) {
    const currentVersion = await getCurrentSchemaVersion(db)

    if (currentVersion !== expectedVersion) {
        throw new Error(
            `Migration v${expectedVersion} did not set SCHEMA_VERSION.currentVersion to ${expectedVersion}. Current value is ${currentVersion}.`
        )
    }
}

async function runMigration(db: Database, migration: Migration) {
    await db.exec('BEGIN IMMEDIATE TRANSACTION;')

    try {
        await migration.up(db)
        await assertMigrationSetVersion(db, migration.schemaVersion)
        await db.exec('COMMIT;')
    } catch (error) {
        await db.exec('ROLLBACK;')
        throw error
    }
}

export async function runMigrations(db: Database) {
    const orderedMigrations = getOrderedMigrations()
    const currentVersion = await getCurrentSchemaVersion(db)
    const latestVersion = orderedMigrations.at(-1)?.schemaVersion ?? null

    if (
        currentVersion !== null &&
        latestVersion !== null &&
        currentVersion > latestVersion
    ) {
        throw new Error(
            `Database schema version ${currentVersion} is newer than the latest known migration ${latestVersion}.`
        )
    }

    for (const migration of orderedMigrations) {
        if (
            currentVersion === null ||
            migration.schemaVersion > currentVersion
        ) {
            await runMigration(db, migration)
        }
    }
}
