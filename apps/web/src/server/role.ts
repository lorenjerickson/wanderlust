'use server'

import { randomUUID } from 'crypto'
import { Role, RoleName } from '@wanderlust/core'

import { getDb } from '@/lib/db'
import { mapRole } from './sqlite'

const globalAdminRoleName = 'globalAdmin' as RoleName

export async function createRole(role: Role): Promise<Role> {
    const db = await getDb()
    const id = role._id ?? randomUUID()

    await db.run(
        `
            INSERT INTO roles (id, name, description)
            VALUES (?, ?, ?)
        `,
        id,
        role.name,
        role.description ?? null
    )

    return {
        ...role,
        _id: id,
    }
}

export async function findOneRoleByName(role: RoleName): Promise<Role | null> {
    const db = await getDb()
    const row = await db.get(
        'SELECT id, name, description FROM roles WHERE name = ?',
        role
    )

    return row ? mapRole(row) : null
}

export async function findAllRoles(): Promise<Role[]> {
    const db = await getDb()
    const rows = await db.all('SELECT id, name, description FROM roles')

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
