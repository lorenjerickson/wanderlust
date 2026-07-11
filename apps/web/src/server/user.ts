'use server'

import { randomUUID } from 'crypto'
import bcrypt from 'bcrypt'
import { count, eq, sql } from 'drizzle-orm'
import { Role, RoleName, User } from '@wanderlust/core'

import { auth0 } from '@/lib/auth0'
import { roles, userRoles, users } from '@/lib/db/schema'
import { getDrizzleDb } from '@/lib/drizzle'
import { findOrCreateAdminRole } from './role'
import { mapRole, mapUser, withoutPassword } from './mappers'

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
    const db = await getDrizzleDb()
    const rows = await db
        .select({
            id: roles.id,
            name: roles.name,
            description: roles.description,
        })
        .from(roles)
        .innerJoin(userRoles, eq(userRoles.roleId, roles.id))
        .where(eq(userRoles.userId, userId))

    return rows.map(mapRole)
}

async function getUserByColumn(
    column: 'id' | 'username' | 'emailAddress',
    value: string
) {
    const db = await getDrizzleDb()
    const targetColumn = {
        id: users.id,
        username: users.username,
        emailAddress: users.emailAddress,
    }[column]
    const row = await db.query.users.findFirst({
        where: eq(targetColumn, value),
    })

    if (!row) {
        return null
    }

    return mapUser(row, await getUserRoles(row.id))
}

async function getUserByExternalAuthSubject(externalAuthSubject: string) {
    const db = await getDrizzleDb()
    const row = await db.query.users.findFirst({
        where: eq(users.externalAuthSubject, externalAuthSubject),
    })

    if (!row) {
        return null
    }

    return mapUser(row, await getUserRoles(row.id))
}

async function replaceUserRoles(
    userId: string,
    roles: Array<Role | string> = []
) {
    const db = await getDrizzleDb()

    await db.delete(userRoles).where(eq(userRoles.userId, userId))

    for (const role of roles) {
        const roleId = typeof role === 'string' ? role : role._id

        if (roleId) {
            await db
                .insert(userRoles)
                .values({ userId, roleId })
                .onConflictDoNothing()
        }
    }
}

export async function createUser(user: CreateUserInput): Promise<StoredUser> {
    const db = await getDrizzleDb()
    const id = randomUUID()
    const hashedPassword = user.password
        ? await bcrypt.hash(user.password, 10)
        : null

    await db.insert(users).values({
        id,
        username: user.username!,
        password: hashedPassword,
        emailAddress: user.emailAddress!,
        fullName: user.fullName!,
        phoneNumber: user.phoneNumber!,
        zipCode: user.zipCode!,
        avatar: user.avatar ?? null,
        externalAuthSubject: user.externalAuthSubject ?? null,
        isGm: user.isGm ? 1 : 0,
    })

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
    const db = await getDrizzleDb()
    const existingUser =
        (await getUserByColumn('id', sessionId)) ??
        (await getUserByColumn('username', sessionId))

    if (!existingUser) {
        throw new Error('User not found')
    }

    const nextPassword = body.password
        ? await bcrypt.hash(body.password, 10)
        : (existingUser.password ?? null)

    await db
        .update(users)
        .set({
            username: body.username ?? existingUser.username,
            password: nextPassword,
            emailAddress: body.emailAddress ?? existingUser.emailAddress,
            fullName: body.fullName ?? existingUser.fullName,
            phoneNumber: body.phoneNumber ?? existingUser.phoneNumber,
            zipCode: body.zipCode ?? existingUser.zipCode,
            avatar: body.avatar ?? existingUser.avatar ?? null,
            updatedOn: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(users.id, existingUser._id))

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
    const db = await getDrizzleDb()
    const [row] = await db.select({ count: count() }).from(users)

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
    const db = await getDrizzleDb()
    const rows = await db.select().from(users)

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

    const db = await getDrizzleDb()
    const [row] = await db
        .select({ user: users })
        .from(users)
        .innerJoin(userRoles, eq(userRoles.userId, users.id))
        .where(eq(userRoles.roleId, role._id))
        .limit(1)

    if (!row) {
        return null
    }

    return withoutPassword(mapUser(row.user, await getUserRoles(row.user.id)))
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
    const db = await getDrizzleDb()
    const row = await db.query.users.findFirst({
        where: eq(users.isGm, 1),
    })

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
    const db = await getDrizzleDb()
    const id = randomUUID()

    const createdUser = await db.transaction(async (tx) => {
        const [row] = await tx.select({ count: count() }).from(users)

        if ((row?.count ?? 0) > 0) {
            throw new Error('A user record already exists')
        }

        let adminRole = await tx.query.roles.findFirst({
            where: eq(roles.name, RoleName.GlobalAdmin),
        })

        if (!adminRole) {
            const roleId = randomUUID()
            await tx.insert(roles).values({
                id: roleId,
                name: RoleName.GlobalAdmin,
                description: 'Global Administrator with full access',
            })
            adminRole = {
                id: roleId,
                name: RoleName.GlobalAdmin,
                description: 'Global Administrator with full access',
            }
        }

        if (!adminRole) {
            throw new Error('Unable to create the global administrator role')
        }

        await tx.insert(users).values({
            id,
            username: user.username,
            password: null,
            emailAddress: user.emailAddress,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            zipCode: user.zipCode,
            avatar: user.avatar,
            externalAuthSubject,
            isGm: 1,
        })

        await tx.insert(userRoles).values({ userId: id, roleId: adminRole.id })

        return {
            _id: id,
            ...user,
            avatar: user.avatar ?? undefined,
            externalAuthSubject,
            isGm: true,
            roles: [mapRole(adminRole)],
        } satisfies StoredUser
    })

    return createdUser
}
