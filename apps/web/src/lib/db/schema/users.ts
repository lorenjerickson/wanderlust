import {
    sqliteTable,
    text,
    integer,
    uniqueIndex,
    primaryKey,
} from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import type { RoleName } from '@wanderlust/common'

export const roles = sqliteTable(
    'roles',
    {
        id: text().primaryKey(),
        name: text().$type<RoleName>().notNull(),
        description: text(),
    },
    (table) => []
)

export const users = sqliteTable(
    'users',
    {
        id: text().primaryKey(),
        username: text().notNull(),
        password: text(),
        emailAddress: text().notNull(),
        fullName: text().notNull(),
        phoneNumber: text().notNull(),
        zipCode: text().notNull(),
        avatar: text(),
        createdOn: text()
            .default(sql`(CURRENT_TIMESTAMP)`)
            .notNull(),
        updatedOn: text()
            .default(sql`(CURRENT_TIMESTAMP)`)
            .notNull(),
        externalAuthSubject: text('external_auth_subject'),
        isGm: integer('is_gm').default(0).notNull(),
    },
    (table) => [
        uniqueIndex('idx_users_external_auth_subject').on(
            table.externalAuthSubject
        ),
    ]
)

export const userRoles = sqliteTable(
    'user_roles',
    {
        userId: text('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        roleId: text('role_id')
            .notNull()
            .references(() => roles.id, { onDelete: 'cascade' }),
    },
    (table) => [
        primaryKey({
            columns: [table.userId, table.roleId],
            name: 'user_roles_user_id_role_id_pk',
        }),
    ]
)
