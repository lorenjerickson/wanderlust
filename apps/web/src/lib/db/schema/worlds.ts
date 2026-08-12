import { sqliteTable, text, index } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import { campaigns } from './campaigns'
import { users } from './users'

export const worlds = sqliteTable(
    'worlds',
    {
        id: text().primaryKey(),
        ownerUserId: text('owner_user_id').references(() => users.id, {
            onDelete: 'set null',
        }),
        name: text().notNull(),
        description: text().default('').notNull(),
        mapImageUrl: text('map_image_url'),
    },
    (table) => [index('idx_worlds_owner').on(table.ownerUserId)]
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
