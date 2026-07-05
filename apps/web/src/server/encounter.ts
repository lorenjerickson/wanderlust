'use server'

import { randomUUID } from 'crypto'

import { getDb } from '@/lib/db'

export type Encounter = {
    id: string
    scenarioId: string
    shortDescriptionRichText: string
    longDescriptionRichText: string
    location?: string
    mapImageUrl?: string
}

type EncounterRow = {
    id: string
    scenario_id: string
    short_description_rich_text: string
    long_description_rich_text: string
    location?: string | null
    map_image_url?: string | null
}

type CreateEncounterArgs = {
    scenarioId: string
    shortDescriptionRichText?: string
    longDescriptionRichText?: string
    location?: string
    mapImageUrl?: string
}

type UpdateEncounterArgs = Partial<CreateEncounterArgs> & {
    id: string
}

function mapEncounter(row: EncounterRow): Encounter {
    return {
        id: row.id,
        scenarioId: row.scenario_id,
        shortDescriptionRichText: row.short_description_rich_text,
        longDescriptionRichText: row.long_description_rich_text,
        location: row.location ?? undefined,
        mapImageUrl: row.map_image_url ?? undefined,
    }
}

export async function createEncounter({
    scenarioId,
    shortDescriptionRichText = '',
    longDescriptionRichText = '',
    location,
    mapImageUrl,
}: CreateEncounterArgs): Promise<Encounter> {
    const db = await getDb()
    const id = randomUUID()

    await db.run(
        `
            INSERT INTO encounters (
                id,
                scenario_id,
                short_description_rich_text,
                long_description_rich_text,
                location,
                map_image_url
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `,
        id,
        scenarioId,
        shortDescriptionRichText,
        longDescriptionRichText,
        location ?? null,
        mapImageUrl ?? null
    )

    return {
        id,
        scenarioId,
        shortDescriptionRichText,
        longDescriptionRichText,
        location,
        mapImageUrl,
    }
}

export async function findEncounterById(id: string): Promise<Encounter | null> {
    const db = await getDb()
    const row = await db.get<EncounterRow>(
        `
            SELECT
                id,
                scenario_id,
                short_description_rich_text,
                long_description_rich_text,
                location,
                map_image_url
            FROM encounters
            WHERE id = ?
        `,
        id
    )

    return row ? mapEncounter(row) : null
}

export async function findEncountersByScenario(scenarioId: string): Promise<Encounter[]> {
    const db = await getDb()
    const rows = await db.all<EncounterRow[]>(
        `
            SELECT
                id,
                scenario_id,
                short_description_rich_text,
                long_description_rich_text,
                location,
                map_image_url
            FROM encounters
            WHERE scenario_id = ?
            ORDER BY rowid ASC
        `,
        scenarioId
    )

    return rows.map(mapEncounter)
}

export async function updateEncounter({
    id,
    scenarioId,
    shortDescriptionRichText,
    longDescriptionRichText,
    location,
    mapImageUrl,
}: UpdateEncounterArgs): Promise<Encounter | null> {
    const current = await findEncounterById(id)

    if (!current) {
        return null
    }

    const nextEncounter = {
        scenarioId: scenarioId ?? current.scenarioId,
        shortDescriptionRichText:
            shortDescriptionRichText ?? current.shortDescriptionRichText,
        longDescriptionRichText:
            longDescriptionRichText ?? current.longDescriptionRichText,
        location: location ?? current.location,
        mapImageUrl: mapImageUrl ?? current.mapImageUrl,
    }

    const db = await getDb()
    await db.run(
        `
            UPDATE encounters
            SET scenario_id = ?,
                short_description_rich_text = ?,
                long_description_rich_text = ?,
                location = ?,
                map_image_url = ?
            WHERE id = ?
        `,
        nextEncounter.scenarioId,
        nextEncounter.shortDescriptionRichText,
        nextEncounter.longDescriptionRichText,
        nextEncounter.location ?? null,
        nextEncounter.mapImageUrl ?? null,
        id
    )

    return {
        id,
        ...nextEncounter,
    }
}

export async function deleteEncounter(id: string): Promise<Encounter | null> {
    const current = await findEncounterById(id)

    if (!current) {
        return null
    }

    const db = await getDb()
    await db.run('DELETE FROM encounters WHERE id = ?', id)

    return current
}
