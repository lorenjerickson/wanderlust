'use server'

import { randomUUID } from 'crypto'
import { eq, sql } from 'drizzle-orm'
import { Media, Tag, User } from '@wanderlust/core'

import { media as mediaTable } from '@web/lib/db/schema'
import { getDrizzleDb } from '@web/lib/drizzle'
import { MediaRow } from './mappers'

type UploadFileLike = {
    filename: string
    path: string
    mimetype?: string
}

type MediaUserLike = Pick<User, 'username'> & {
    id?: string
    _id?: string
}

type CreateMediaArgs = {
    file: UploadFileLike
    user: MediaUserLike
}

type UpdateMediaArgs = {
    id: string
    file?: UploadFileLike
    user: MediaUserLike
}

function getUserId(user: MediaUserLike) {
    return user.id ?? user._id ?? user.username
}

function mapMedia(row: MediaRow): Media & { _id: string } {
    return {
        _id: row.id,
        title: row.title,
        description: row.description,
        type: row.type,
        tags: JSON.parse(row.tags) as Tag[],
        url: row.url,
        createdOn: new Date(row.createdOn),
        createdBy: { username: row.createdBy ?? '' } as User,
        updatedOn: new Date(row.updatedOn),
        updatedBy: { username: row.updatedBy ?? '' } as User,
    }
}

export async function getAllMedia(): Promise<Array<Media & { _id: string }>> {
    const db = await getDrizzleDb()
    const rows = await db.select().from(mediaTable)

    return rows.map(mapMedia)
}

export async function getOneMedia(
    id: string
): Promise<Array<Media & { _id: string }>> {
    const db = await getDrizzleDb()
    const rows = await db.select().from(mediaTable).where(eq(mediaTable.id, id))

    return rows.map(mapMedia)
}

export async function createMedia({ file, user }: CreateMediaArgs) {
    const db = await getDrizzleDb()
    const id = randomUUID()
    const userId = getUserId(user)

    await db.insert(mediaTable).values({
        id,
        title: file.filename,
        description: '',
        type: file.mimetype ?? 'file',
        tags: '[]',
        url: file.path,
        createdBy: userId,
        updatedBy: userId,
    })

    const media = await getOneMedia(id)

    return media[0]
}

export async function updateMedia({ id, file, user }: UpdateMediaArgs) {
    const db = await getDrizzleDb()
    const current = (await getOneMedia(id))[0]

    if (!current) {
        return null
    }

    await db
        .update(mediaTable)
        .set({
            title: file?.filename ?? current.title,
            type: file?.mimetype ?? current.type,
            url: file?.path ?? current.url,
            updatedBy: getUserId(user),
            updatedOn: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(mediaTable.id, id))

    return (await getOneMedia(id))[0] ?? null
}

export async function deleteMedia({
    id,
}: {
    id: string
    user?: MediaUserLike
}) {
    const db = await getDrizzleDb()
    const current = (await getOneMedia(id))[0] ?? null

    await db.delete(mediaTable).where(eq(mediaTable.id, id))

    return current
}
