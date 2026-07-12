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
import { worlds } from './worlds'
import { actors } from './actors'

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
