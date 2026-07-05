'use server'

import { randomUUID } from 'crypto'
import bcrypt from 'bcrypt'
import { Role, User } from '@wanderlust/core'

import { auth0 } from '@/lib/auth0'
import { getDb } from '@/lib/db'
import { findOrCreateAdminRole } from './role'
import { mapRole, mapUser, UserRow, withoutPassword } from './sqlite'

type StoredUser = User & {
    _id: string
    externalAuthSubject?: string
    isGm: boolean
}

type CreateUserInput = Partial<User> & {
    externalAuthSubject?: string
    isGm?: boolean
}

type FirstGameMasterInput = Partial<
    Pick<
        User,
        | 'username'
        | 'fullName'
        | 'phoneNumber'
        | 'zipCode'
        | 'emailAddress'
        | 'avatar'
    >
>

function requireProfileValue(
    body: FirstGameMasterInput,
    key: keyof Omit<FirstGameMasterInput, 'avatar'>,
    label: string
) {
    const value = body[key]?.trim()

    if (!value) {
        throw new Error(`${label} is required`)
    }

    return value
}

async function getUserRoles(userId: string): Promise<Role[]> {
    const db = await getDb()
    const rows = await db.all(
        `
            SELECT roles.id, roles.name, roles.description
            FROM roles
            INNER JOIN user_roles ON user_roles.role_id = roles.id
            WHERE user_roles.user_id = ?
        `,
        userId
    )

    return rows.map(mapRole)
}

async function getUserByColumn(
    column: 'id' | 'username' | 'emailAddress',
    value: string
) {
    const db = await getDb()
    const row = await db.get<UserRow>(
        `SELECT * FROM users WHERE ${column} = ?`,
        value
    )

    if (!row) {
        return null
    }

    return mapUser(row, await getUserRoles(row.id))
}

async function getUserByExternalAuthSubject(externalAuthSubject: string) {
    const db = await getDb()
    const row = await db.get<UserRow>(
        'SELECT * FROM users WHERE external_auth_subject = ?',
        externalAuthSubject
    )

    if (!row) {
        return null
    }

    return mapUser(row, await getUserRoles(row.id))
}

async function replaceUserRoles(
    userId: string,
    roles: Array<Role | string> = []
) {
    const db = await getDb()

    await db.run('DELETE FROM user_roles WHERE user_id = ?', userId)

    for (const role of roles) {
        const roleId = typeof role === 'string' ? role : role._id

        if (roleId) {
            await db.run(
                'INSERT OR IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)',
                userId,
                roleId
            )
        }
    }
}

export async function createUser(user: CreateUserInput): Promise<StoredUser> {
    const db = await getDb()
    const id = randomUUID()
    const hashedPassword = user.password
        ? await bcrypt.hash(user.password, 10)
        : null

    await db.run(
        `
            INSERT INTO users (
                id,
                username,
                password,
                emailAddress,
                fullName,
                phoneNumber,
                zipCode,
                avatar,
                external_auth_subject,
                is_gm
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        id,
        user.username,
        hashedPassword,
        user.emailAddress,
        user.fullName,
        user.phoneNumber,
        user.zipCode,
        user.avatar ?? null,
        user.externalAuthSubject ?? null,
        user.isGm ? 1 : 0
    )

    await replaceUserRoles(id, user.roles ?? [])

    const createdUser = await getUserByColumn('id', id)

    if (!createdUser) {
        throw new Error('Unable to create user')
    }

    return createdUser
}

export async function updateUser(
    sessionId: string,
    body: User
): Promise<StoredUser> {
    const db = await getDb()
    const existingUser =
        (await getUserByColumn('id', sessionId)) ??
        (await getUserByColumn('username', sessionId))

    if (!existingUser) {
        throw new Error('User not found')
    }

    const nextPassword = body.password
        ? await bcrypt.hash(body.password, 10)
        : (existingUser.password ?? null)

    await db.run(
        `
            UPDATE users
            SET username = ?,
                password = ?,
                emailAddress = ?,
                fullName = ?,
                phoneNumber = ?,
                zipCode = ?,
                avatar = ?,
                updatedOn = CURRENT_TIMESTAMP
            WHERE id = ?
        `,
        body.username ?? existingUser.username,
        nextPassword,
        body.emailAddress ?? existingUser.emailAddress,
        body.fullName ?? existingUser.fullName,
        body.phoneNumber ?? existingUser.phoneNumber,
        body.zipCode ?? existingUser.zipCode,
        body.avatar ?? existingUser.avatar ?? null,
        existingUser._id
    )

    if (body.roles) {
        await replaceUserRoles(existingUser._id, body.roles)
    }

    const updatedUser = await getUserByColumn('id', existingUser._id)

    if (!updatedUser) {
        throw new Error('User not found')
    }

    return updatedUser
}

export async function countUsers(): Promise<number> {
    const db = await getDb()
    const row = await db.get<{ count: number }>(
        'SELECT COUNT(*) AS count FROM users'
    )

    return row?.count ?? 0
}

export async function hasUserRecords(): Promise<boolean> {
    return (await countUsers()) > 0
}

export async function findOneUserByUsername(
    username: string
): Promise<StoredUser | null> {
    return getUserByColumn('username', username)
}

export async function findAllUsers(): Promise<StoredUser[]> {
    const db = await getDb()
    const rows = await db.all<UserRow[]>('SELECT * FROM users')

    return Promise.all(
        rows.map(async (row) => mapUser(row, await getUserRoles(row.id)))
    )
}

export async function findOneUserByExternalAuthSubject(
    externalAuthSubject: string
): Promise<StoredUser | null> {
    return getUserByExternalAuthSubject(externalAuthSubject)
}

export async function findOneUserByRole(
    role: Role
): Promise<StoredUser | null> {
    if (!role._id) {
        return null
    }

    const db = await getDb()
    const row = await db.get<UserRow>(
        `
            SELECT users.*
            FROM users
            INNER JOIN user_roles ON user_roles.user_id = users.id
            WHERE user_roles.role_id = ?
            LIMIT 1
        `,
        role._id
    )

    if (!row) {
        return null
    }

    return withoutPassword(mapUser(row, await getUserRoles(row.id)))
}

export async function createGlobalAdmin(
    body: Partial<User>
): Promise<StoredUser> {
    const globalAdmin = await getGlobalAdmin()

    if (globalAdmin) {
        throw new Error('Global admin already exists')
    }

    const adminRole = await findOrCreateAdminRole()

    return createUser({
        ...body,
        isGm: true,
        roles: [adminRole],
    })
}

export async function getGlobalAdmin(): Promise<StoredUser | null> {
    const gameMaster = await getGameMaster()

    if (gameMaster) {
        return withoutPassword(gameMaster)
    }

    const adminRole = await findOrCreateAdminRole()
    const admin = await findOneUserByRole(adminRole)

    return admin ? withoutPassword(admin) : null
}

export async function getGameMaster(): Promise<StoredUser | null> {
    const db = await getDb()
    const row = await db.get<UserRow>(
        `
            SELECT *
            FROM users
            WHERE is_gm = 1
            LIMIT 1
        `
    )

    if (!row) {
        return null
    }

    return withoutPassword(mapUser(row, await getUserRoles(row.id)))
}

export async function createFirstGameMaster(
    body: FirstGameMasterInput
): Promise<StoredUser> {
    const session = await auth0.getSession()
    const externalAuthSubject = session?.user?.sub

    if (!externalAuthSubject) {
        throw new Error('You must be logged in to create the first GM')
    }

    const user = {
        username: requireProfileValue(body, 'username', 'Username'),
        fullName: requireProfileValue(body, 'fullName', 'Full name'),
        phoneNumber: requireProfileValue(body, 'phoneNumber', 'Phone number'),
        zipCode: requireProfileValue(body, 'zipCode', 'Zip code'),
        emailAddress: requireProfileValue(
            body,
            'emailAddress',
            'Email address'
        ),
        avatar: body.avatar ?? null,
    }
    const db = await getDb()
    const id = randomUUID()

    await db.exec('BEGIN IMMEDIATE TRANSACTION;')

    try {
        const row = await db.get<{ count: number }>(
            'SELECT COUNT(*) AS count FROM users'
        )

        if ((row?.count ?? 0) > 0) {
            throw new Error('A user record already exists')
        }

        const adminRole = await findOrCreateAdminRole()

        await db.run(
            `
                INSERT INTO users (
                    id,
                    username,
                    password,
                    emailAddress,
                    fullName,
                    phoneNumber,
                    zipCode,
                    avatar,
                    external_auth_subject,
                    is_gm
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            id,
            user.username,
            null,
            user.emailAddress,
            user.fullName,
            user.phoneNumber,
            user.zipCode,
            user.avatar,
            externalAuthSubject,
            1
        )

        await db.run(
            'INSERT OR IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)',
            id,
            adminRole._id
        )

        await db.exec('COMMIT;')

        const createdUser: StoredUser = {
            _id: id,
            ...user,
            avatar: user.avatar ?? undefined,
            externalAuthSubject,
            isGm: true,
            roles: [adminRole],
        }

        return withoutPassword(createdUser)
    } catch (error) {
        await db.exec('ROLLBACK;')
        throw error
    }
}
