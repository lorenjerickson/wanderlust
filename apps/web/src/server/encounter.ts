'use server'

import { randomUUID } from 'crypto'
import { eq, sql } from 'drizzle-orm'

import { encounters } from '@/lib/db/schema'
import { getDrizzleDb } from '@/lib/drizzle'
import { synchronizeKnowledgeGraph } from '@/lib/knowledgeGraph'

export type Encounter = {
    id: string
    scenarioId: string
    shortDescriptionRichText: string
    longDescriptionRichText: string
    location?: string
    mapImageUrl?: string
}

type EncounterRow = typeof encounters.$inferSelect

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
        scenarioId: row.scenarioId,
        shortDescriptionRichText: row.shortDescriptionRichText,
        longDescriptionRichText: row.longDescriptionRichText,
        location: row.location ?? undefined,
        mapImageUrl: row.mapImageUrl ?? undefined,
    }
}

export async function createEncounter({
    scenarioId,
    shortDescriptionRichText = '',
    longDescriptionRichText = '',
    location,
    mapImageUrl,
}: CreateEncounterArgs): Promise<Encounter> {
    const db = await getDrizzleDb()
    const id = randomUUID()

    await db.insert(encounters).values({
        id,
        scenarioId,
        shortDescriptionRichText,
        longDescriptionRichText,
        location: location ?? null,
        mapImageUrl: mapImageUrl ?? null,
    })
    await synchronizeKnowledgeGraph()

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
    const db = await getDrizzleDb()
    const row = await db.query.encounters.findFirst({
        where: eq(encounters.id, id),
    })

    return row ? mapEncounter(row) : null
}

export async function findEncountersByScenario(
    scenarioId: string
): Promise<Encounter[]> {
    const db = await getDrizzleDb()
    const rows = await db
        .select()
        .from(encounters)
        .where(eq(encounters.scenarioId, scenarioId))
        .orderBy(sql`rowid ASC`)

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

    const db = await getDrizzleDb()
    await db
        .update(encounters)
        .set({
            scenarioId: nextEncounter.scenarioId,
            shortDescriptionRichText: nextEncounter.shortDescriptionRichText,
            longDescriptionRichText: nextEncounter.longDescriptionRichText,
            location: nextEncounter.location ?? null,
            mapImageUrl: nextEncounter.mapImageUrl ?? null,
        })
        .where(eq(encounters.id, id))
    await synchronizeKnowledgeGraph()

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

    const db = await getDrizzleDb()
    await db.delete(encounters).where(eq(encounters.id, id))
    await synchronizeKnowledgeGraph()

    return current
}
