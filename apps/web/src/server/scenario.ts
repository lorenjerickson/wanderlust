'use server'

import { randomUUID } from 'crypto'
import { eq, sql } from 'drizzle-orm'

import { scenarios } from '@/lib/db/schema'
import { getDrizzleDb } from '@/lib/drizzle'

export type Scenario = {
    id: string
    campaignId: string
    shortDescriptionRichText: string
    mapImageUrl?: string
    longDescriptionRichText: string
}

type ScenarioRow = typeof scenarios.$inferSelect

type CreateScenarioArgs = {
    campaignId: string
    shortDescriptionRichText?: string
    mapImageUrl?: string
    longDescriptionRichText?: string
}

type UpdateScenarioArgs = Partial<CreateScenarioArgs> & {
    id: string
}

function mapScenario(row: ScenarioRow): Scenario {
    return {
        id: row.id,
        campaignId: row.campaignId,
        shortDescriptionRichText: row.shortDescriptionRichText,
        mapImageUrl: row.mapImageUrl ?? undefined,
        longDescriptionRichText: row.longDescriptionRichText,
    }
}

export async function createScenario({
    campaignId,
    shortDescriptionRichText = '',
    mapImageUrl,
    longDescriptionRichText = '',
}: CreateScenarioArgs): Promise<Scenario> {
    const db = await getDrizzleDb()
    const id = randomUUID()

    await db.insert(scenarios).values({
        id,
        campaignId,
        shortDescriptionRichText,
        mapImageUrl: mapImageUrl ?? null,
        longDescriptionRichText,
    })

    return {
        id,
        campaignId,
        shortDescriptionRichText,
        mapImageUrl,
        longDescriptionRichText,
    }
}

export async function findScenarioById(id: string): Promise<Scenario | null> {
    const db = await getDrizzleDb()
    const row = await db.query.scenarios.findFirst({
        where: eq(scenarios.id, id),
    })

    return row ? mapScenario(row) : null
}

export async function findScenariosByCampaign(
    campaignId: string
): Promise<Scenario[]> {
    const db = await getDrizzleDb()
    const rows = await db
        .select()
        .from(scenarios)
        .where(eq(scenarios.campaignId, campaignId))
        .orderBy(sql`rowid ASC`)

    return rows.map(mapScenario)
}

export async function updateScenario({
    id,
    campaignId,
    shortDescriptionRichText,
    mapImageUrl,
    longDescriptionRichText,
}: UpdateScenarioArgs): Promise<Scenario | null> {
    const current = await findScenarioById(id)

    if (!current) {
        return null
    }

    const nextScenario = {
        campaignId: campaignId ?? current.campaignId,
        shortDescriptionRichText:
            shortDescriptionRichText ?? current.shortDescriptionRichText,
        mapImageUrl: mapImageUrl ?? current.mapImageUrl,
        longDescriptionRichText:
            longDescriptionRichText ?? current.longDescriptionRichText,
    }

    const db = await getDrizzleDb()
    await db
        .update(scenarios)
        .set({
            campaignId: nextScenario.campaignId,
            shortDescriptionRichText: nextScenario.shortDescriptionRichText,
            mapImageUrl: nextScenario.mapImageUrl ?? null,
            longDescriptionRichText: nextScenario.longDescriptionRichText,
        })
        .where(eq(scenarios.id, id))

    return {
        id,
        ...nextScenario,
    }
}

export async function deleteScenario(id: string): Promise<Scenario | null> {
    const current = await findScenarioById(id)

    if (!current) {
        return null
    }

    const db = await getDrizzleDb()
    await db.delete(scenarios).where(eq(scenarios.id, id))

    return current
}
