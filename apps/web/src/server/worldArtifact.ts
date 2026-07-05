'use server'

import { randomUUID } from 'crypto'

import { getDb } from '@/lib/db'
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
    world_id?: string | null
    artifact_type: string
    title: string
    description_markdown: string
    map_image_url?: string | null
    created_at: string
    updated_at: string
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
        worldId: row.world_id ?? undefined,
        artifactType: normalizeArtifactType(row.artifact_type),
        title: row.title,
        descriptionMarkdown: row.description_markdown,
        mapImageUrl: row.map_image_url ?? undefined,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
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
    const db = await getDb()
    const trimmedQuery = query.trim()

    if (trimmedQuery) {
        const ftsQuery = buildFtsQuery(trimmedQuery)
        const rows = await db.all<WorldArtifactRow[]>(
            `
                SELECT
                    wa.id,
                    wa.world_id,
                    wa.artifact_type,
                    wa.title,
                    wa.description_markdown,
                    wa.map_image_url,
                    wa.created_at,
                    wa.updated_at
                FROM world_artifacts_fts fts
                JOIN world_artifacts wa ON wa.rowid = fts.rowid
                WHERE world_artifacts_fts MATCH ?
                    AND (? IS NULL OR wa.world_id = ?)
                ORDER BY
                    CASE
                        WHEN lower(wa.title) LIKE lower(?) THEN 0
                        ELSE 1
                    END,
                    bm25(world_artifacts_fts),
                    wa.title COLLATE NOCASE ASC
            `,
            ftsQuery,
            worldId ?? null,
            worldId ?? null,
            `%${trimmedQuery}%`
        )

        return rows.map(mapWorldArtifact)
    }

    const rows = await db.all<WorldArtifactRow[]>(
        `
            SELECT
                id,
                world_id,
                artifact_type,
                title,
                description_markdown,
                map_image_url,
                created_at,
                updated_at
            FROM world_artifacts
            WHERE (? IS NULL OR world_id = ?)
            ORDER BY artifact_type ASC, title COLLATE NOCASE ASC
        `,
        worldId ?? null,
        worldId ?? null
    )

    return rows.map(mapWorldArtifact)
}

export async function findWorldArtifactById(
    id: string
): Promise<WorldArtifact | null> {
    const db = await getDb()
    const row = await db.get<WorldArtifactRow>(
        `
            SELECT
                id,
                world_id,
                artifact_type,
                title,
                description_markdown,
                map_image_url,
                created_at,
                updated_at
            FROM world_artifacts
            WHERE id = ?
        `,
        id
    )

    return row ? mapWorldArtifact(row) : null
}

export async function createWorldArtifact({
    worldId,
    artifactType,
    title,
    descriptionMarkdown = '',
    mapImageUrl,
}: CreateWorldArtifactArgs): Promise<WorldArtifact> {
    const db = await getDb()
    const id = randomUUID()
    const now = new Date().toISOString()

    await db.run(
        `
            INSERT INTO world_artifacts (
                id,
                world_id,
                artifact_type,
                title,
                description_markdown,
                map_image_url,
                created_at,
                updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        id,
        worldId ?? null,
        artifactType,
        title,
        descriptionMarkdown,
        mapImageUrl ?? null,
        now,
        now
    )

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
    const db = await getDb()

    await db.run(
        `
            UPDATE world_artifacts
            SET world_id = ?,
                artifact_type = ?,
                title = ?,
                description_markdown = ?,
                map_image_url = ?,
                updated_at = ?
            WHERE id = ?
        `,
        nextArtifact.worldId ?? null,
        nextArtifact.artifactType,
        nextArtifact.title,
        nextArtifact.descriptionMarkdown,
        nextArtifact.mapImageUrl ?? null,
        updatedAt,
        id
    )

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

    const db = await getDb()
    await db.run('DELETE FROM world_artifacts WHERE id = ?', id)

    return current
}
