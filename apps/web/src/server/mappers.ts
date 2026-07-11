import { Role, User } from '@wanderlust/core'

type RoleRow = {
    id: string
    name: Role['name']
    description?: string | null
}

export type UserRow = {
    id: string
    username: string
    password?: string | null
    emailAddress: string
    fullName: string
    phoneNumber: string
    zipCode: string
    avatar?: string | null
    externalAuthSubject?: string | null
    isGm?: number | null
}

export type MediaRow = {
    id: string
    title: string
    description: string
    type: string
    tags: string
    url: string
    createdOn: string
    createdBy?: string | null
    updatedOn: string
    updatedBy?: string | null
}

export type SettingsGroupRow = {
    key: string
    label: string
    description: string
    icon?: string | null
    moduleId?: string | null
    settings: string
}

export function mapRole(row: RoleRow): Role {
    return {
        _id: row.id,
        name: row.name,
        description: row.description ?? undefined,
    }
}

export function mapUser(
    row: UserRow,
    roles: Role[] = []
): User & { _id: string; externalAuthSubject?: string; isGm: boolean } {
    return {
        _id: row.id,
        username: row.username,
        password: row.password ?? undefined,
        emailAddress: row.emailAddress,
        fullName: row.fullName,
        phoneNumber: row.phoneNumber,
        zipCode: row.zipCode,
        avatar: row.avatar ?? undefined,
        externalAuthSubject: row.externalAuthSubject ?? undefined,
        isGm: row.isGm === 1,
        roles,
    }
}

export function withoutPassword<T extends { password?: string }>(user: T): T {
    return {
        ...user,
        password: undefined,
    }
}
