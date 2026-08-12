'use server'

import { randomUUID } from 'crypto'
import { eq } from 'drizzle-orm'
import { Role, RoleName } from '@wanderlust/common'

import { roles } from '@/lib/db/schema'
import { getDrizzleDb } from '@/lib/drizzle'
import { mapRole } from './mappers'

const globalAdminRoleName = 'globalAdmin' as RoleName

export async function createRole(role: Role): Promise<Role> {
    const db = await getDrizzleDb()
    const id = role._id ?? randomUUID()

    await db.insert(roles).values({
        id,
        name: role.name,
        description: role.description ?? null,
    })

    return {
        ...role,
        _id: id,
    }
}

export async function findOneRoleByName(role: RoleName): Promise<Role | null> {
    const db = await getDrizzleDb()
    const row = await db.query.roles.findFirst({
        where: eq(roles.name, role),
    })

    return row ? mapRole(row) : null
}

export async function findAllRoles(): Promise<Role[]> {
    const db = await getDrizzleDb()
    const rows = await db.select().from(roles)

    return rows.map(mapRole)
}

export async function findOrCreateAdminRole(): Promise<Role> {
    const adminRole = await findOneRoleByName(globalAdminRoleName)

    if (adminRole) {
        return adminRole
    }

    return createRole({
        name: globalAdminRoleName,
        description: 'Global Administrator with full access',
    })
}
