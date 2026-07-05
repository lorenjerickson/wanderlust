'use server'

import { randomUUID } from 'crypto'

import { getDb } from '@/lib/db'

export type Scenario = {
    id: string
    campaignId: string
    shortDescriptionRichText: string
    mapImageUrl?: string
    longDescriptionRichText: string
}

type ScenarioRow = {
    id: string
    campaign_id: string
    short_description_rich_text: string
    map_image_url?: string | null
    long_description_rich_text: string
}

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
        campaignId: row.campaign_id,
        shortDescriptionRichText: row.short_description_rich_text,
        mapImageUrl: row.map_image_url ?? undefined,
        longDescriptionRichText: row.long_description_rich_text,
    }
}

export async function createScenario({
    campaignId,
    shortDescriptionRichText = '',
    mapImageUrl,
    longDescriptionRichText = '',
}: CreateScenarioArgs): Promise<Scenario> {
    const db = await getDb()
    const id = randomUUID()

    await db.run(
        `
            INSERT INTO scenarios (
                id,
                campaign_id,
                short_description_rich_text,
                map_image_url,
                long_description_rich_text
            )
            VALUES (?, ?, ?, ?, ?)
        `,
        id,
        campaignId,
        shortDescriptionRichText,
        mapImageUrl ?? null,
        longDescriptionRichText
    )

    return {
        id,
        campaignId,
        shortDescriptionRichText,
        mapImageUrl,
        longDescriptionRichText,
    }
}

export async function findScenarioById(id: string): Promise<Scenario | null> {
    const db = await getDb()
    const row = await db.get<ScenarioRow>(
        `
            SELECT
                id,
                campaign_id,
                short_description_rich_text,
                map_image_url,
                long_description_rich_text
            FROM scenarios
            WHERE id = ?
        `,
        id
    )

    return row ? mapScenario(row) : null
}

export async function findScenariosByCampaign(campaignId: string): Promise<Scenario[]> {
    const db = await getDb()
    const rows = await db.all<ScenarioRow[]>(
        `
            SELECT
                id,
                campaign_id,
                short_description_rich_text,
                map_image_url,
                long_description_rich_text
            FROM scenarios
            WHERE campaign_id = ?
            ORDER BY rowid ASC
        `,
        campaignId
    )

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

    const db = await getDb()
    await db.run(
        `
            UPDATE scenarios
            SET campaign_id = ?,
                short_description_rich_text = ?,
                map_image_url = ?,
                long_description_rich_text = ?
            WHERE id = ?
        `,
        nextScenario.campaignId,
        nextScenario.shortDescriptionRichText,
        nextScenario.mapImageUrl ?? null,
        nextScenario.longDescriptionRichText,
        id
    )

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

    const db = await getDb()
    await db.run('DELETE FROM scenarios WHERE id = ?', id)

    return current
}
