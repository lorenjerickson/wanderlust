'use server'

import { randomUUID } from 'crypto'
import { asc, eq, sql } from 'drizzle-orm'

import { worldArtifacts } from '@/lib/db/schema'
import { getDrizzleDb } from '@/lib/drizzle'
import {
    WORLD_ARTIFACT_TYPES,
    type WorldArtifactType,
} from '@/core/types/worldArtifact'

export type WorldArtifact = {
    id: string
    worldId?: string
    artifactType: WorldArtifactType
    title: string
    descriptionMarkdown: string
    mapImageUrl?: string
    createdAt: string
    updatedAt: string
}

type WorldArtifactRow = {
    id: string
    worldId?: string | null
    artifactType: string
    title: string
    descriptionMarkdown: string
    mapImageUrl?: string | null
    createdAt: string
    updatedAt: string
}

type CreateWorldArtifactArgs = {
    worldId?: string
    artifactType: WorldArtifactType
    title: string
    descriptionMarkdown?: string
    mapImageUrl?: string
}

type UpdateWorldArtifactArgs = Partial<CreateWorldArtifactArgs> & {
    id: string
}

type FindWorldArtifactsArgs = {
    worldId?: string
    query?: string
}

function mapWorldArtifact(row: WorldArtifactRow): WorldArtifact {
    return {
        id: row.id,
        worldId: row.worldId ?? undefined,
        artifactType: normalizeArtifactType(row.artifactType),
        title: row.title,
        descriptionMarkdown: row.descriptionMarkdown,
        mapImageUrl: row.mapImageUrl ?? undefined,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
    }
}

function normalizeArtifactType(value: string): WorldArtifactType {
    const match = WORLD_ARTIFACT_TYPES.find((type) => type === value)
    return match ?? 'Item'
}

function buildFtsQuery(query: string) {
    return query
        .trim()
        .split(/\s+/)
        .map((term) => `"${term.replaceAll('"', '""')}"*`)
        .join(' AND ')
}

export async function findWorldArtifacts({
    worldId,
    query = '',
}: FindWorldArtifactsArgs = {}): Promise<WorldArtifact[]> {
    const db = await getDrizzleDb()
    const trimmedQuery = query.trim()

    if (trimmedQuery) {
        const ftsQuery = buildFtsQuery(trimmedQuery)
        const rows = await db.all<WorldArtifactRow>(sql`
                SELECT
                    wa.id,
                    wa.world_id AS worldId,
                    wa.artifact_type AS artifactType,
                    wa.title,
                    wa.description_markdown AS descriptionMarkdown,
                    wa.map_image_url AS mapImageUrl,
                    wa.created_at AS createdAt,
                    wa.updated_at AS updatedAt
                FROM world_artifacts_fts fts
                JOIN world_artifacts wa ON wa.rowid = fts.rowid
                WHERE world_artifacts_fts MATCH ${ftsQuery}
                    AND (${worldId ?? null} IS NULL OR wa.world_id = ${worldId ?? null})
                ORDER BY
                    CASE
                        WHEN lower(wa.title) LIKE lower(${`%${trimmedQuery}%`}) THEN 0
                        ELSE 1
                    END,
                    bm25(world_artifacts_fts),
                    wa.title COLLATE NOCASE ASC
            `)

        return rows.map(mapWorldArtifact)
    }

    const rows = await db
        .select()
        .from(worldArtifacts)
        .where(worldId ? eq(worldArtifacts.worldId, worldId) : undefined)
        .orderBy(
            asc(worldArtifacts.artifactType),
            sql`${worldArtifacts.title} COLLATE NOCASE ASC`
        )

    return rows.map(mapWorldArtifact)
}

export async function findWorldArtifactById(
    id: string
): Promise<WorldArtifact | null> {
    const db = await getDrizzleDb()
    const row = await db.query.worldArtifacts.findFirst({
        where: eq(worldArtifacts.id, id),
    })

    return row ? mapWorldArtifact(row) : null
}

export async function createWorldArtifact({
    worldId,
    artifactType,
    title,
    descriptionMarkdown = '',
    mapImageUrl,
}: CreateWorldArtifactArgs): Promise<WorldArtifact> {
    const db = await getDrizzleDb()
    const id = randomUUID()
    const now = new Date().toISOString()

    await db.insert(worldArtifacts).values({
        id,
        worldId: worldId ?? null,
        artifactType,
        title,
        descriptionMarkdown,
        mapImageUrl: mapImageUrl ?? null,
        createdAt: now,
        updatedAt: now,
    })

    return {
        id,
        worldId,
        artifactType,
        title,
        descriptionMarkdown,
        mapImageUrl,
        createdAt: now,
        updatedAt: now,
    }
}

export async function updateWorldArtifact({
    id,
    worldId,
    artifactType,
    title,
    descriptionMarkdown,
    mapImageUrl,
}: UpdateWorldArtifactArgs): Promise<WorldArtifact | null> {
    const current = await findWorldArtifactById(id)

    if (!current) {
        return null
    }

    const nextArtifact = {
        worldId: worldId ?? current.worldId,
        artifactType: artifactType ?? current.artifactType,
        title: title ?? current.title,
        descriptionMarkdown: descriptionMarkdown ?? current.descriptionMarkdown,
        mapImageUrl: mapImageUrl ?? current.mapImageUrl,
    }
    const updatedAt = new Date().toISOString()
    const db = await getDrizzleDb()

    await db
        .update(worldArtifacts)
        .set({
            worldId: nextArtifact.worldId ?? null,
            artifactType: nextArtifact.artifactType,
            title: nextArtifact.title,
            descriptionMarkdown: nextArtifact.descriptionMarkdown,
            mapImageUrl: nextArtifact.mapImageUrl ?? null,
            updatedAt,
        })
        .where(eq(worldArtifacts.id, id))

    return {
        id,
        ...nextArtifact,
        createdAt: current.createdAt,
        updatedAt,
    }
}

export async function deleteWorldArtifact(
    id: string
): Promise<WorldArtifact | null> {
    const current = await findWorldArtifactById(id)

    if (!current) {
        return null
    }

    const db = await getDrizzleDb()
    await db.delete(worldArtifacts).where(eq(worldArtifacts.id, id))

    return current
}
