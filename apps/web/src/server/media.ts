'use server'

import { randomUUID } from 'crypto'
import { Media, Tag, User } from '@wanderlust/core'

import { getDb } from '@web/lib/db'
import { MediaRow } from './sqlite'

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
    const db = await getDb()
    const rows = await db.all<MediaRow[]>('SELECT * FROM media')

    return rows.map(mapMedia)
}

export async function getOneMedia(id: string): Promise<Array<Media & { _id: string }>> {
    const db = await getDb()
    const rows = await db.all<MediaRow[]>('SELECT * FROM media WHERE id = ?', id)

    return rows.map(mapMedia)
}

export async function createMedia({ file, user }: CreateMediaArgs) {
    const db = await getDb()
    const id = randomUUID()
    const userId = getUserId(user)

    await db.run(
        `
            INSERT INTO media (
                id,
                title,
                description,
                type,
                tags,
                url,
                createdBy,
                updatedBy
            )
            VALUES (?, ?, '', ?, '[]', ?, ?, ?)
        `,
        id,
        file.filename,
        file.mimetype ?? 'file',
        file.path,
        userId,
        userId
    )

    const media = await getOneMedia(id)

    return media[0]
}

export async function updateMedia({ id, file, user }: UpdateMediaArgs) {
    const db = await getDb()
    const current = (await getOneMedia(id))[0]

    if (!current) {
        return null
    }

    await db.run(
        `
            UPDATE media
            SET title = ?,
                type = ?,
                url = ?,
                updatedBy = ?,
                updatedOn = CURRENT_TIMESTAMP
            WHERE id = ?
        `,
        file?.filename ?? current.title,
        file?.mimetype ?? current.type,
        file?.path ?? current.url,
        getUserId(user),
        id
    )

    return (await getOneMedia(id))[0] ?? null
}

export async function deleteMedia({ id }: { id: string; user?: MediaUserLike }) {
    const db = await getDb()
    const current = (await getOneMedia(id))[0] ?? null

    await db.run('DELETE FROM media WHERE id = ?', id)

    return current
}
