'use server'

import { randomUUID } from 'crypto'

import { getDb } from '@/lib/db'

export type World = {
    id: string
    name: string
    description: string
    mapImageUrl?: string
}

type WorldRow = {
    id: string
    name: string
    description: string
    map_image_url?: string | null
}

type CreateWorldArgs = {
    name: string
    description?: string
    mapImageUrl?: string
}

type UpdateWorldArgs = Partial<CreateWorldArgs> & {
    id: string
}

function mapWorld(row: WorldRow): World {
    return {
        id: row.id,
        name: row.name,
        description: row.description,
        mapImageUrl: row.map_image_url ?? undefined,
    }
}

export async function createWorld({
    name,
    description = '',
    mapImageUrl,
}: CreateWorldArgs): Promise<World> {
    const db = await getDb()
    const id = randomUUID()

    await db.run(
        `
            INSERT INTO worlds (id, name, description, map_image_url)
            VALUES (?, ?, ?, ?)
        `,
        id,
        name,
        description,
        mapImageUrl ?? null
    )

    return {
        id,
        name,
        description,
        mapImageUrl,
    }
}

export async function findWorldById(id: string): Promise<World | null> {
    const db = await getDb()
    const row = await db.get<WorldRow>(
        'SELECT id, name, description, map_image_url FROM worlds WHERE id = ?',
        id
    )

    return row ? mapWorld(row) : null
}

export async function findAllWorlds(): Promise<World[]> {
    const db = await getDb()
    const rows = await db.all<WorldRow[]>(
        'SELECT id, name, description, map_image_url FROM worlds ORDER BY name ASC'
    )

    return rows.map(mapWorld)
}

export async function updateWorld({
    id,
    name,
    description,
    mapImageUrl,
}: UpdateWorldArgs): Promise<World | null> {
    const current = await findWorldById(id)

    if (!current) {
        return null
    }

    const nextWorld = {
        name: name ?? current.name,
        description: description ?? current.description,
        mapImageUrl: mapImageUrl ?? current.mapImageUrl,
    }

    const db = await getDb()
    await db.run(
        `
            UPDATE worlds
            SET name = ?,
                description = ?,
                map_image_url = ?
            WHERE id = ?
        `,
        nextWorld.name,
        nextWorld.description,
        nextWorld.mapImageUrl ?? null,
        id
    )

    return {
        id,
        ...nextWorld,
    }
}

export async function deleteWorld(id: string): Promise<World | null> {
    const current = await findWorldById(id)

    if (!current) {
        return null
    }

    const db = await getDb()
    await db.run('DELETE FROM worlds WHERE id = ?', id)

    return current
}
