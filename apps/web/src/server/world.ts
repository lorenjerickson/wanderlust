'use server'

import { randomUUID } from 'crypto'
import { asc, eq } from 'drizzle-orm'

import { worlds } from '@/lib/db/schema'
import { getDrizzleDb } from '@/lib/drizzle'

export type World = {
    id: string
    name: string
    description: string
    mapImageUrl?: string
}

type WorldRow = typeof worlds.$inferSelect

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
        mapImageUrl: row.mapImageUrl ?? undefined,
    }
}

export async function createWorld({
    name,
    description = '',
    mapImageUrl,
}: CreateWorldArgs): Promise<World> {
    const db = await getDrizzleDb()
    const id = randomUUID()

    await db.insert(worlds).values({
        id,
        name,
        description,
        mapImageUrl: mapImageUrl ?? null,
    })

    return {
        id,
        name,
        description,
        mapImageUrl,
    }
}

export async function findWorldById(id: string): Promise<World | null> {
    const db = await getDrizzleDb()
    const row = await db.query.worlds.findFirst({
        where: eq(worlds.id, id),
    })

    return row ? mapWorld(row) : null
}

export async function findAllWorlds(): Promise<World[]> {
    const db = await getDrizzleDb()
    const rows = await db.select().from(worlds).orderBy(asc(worlds.name))

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

    const db = await getDrizzleDb()
    await db
        .update(worlds)
        .set({
            name: nextWorld.name,
            description: nextWorld.description,
            mapImageUrl: nextWorld.mapImageUrl ?? null,
        })
        .where(eq(worlds.id, id))

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

    const db = await getDrizzleDb()
    await db.delete(worlds).where(eq(worlds.id, id))

    return current
}
