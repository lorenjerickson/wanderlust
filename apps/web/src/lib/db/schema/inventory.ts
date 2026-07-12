import {
    sqliteTable,
    text,
    integer,
    real,
    index,
    uniqueIndex,
    foreignKey,
} from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import { users } from './users'
import { catalogArtifacts } from './catalogs'
import { actors } from './actors'

export const itemDefinitions = sqliteTable(
    'item_definitions',
    {
        artifactId: text('artifact_id')
            .primaryKey()
            .references(() => catalogArtifacts.id, { onDelete: 'cascade' }),
        itemType: text('item_type').notNull(),
        weight: real().notNull(),
        value: real().notNull(),
        stackable: integer().default(0).notNull(),
        maxStack: integer('max_stack').default(1).notNull(),
        providedSlotCount: integer('provided_slot_count').default(0).notNull(),
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

export const itemSlotRules = sqliteTable(
    'item_slot_rules',
    {
        id: text().primaryKey(),
        itemArtifactId: text('item_artifact_id')
            .notNull()
            .references(() => itemDefinitions.artifactId, {
                onDelete: 'cascade',
            }),
        slot: text().notNull(),
        ruleType: text('rule_type').notNull(),
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

export const actorItems = sqliteTable(
    'actor_items',
    {
        id: text().primaryKey(),
        actorId: text('actor_id')
            .notNull()
            .references(() => actors.id, { onDelete: 'cascade' }),
        sourceArtifactId: text('source_artifact_id')
            .notNull()
            .references(() => catalogArtifacts.id, { onDelete: 'restrict' }),
        sourceCatalogUpdatedAt: text('source_catalog_updated_at').notNull(),
        name: text().notNull(),
        descriptionMarkdown: text('description_markdown').notNull(),
        tagsJson: text('tags_json').default('[]').notNull(),
        itemType: text('item_type').notNull(),
        stackable: integer().notNull(),
        maxStack: integer('max_stack').notNull(),
        quantity: integer().default(1).notNull(),
        providedSlotCount: integer('provided_slot_count').default(0).notNull(),
        containerItemId: text('container_item_id'),
        containerSlotIndex: integer('container_slot_index'),
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
        index('idx_actor_items_actor').on(table.actorId),
        uniqueIndex('idx_actor_item_container_slot').on(
            table.containerItemId,
            table.containerSlotIndex
        ),
        foreignKey(() => ({
            columns: [table.containerItemId],
            foreignColumns: [table.id],
            name: 'actor_items_container_item_id_actor_items_id_fk',
        })).onDelete('restrict'),
    ]
)

export const actorItemModifiers = sqliteTable(
    'actor_item_modifiers',
    {
        id: text().primaryKey(),
        actorItemId: text('actor_item_id')
            .notNull()
            .references(() => actorItems.id, { onDelete: 'cascade' }),
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
    (table) => []
)

export const actorItemSlotRules = sqliteTable(
    'actor_item_slot_rules',
    {
        id: text().primaryKey(),
        actorItemId: text('actor_item_id')
            .notNull()
            .references(() => actorItems.id, { onDelete: 'cascade' }),
        slot: text().notNull(),
        ruleType: text('rule_type').notNull(),
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

export const actorEquipmentPlacements = sqliteTable(
    'actor_equipment_placements',
    {
        id: text().primaryKey(),
        actorId: text('actor_id')
            .notNull()
            .references(() => actors.id, { onDelete: 'cascade' }),
        actorItemId: text('actor_item_id')
            .notNull()
            .references(() => actorItems.id, { onDelete: 'cascade' }),
        slot: text().notNull(),
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

export const actorItemTransfers = sqliteTable(
    'actor_item_transfers',
    {
        id: text().primaryKey(),
        actorItemId: text('actor_item_id')
            .notNull()
            .references(() => actorItems.id, { onDelete: 'cascade' }),
        fromActorId: text('from_actor_id').references(() => actors.id, {
            onDelete: 'set null',
        }),
        toActorId: text('to_actor_id').references(() => actors.id, {
            onDelete: 'set null',
        }),
        quantity: integer().notNull(),
        transferredAt: text('transferred_at')
            .default(sql`(CURRENT_TIMESTAMP)`)
            .notNull(),
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
        index('idx_actor_item_transfers_item').on(
            table.actorItemId,
            table.transferredAt
        ),
    ]
)

export const actorItemEffects = sqliteTable(
    'actor_item_effects',
    {
        id: text().primaryKey(),
        actorItemId: text('actor_item_id')
            .notNull()
            .references(() => actorItems.id, { onDelete: 'cascade' }),
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
