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
import { campaigns } from './campaigns'
import { catalogArtifacts, professionRanks } from './catalogs'

export const actors = sqliteTable(
    'actors',
    {
        id: text().primaryKey(),
        ownerUserId: text('owner_user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        status: text().default('draft').notNull(),
        officialName: text('official_name').notNull(),
        shortName: text('short_name').notNull(),
        bioMarkdown: text('bio_markdown').notNull(),
        level: integer().default(1).notNull(),
        baseHealth: integer('base_health').notNull(),
        damageTaken: integer('damage_taken').default(0).notNull(),
        baseWalkingSpeed: real('base_walking_speed').default(5).notNull(),
        strength: integer().notNull(),
        dexterity: integer().notNull(),
        constitution: integer().notNull(),
        intelligence: integer().notNull(),
        wisdom: integer().notNull(),
        charisma: integer().notNull(),
        sanity: integer().notNull(),
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
        index('idx_actors_owner').on(table.ownerUserId, table.status),
        uniqueIndex('idx_actors_short_name_active').on(sql`lower(short_name)`),
        uniqueIndex('idx_actors_official_name_active').on(
            sql`lower(official_name)`
        ),
    ]
)

export const actorArtifactSnapshots = sqliteTable(
    'actor_artifact_snapshots',
    {
        id: text().primaryKey(),
        actorId: text('actor_id')
            .notNull()
            .references(() => actors.id, { onDelete: 'cascade' }),
        snapshotType: text('snapshot_type').notNull(),
        sourceArtifactId: text('source_artifact_id').references(
            () => catalogArtifacts.id,
            { onDelete: 'restrict' }
        ),
        sourceProfessionRankId: text('source_profession_rank_id').references(
            () => professionRanks.id,
            { onDelete: 'restrict' }
        ),
        sourceCatalogUpdatedAt: text('source_catalog_updated_at').notNull(),
        name: text().notNull(),
        descriptionMarkdown: text('description_markdown').notNull(),
        tagsJson: text('tags_json').default('[]').notNull(),
        grantedAtLevel: integer('granted_at_level'),
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
        index('idx_actor_snapshots_actor_type').on(
            table.actorId,
            table.snapshotType,
            table.active
        ),
        uniqueIndex('idx_actor_one_trait_or_quirk').on(
            table.actorId,
            table.snapshotType,
            table.sourceArtifactId
        ),
        uniqueIndex('idx_actor_one_talent').on(table.actorId),
        uniqueIndex('idx_actor_one_secondary_profession').on(table.actorId),
        uniqueIndex('idx_actor_one_primary_profession').on(table.actorId),
        uniqueIndex('idx_actor_one_ethnicity').on(table.actorId),
    ]
)

export const actorSnapshotSources = sqliteTable(
    'actor_snapshot_sources',
    {
        id: text().primaryKey(),
        snapshotId: text('snapshot_id')
            .notNull()
            .references(() => actorArtifactSnapshots.id, {
                onDelete: 'cascade',
            }),
        sourceType: text('source_type').notNull(),
        sourceInstanceId: text('source_instance_id').notNull(),
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

export const actorSnapshotModifiers = sqliteTable(
    'actor_snapshot_modifiers',
    {
        id: text().primaryKey(),
        snapshotId: text('snapshot_id')
            .notNull()
            .references(() => actorArtifactSnapshots.id, {
                onDelete: 'cascade',
            }),
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
        index('idx_actor_snapshot_modifiers_snapshot').on(table.snapshotId),
    ]
)

export const actorSnapshotEffects = sqliteTable(
    'actor_snapshot_effects',
    {
        id: text().primaryKey(),
        snapshotId: text('snapshot_id')
            .notNull()
            .references(() => actorArtifactSnapshots.id, {
                onDelete: 'cascade',
            }),
        effectType: text('effect_type').notNull(),
        targetType: text('target_type'),
        targetId: text('target_id'),
        grantedArtifactId: text('granted_artifact_id').references(
            () => catalogArtifacts.id,
            { onDelete: 'restrict' }
        ),
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
    (table) => []
)

export const actorImages = sqliteTable(
    'actor_images',
    {
        id: text().primaryKey(),
        actorId: text('actor_id')
            .notNull()
            .references(() => actors.id, { onDelete: 'cascade' }),
        kind: text().notNull(),
        source: text().notNull(),
        originalStorageKey: text('original_storage_key').notNull(),
        variantsJson: text('variants_json').default('{}').notNull(),
        mimeType: text('mime_type').notNull(),
        width: integer().notNull(),
        height: integer().notNull(),
        fileSize: integer('file_size').notNull(),
        checksum: text().notNull(),
        altText: text('alt_text').notNull(),
        generationId: text('generation_id'),
        replacedAt: text('replaced_at'),
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
        index('idx_actor_images_checksum').on(table.checksum),
        uniqueIndex('idx_actor_one_active_image_kind').on(
            table.actorId,
            table.kind
        ),
    ]
)

export const actorGenerationRecords = sqliteTable(
    'actor_generation_records',
    {
        id: text().primaryKey(),
        actorId: text('actor_id').references(() => actors.id, {
            onDelete: 'cascade',
        }),
        ownerUserId: text('owner_user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        campaignId: text('campaign_id').references(() => campaigns.id, {
            onDelete: 'set null',
        }),
        section: text().notNull(),
        provider: text().notNull(),
        model: text().notNull(),
        prompt: text().notNull(),
        worldContextJson: text('world_context_json').default('{}').notNull(),
        campaignContextJson: text('campaign_context_json')
            .default('{}')
            .notNull(),
        outputJson: text('output_json').notNull(),
        status: text().notNull(),
        requestedAt: text('requested_at')
            .default(sql`(CURRENT_TIMESTAMP)`)
            .notNull(),
        decidedAt: text('decided_at'),
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
        index('idx_actor_generation_records_actor').on(
            table.actorId,
            table.section,
            table.requestedAt
        ),
        index('idx_actor_generation_records_owner').on(
            table.ownerUserId,
            table.requestedAt
        ),
    ]
)
