import {
    sqliteTable,
    text,
    integer,
    real,
    index,
    uniqueIndex,
} from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import { users } from './users'
import { actors } from './actors'

export const appliedEffects = sqliteTable(
    'applied_effects',
    {
        id: text().primaryKey(),
        actorId: text('actor_id')
            .notNull()
            .references(() => actors.id, { onDelete: 'cascade' }),
        sourceType: text('source_type').notNull(),
        sourceInstanceId: text('source_instance_id').notNull(),
        appliedByActorId: text('applied_by_actor_id').references(
            () => actors.id,
            { onDelete: 'set null' }
        ),
        appliedAt: text('applied_at')
            .default(sql`(CURRENT_TIMESTAMP)`)
            .notNull(),
        durationUnit: text('duration_unit').notNull(),
        duration: real(),
        expiresAt: text('expires_at'),
        remainingTicks: integer('remaining_ticks'),
        active: integer().default(1).notNull(),
        createdAt: text('created_at')
            .default(sql`(CURRENT_TIMESTAMP)`)
            .notNull(),
        createdByUserId: text('created_by_user_id').references(() => users.id, {
            onDelete: 'set null',
        }),
        updatedAt: text('updated_at')
            .default(sql`(CURRENT_TIMESTAMP)`)
            .notNull(),
        updatedByUserId: text('updated_by_user_id').references(() => users.id, {
            onDelete: 'set null',
        }),
        deletedAt: text('deleted_at'),
    },
    (table) => [
        index('idx_applied_effects_expiration').on(
            table.active,
            table.expiresAt
        ),
        uniqueIndex('idx_applied_effect_refresh_identity').on(
            table.actorId,
            table.sourceType,
            table.sourceInstanceId,
            sql`ifnull(applied_by_actor_id, '')`
        ),
    ]
)

export const appliedEffectModifiers = sqliteTable(
    'applied_effect_modifiers',
    {
        id: text().primaryKey(),
        appliedEffectId: text('applied_effect_id')
            .notNull()
            .references(() => appliedEffects.id, { onDelete: 'cascade' }),
        targetType: text('target_type').notNull(),
        targetId: text('target_id'),
        operation: text().notNull(),
        value: real().notNull(),
        tickDamage: integer('tick_damage'),
        descriptionMarkdown: text('description_markdown').notNull(),
        createdAt: text('created_at')
            .default(sql`(CURRENT_TIMESTAMP)`)
            .notNull(),
        createdByUserId: text('created_by_user_id').references(() => users.id, {
            onDelete: 'set null',
        }),
        updatedAt: text('updated_at')
            .default(sql`(CURRENT_TIMESTAMP)`)
            .notNull(),
        updatedByUserId: text('updated_by_user_id').references(() => users.id, {
            onDelete: 'set null',
        }),
        deletedAt: text('deleted_at'),
    },
    (table) => []
)
