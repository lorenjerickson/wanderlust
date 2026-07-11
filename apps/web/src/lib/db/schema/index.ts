import {
    sqliteTable,
    text,
    uniqueIndex,
    integer,
    foreignKey,
    primaryKey,
    numeric,
    index,
    real,
} from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import type { RoleName } from '@wanderlust/core'

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

export const auth = sqliteTable(
    'auth',
    {
        username: text().primaryKey(),
        jwt: text().notNull(),
        createdOn: text()
            .default(sql`(CURRENT_TIMESTAMP)`)
            .notNull(),
    },
    (table) => []
)

export const settingsGroups = sqliteTable(
    'settings_groups',
    {
        key: text().primaryKey(),
        label: text().notNull(),
        description: text().notNull(),
        icon: text(),
        moduleId: text(),
        settings: text().notNull(),
    },
    (table) => []
)

export const media = sqliteTable(
    'media',
    {
        id: text().primaryKey(),
        title: text().notNull(),
        description: text().default('').notNull(),
        type: text().notNull(),
        tags: text().default('[]').notNull(),
        url: text().notNull(),
        createdOn: text()
            .default(sql`(CURRENT_TIMESTAMP)`)
            .notNull(),
        createdBy: text(),
        updatedOn: text()
            .default(sql`(CURRENT_TIMESTAMP)`)
            .notNull(),
        updatedBy: text(),
    },
    (table) => []
)

export const schemaVersion = sqliteTable(
    'SCHEMA_VERSION',
    {
        currentVersion: numeric().notNull(),
    },
    (table) => []
)

export const campaigns = sqliteTable(
    'campaigns',
    {
        id: text().primaryKey(),
        title: text().notNull(),
        description: text().default('').notNull(),
        active: integer().default(1).notNull(),
        worldId: text('world_id').references(() => worlds.id, {
            onDelete: 'set null',
        }),
        shortDescriptionRichText: text('short_description_rich_text')
            .default('')
            .notNull(),
        longDescriptionRichText: text('long_description_rich_text')
            .default('')
            .notNull(),
        mapImageUrl: text('map_image_url'),
    },
    (table) => []
)

export const userPlayerCharacters = sqliteTable(
    'user_player_characters',
    {
        id: text().primaryKey(),
        userId: text('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        name: text().notNull(),
        race: text(),
        characterClass: text('character_class'),
    },
    (table) => []
)

export const campaignPlayers = sqliteTable(
    'campaign_players',
    {
        id: text().primaryKey(),
        userPlayerCharacterId: text('user_player_character_id')
            .notNull()
            .references(() => userPlayerCharacters.id, { onDelete: 'cascade' }),
        campaignId: text('campaign_id')
            .notNull()
            .references(() => campaigns.id, { onDelete: 'cascade' }),
    },
    (table) => []
)

export const worlds = sqliteTable(
    'worlds',
    {
        id: text().primaryKey(),
        name: text().notNull(),
        description: text().default('').notNull(),
        mapImageUrl: text('map_image_url'),
    },
    (table) => []
)

export const scenarios = sqliteTable(
    'scenarios',
    {
        id: text().primaryKey(),
        campaignId: text('campaign_id')
            .notNull()
            .references(() => campaigns.id, { onDelete: 'cascade' }),
        shortDescriptionRichText: text('short_description_rich_text')
            .default('')
            .notNull(),
        mapImageUrl: text('map_image_url'),
        longDescriptionRichText: text('long_description_rich_text')
            .default('')
            .notNull(),
    },
    (table) => []
)

export const encounters = sqliteTable(
    'encounters',
    {
        id: text().primaryKey(),
        scenarioId: text('scenario_id')
            .notNull()
            .references(() => scenarios.id, { onDelete: 'cascade' }),
        shortDescriptionRichText: text('short_description_rich_text')
            .default('')
            .notNull(),
        longDescriptionRichText: text('long_description_rich_text')
            .default('')
            .notNull(),
        location: text(),
        mapImageUrl: text('map_image_url'),
    },
    (table) => []
)

export const worldArtifacts = sqliteTable(
    'world_artifacts',
    {
        id: text().primaryKey(),
        worldId: text('world_id').references(() => worlds.id, {
            onDelete: 'cascade',
        }),
        artifactType: text('artifact_type').notNull(),
        title: text().notNull(),
        descriptionMarkdown: text('description_markdown').default('').notNull(),
        mapImageUrl: text('map_image_url'),
        createdAt: text('created_at')
            .default(sql`(CURRENT_TIMESTAMP)`)
            .notNull(),
        updatedAt: text('updated_at')
            .default(sql`(CURRENT_TIMESTAMP)`)
            .notNull(),
    },
    (table) => [
        index('idx_world_artifacts_type_title').on(
            table.artifactType,
            table.title
        ),
        index('idx_world_artifacts_world_id').on(table.worldId),
    ]
)

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

export const campaignParticipations = sqliteTable(
    'campaign_participations',
    {
        id: text().primaryKey(),
        campaignId: text('campaign_id')
            .notNull()
            .references(() => campaigns.id, { onDelete: 'cascade' }),
        actorId: text('actor_id')
            .notNull()
            .references(() => actors.id, { onDelete: 'cascade' }),
        userId: text('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        status: text().notNull(),
        invitedAt: text('invited_at')
            .default(sql`(CURRENT_TIMESTAMP)`)
            .notNull(),
        submittedAt: text('submitted_at'),
        approvedAt: text('approved_at'),
        joinedAt: text('joined_at'),
        leftAt: text('left_at'),
        leaveReasonMarkdown: text('leave_reason_markdown'),
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
        index('idx_campaign_participations_user').on(
            table.userId,
            table.status
        ),
        index('idx_campaign_participations_campaign_status').on(
            table.campaignId,
            table.status
        ),
        uniqueIndex('idx_actor_one_active_campaign').on(table.actorId),
    ]
)

export const campaignActorConstraints = sqliteTable(
    'campaign_actor_constraints',
    {
        id: text().primaryKey(),
        campaignId: text('campaign_id')
            .notNull()
            .references(() => campaigns.id, { onDelete: 'cascade' }),
        constraintType: text('constraint_type').notNull(),
        operator: text().notNull(),
        numericValue: real('numeric_value'),
        textValue: text('text_value'),
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
        index('idx_campaign_actor_constraints_campaign').on(table.campaignId),
    ]
)

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

export const campaignGms = sqliteTable(
    'campaign_gms',
    {
        campaignId: text('campaign_id')
            .primaryKey()
            .references(() => campaigns.id, { onDelete: 'cascade' }),
        userId: text('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
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
    (table) => [index('idx_campaign_gms_user').on(table.userId)]
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
