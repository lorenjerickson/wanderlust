'use server'

import { randomUUID } from 'crypto'
import { asc, eq } from 'drizzle-orm'

import { worlds } from '@/lib/db/schema'
import { getDrizzleDb } from '@/lib/drizzle'
import { synchronizeKnowledgeGraph } from '@/lib/knowledgeGraph'
import type { WorldRecord } from '@wanderlust/common'

type WorldRow = typeof worlds.$inferSelect

type CreateWorldArgs = {
    ownerUserId?: string
    name: string
    description?: string
    mapImageUrl?: string
}

type UpdateWorldArgs = Partial<CreateWorldArgs> & {
    id: string
}

function mapWorld(row: WorldRow): WorldRecord {
    return {
        id: row.id,
        ownerUserId: row.ownerUserId ?? undefined,
        name: row.name,
        description: row.description,
        mapImageUrl: row.mapImageUrl ?? undefined,
    }
}

export async function createWorld({
    ownerUserId,
    name,
    description = '',
    mapImageUrl,
}: CreateWorldArgs): Promise<WorldRecord> {
    const db = await getDrizzleDb()
    const id = randomUUID()

    await db.insert(worlds).values({
        id,
        ownerUserId: ownerUserId ?? null,
        name,
        description,
        mapImageUrl: mapImageUrl ?? null,
    })
    await synchronizeKnowledgeGraph()

    return {
        id,
        ownerUserId,
        name,
        description,
        mapImageUrl,
    }
}

export async function findWorldById(id: string): Promise<WorldRecord | null> {
    const db = await getDrizzleDb()
    const row = await db.query.worlds.findFirst({
        where: eq(worlds.id, id),
    })

    return row ? mapWorld(row) : null
}

export async function findAllWorlds(): Promise<WorldRecord[]> {
    const db = await getDrizzleDb()
    const rows = await db.select().from(worlds).orderBy(asc(worlds.name))

    return rows.map(mapWorld)
}

export async function updateWorld({
    id,
    name,
    description,
    mapImageUrl,
}: UpdateWorldArgs): Promise<WorldRecord | null> {
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
    await synchronizeKnowledgeGraph()

    return {
        id,
        ownerUserId: current.ownerUserId,
        ...nextWorld,
    }
}

export async function deleteWorld(id: string): Promise<WorldRecord | null> {
    const current = await findWorldById(id)

    if (!current) {
        return null
    }

    const db = await getDrizzleDb()
    await db.delete(worlds).where(eq(worlds.id, id))
    await synchronizeKnowledgeGraph()

    return current
}
