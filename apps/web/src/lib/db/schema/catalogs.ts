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

export const catalogArtifacts = sqliteTable(
    'catalog_artifacts',
    {
        id: text().primaryKey(),
        artifactType: text('artifact_type').notNull(),
        name: text().notNull(),
        descriptionMarkdown: text('description_markdown').notNull(),
        tagsJson: text('tags_json').default('[]').notNull(),
        createdByRole: text('created_by_role').notNull(),
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
        index('idx_catalog_artifacts_creator').on(
            table.createdByUserId,
            table.artifactType
        ),
        uniqueIndex('idx_catalog_artifact_type_name_active').on(
            table.artifactType,
            sql`lower(name)`
        ),
    ]
)

export const professionRanks = sqliteTable(
    'profession_ranks',
    {
        id: text().primaryKey(),
        professionId: text('profession_id')
            .notNull()
            .references(() => catalogArtifacts.id, { onDelete: 'cascade' }),
        track: text().notNull(),
        rankOrder: integer('rank_order').notNull(),
        name: text().notNull(),
        descriptionMarkdown: text('description_markdown').notNull(),
        advancementLevel: integer('advancement_level').notNull(),
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
        index('idx_profession_ranks_profession').on(
            table.professionId,
            table.track,
            table.advancementLevel
        ),
    ]
)

export const catalogModifiers = sqliteTable(
    'catalog_modifiers',
    {
        id: text().primaryKey(),
        artifactId: text('artifact_id').references(() => catalogArtifacts.id, {
            onDelete: 'cascade',
        }),
        professionRankId: text('profession_rank_id').references(
            () => professionRanks.id,
            { onDelete: 'cascade' }
        ),
        targetType: text('target_type').notNull(),
        targetId: text('target_id'),
        operation: text().notNull(),
        value: real().notNull(),
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
    (table) => [
        index('idx_catalog_modifiers_rank').on(table.professionRankId),
        index('idx_catalog_modifiers_artifact').on(table.artifactId),
    ]
)

export const catalogEffects = sqliteTable(
    'catalog_effects',
    {
        id: text().primaryKey(),
        artifactId: text('artifact_id').references(() => catalogArtifacts.id, {
            onDelete: 'cascade',
        }),
        professionRankId: text('profession_rank_id').references(
            () => professionRanks.id,
            { onDelete: 'cascade' }
        ),
        effectType: text('effect_type').notNull(),
        targetType: text('target_type'),
        targetId: text('target_id'),
        grantedArtifactId: text('granted_artifact_id').references(
            () => catalogArtifacts.id,
            { onDelete: 'restrict' }
        ),
        quantity: integer(),
        descriptionMarkdown: text('description_markdown').default('').notNull(),
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
        index('idx_catalog_effects_rank').on(table.professionRankId),
        index('idx_catalog_effects_artifact').on(table.artifactId),
    ]
)
