import { Database } from 'sqlite'

export const migrationId = 'v5_actor_domain'
export const schemaVersion = 5

export async function up(db: Database) {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS actors (
            id TEXT PRIMARY KEY,
            owner_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            status TEXT NOT NULL DEFAULT 'draft'
                CHECK (status IN ('draft', 'inactive', 'active', 'deleted')),
            official_name TEXT NOT NULL CHECK (
                length(trim(official_name)) BETWEEN 1 AND 120
                AND official_name = trim(official_name)
            ),
            short_name TEXT NOT NULL CHECK (
                length(trim(short_name)) BETWEEN 1 AND 24
                AND short_name = trim(short_name)
            ),
            bio_markdown TEXT NOT NULL CHECK (
                length(bio_markdown) BETWEEN 1 AND 2000
            ),
            level INTEGER NOT NULL DEFAULT 1 CHECK (level BETWEEN 1 AND 20),
            base_health INTEGER NOT NULL CHECK (base_health >= 1),
            damage_taken INTEGER NOT NULL DEFAULT 0 CHECK (damage_taken >= 0),
            base_walking_speed REAL NOT NULL DEFAULT 5 CHECK (base_walking_speed > 0),
            strength INTEGER NOT NULL CHECK (strength BETWEEN 1 AND 20),
            dexterity INTEGER NOT NULL CHECK (dexterity BETWEEN 1 AND 20),
            constitution INTEGER NOT NULL CHECK (constitution BETWEEN 1 AND 20),
            intelligence INTEGER NOT NULL CHECK (intelligence BETWEEN 1 AND 20),
            wisdom INTEGER NOT NULL CHECK (wisdom BETWEEN 1 AND 20),
            charisma INTEGER NOT NULL CHECK (charisma BETWEEN 1 AND 20),
            sanity INTEGER NOT NULL CHECK (sanity BETWEEN 1 AND 20),
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            deleted_at TEXT
        );

        CREATE UNIQUE INDEX IF NOT EXISTS idx_actors_official_name_active
            ON actors(lower(official_name))
            WHERE deleted_at IS NULL;

        CREATE UNIQUE INDEX IF NOT EXISTS idx_actors_short_name_active
            ON actors(lower(short_name))
            WHERE deleted_at IS NULL;

        CREATE INDEX IF NOT EXISTS idx_actors_owner
            ON actors(owner_user_id, status);

        CREATE TRIGGER IF NOT EXISTS actors_names_immutable
        BEFORE UPDATE OF official_name, short_name ON actors
        WHEN new.official_name <> old.official_name
          OR new.short_name <> old.short_name
        BEGIN
            SELECT RAISE(ABORT, 'actor names are immutable');
        END;

        CREATE TABLE IF NOT EXISTS campaign_gms (
            campaign_id TEXT PRIMARY KEY REFERENCES campaigns(id) ON DELETE CASCADE,
            user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            deleted_at TEXT
        );

        CREATE INDEX IF NOT EXISTS idx_campaign_gms_user
            ON campaign_gms(user_id)
            WHERE deleted_at IS NULL;

        CREATE TABLE IF NOT EXISTS campaign_participations (
            id TEXT PRIMARY KEY,
            campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
            actor_id TEXT NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
            user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            status TEXT NOT NULL CHECK (status IN (
                'invited', 'preparing', 'submitted', 'approved', 'active',
                'completed', 'removed', 'withdrawn'
            )),
            invited_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            submitted_at TEXT,
            approved_at TEXT,
            joined_at TEXT,
            left_at TEXT,
            leave_reason_markdown TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            deleted_at TEXT,
            UNIQUE (campaign_id, actor_id)
        );

        CREATE UNIQUE INDEX IF NOT EXISTS idx_actor_one_active_campaign
            ON campaign_participations(actor_id)
            WHERE status = 'active' AND deleted_at IS NULL;

        CREATE INDEX IF NOT EXISTS idx_campaign_participations_campaign_status
            ON campaign_participations(campaign_id, status);

        CREATE INDEX IF NOT EXISTS idx_campaign_participations_user
            ON campaign_participations(user_id, status);

        CREATE TABLE IF NOT EXISTS campaign_actor_constraints (
            id TEXT PRIMARY KEY,
            campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
            constraint_type TEXT NOT NULL CHECK (constraint_type IN (
                'new_actor', 'minimum_level', 'maximum_level',
                'allowed_catalog_artifact', 'forbidden_catalog_artifact'
            )),
            operator TEXT NOT NULL CHECK (operator IN ('equals', 'gte', 'lte', 'includes', 'excludes')),
            numeric_value REAL,
            text_value TEXT,
            description_markdown TEXT NOT NULL DEFAULT '',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            deleted_at TEXT,
            CHECK (numeric_value IS NOT NULL OR text_value IS NOT NULL)
        );

        CREATE INDEX IF NOT EXISTS idx_campaign_actor_constraints_campaign
            ON campaign_actor_constraints(campaign_id)
            WHERE deleted_at IS NULL;

        CREATE TABLE IF NOT EXISTS catalog_artifacts (
            id TEXT PRIMARY KEY,
            artifact_type TEXT NOT NULL CHECK (artifact_type IN (
                'ethnicity', 'profession', 'talent', 'trait', 'quirk', 'item'
            )),
            name TEXT NOT NULL CHECK (
                length(trim(name)) BETWEEN 1 AND 120
                AND name = trim(name)
            ),
            description_markdown TEXT NOT NULL CHECK (length(description_markdown) > 0),
            tags_json TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(tags_json)),
            created_by_role TEXT NOT NULL CHECK (created_by_role IN ('admin', 'gm')),
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            deleted_at TEXT
        );

        CREATE UNIQUE INDEX IF NOT EXISTS idx_catalog_artifact_type_name_active
            ON catalog_artifacts(artifact_type, lower(name))
            WHERE deleted_at IS NULL;

        CREATE INDEX IF NOT EXISTS idx_catalog_artifacts_creator
            ON catalog_artifacts(created_by_user_id, artifact_type);

        CREATE TABLE IF NOT EXISTS profession_ranks (
            id TEXT PRIMARY KEY,
            profession_id TEXT NOT NULL REFERENCES catalog_artifacts(id) ON DELETE CASCADE,
            track TEXT NOT NULL CHECK (track IN ('primary', 'secondary', 'both')),
            rank_order INTEGER NOT NULL CHECK (rank_order >= 0),
            name TEXT NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 80),
            description_markdown TEXT NOT NULL,
            advancement_level INTEGER NOT NULL CHECK (advancement_level BETWEEN 1 AND 20),
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            deleted_at TEXT,
            UNIQUE (profession_id, track, rank_order),
            UNIQUE (profession_id, track, advancement_level)
        );

        CREATE INDEX IF NOT EXISTS idx_profession_ranks_profession
            ON profession_ranks(profession_id, track, advancement_level);

        CREATE TABLE IF NOT EXISTS catalog_modifiers (
            id TEXT PRIMARY KEY,
            artifact_id TEXT REFERENCES catalog_artifacts(id) ON DELETE CASCADE,
            profession_rank_id TEXT REFERENCES profession_ranks(id) ON DELETE CASCADE,
            target_type TEXT NOT NULL CHECK (target_type IN (
                'attribute', 'ability', 'health', 'defense',
                'walking_speed', 'running_speed', 'swimming_speed'
            )),
            target_id TEXT,
            operation TEXT NOT NULL CHECK (operation IN ('add', 'replace')),
            value REAL NOT NULL,
            description_markdown TEXT NOT NULL CHECK (length(description_markdown) > 0),
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            deleted_at TEXT,
            CHECK ((artifact_id IS NOT NULL) <> (profession_rank_id IS NOT NULL))
        );

        CREATE INDEX IF NOT EXISTS idx_catalog_modifiers_artifact
            ON catalog_modifiers(artifact_id)
            WHERE artifact_id IS NOT NULL AND deleted_at IS NULL;

        CREATE INDEX IF NOT EXISTS idx_catalog_modifiers_rank
            ON catalog_modifiers(profession_rank_id)
            WHERE profession_rank_id IS NOT NULL AND deleted_at IS NULL;

        CREATE TABLE IF NOT EXISTS catalog_effects (
            id TEXT PRIMARY KEY,
            artifact_id TEXT REFERENCES catalog_artifacts(id) ON DELETE CASCADE,
            profession_rank_id TEXT REFERENCES profession_ranks(id) ON DELETE CASCADE,
            effect_type TEXT NOT NULL CHECK (effect_type IN (
                'advantage', 'disadvantage', 'grant_trait', 'grant_quirk', 'grant_item'
            )),
            target_type TEXT CHECK (target_type IN ('attribute', 'ability')),
            target_id TEXT,
            granted_artifact_id TEXT REFERENCES catalog_artifacts(id) ON DELETE RESTRICT,
            quantity INTEGER CHECK (quantity IS NULL OR quantity > 0),
            description_markdown TEXT NOT NULL DEFAULT '',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            deleted_at TEXT,
            CHECK ((artifact_id IS NOT NULL) <> (profession_rank_id IS NOT NULL)),
            CHECK (
                (effect_type IN ('advantage', 'disadvantage')
                    AND target_type IS NOT NULL
                    AND target_id IS NOT NULL
                    AND granted_artifact_id IS NULL)
                OR
                (effect_type IN ('grant_trait', 'grant_quirk', 'grant_item')
                    AND granted_artifact_id IS NOT NULL
                    AND target_type IS NULL
                    AND target_id IS NULL)
            )
        );

        CREATE INDEX IF NOT EXISTS idx_catalog_effects_artifact
            ON catalog_effects(artifact_id)
            WHERE artifact_id IS NOT NULL AND deleted_at IS NULL;

        CREATE INDEX IF NOT EXISTS idx_catalog_effects_rank
            ON catalog_effects(profession_rank_id)
            WHERE profession_rank_id IS NOT NULL AND deleted_at IS NULL;

        CREATE TABLE IF NOT EXISTS item_definitions (
            artifact_id TEXT PRIMARY KEY REFERENCES catalog_artifacts(id) ON DELETE CASCADE,
            item_type TEXT NOT NULL,
            weight REAL NOT NULL DEFAULT 0 CHECK (weight >= 0),
            value REAL NOT NULL DEFAULT 0 CHECK (value >= 0),
            stackable INTEGER NOT NULL DEFAULT 0 CHECK (stackable IN (0, 1)),
            max_stack INTEGER NOT NULL DEFAULT 1 CHECK (max_stack >= 1),
            provided_slot_count INTEGER NOT NULL DEFAULT 0 CHECK (provided_slot_count >= 0),
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            deleted_at TEXT,
            CHECK ((stackable = 1) OR (max_stack = 1))
        );

        CREATE TABLE IF NOT EXISTS item_slot_rules (
            id TEXT PRIMARY KEY,
            item_artifact_id TEXT NOT NULL REFERENCES item_definitions(artifact_id) ON DELETE CASCADE,
            slot TEXT NOT NULL CHECK (slot IN (
                'head', 'neck', 'torso', 'arms', 'main_hand', 'off_hand',
                'hands', 'legs', 'feet', 'belt', 'pack'
            )),
            rule_type TEXT NOT NULL CHECK (rule_type IN ('compatible', 'required')),
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            deleted_at TEXT,
            UNIQUE (item_artifact_id, slot, rule_type)
        );

        CREATE TABLE IF NOT EXISTS actor_artifact_snapshots (
            id TEXT PRIMARY KEY,
            actor_id TEXT NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
            snapshot_type TEXT NOT NULL CHECK (snapshot_type IN (
                'ethnicity', 'primary_profession', 'secondary_profession',
                'profession_rank', 'talent', 'trait', 'quirk'
            )),
            source_artifact_id TEXT REFERENCES catalog_artifacts(id) ON DELETE RESTRICT,
            source_profession_rank_id TEXT REFERENCES profession_ranks(id) ON DELETE RESTRICT,
            source_catalog_updated_at TEXT NOT NULL,
            name TEXT NOT NULL,
            description_markdown TEXT NOT NULL,
            tags_json TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(tags_json)),
            granted_at_level INTEGER CHECK (granted_at_level BETWEEN 1 AND 20),
            active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            deleted_at TEXT,
            CHECK ((source_artifact_id IS NOT NULL) <> (source_profession_rank_id IS NOT NULL))
        );

        CREATE UNIQUE INDEX IF NOT EXISTS idx_actor_one_ethnicity
            ON actor_artifact_snapshots(actor_id)
            WHERE snapshot_type = 'ethnicity' AND active = 1 AND deleted_at IS NULL;

        CREATE UNIQUE INDEX IF NOT EXISTS idx_actor_one_primary_profession
            ON actor_artifact_snapshots(actor_id)
            WHERE snapshot_type = 'primary_profession' AND active = 1 AND deleted_at IS NULL;

        CREATE UNIQUE INDEX IF NOT EXISTS idx_actor_one_secondary_profession
            ON actor_artifact_snapshots(actor_id)
            WHERE snapshot_type = 'secondary_profession' AND active = 1 AND deleted_at IS NULL;

        CREATE UNIQUE INDEX IF NOT EXISTS idx_actor_one_talent
            ON actor_artifact_snapshots(actor_id)
            WHERE snapshot_type = 'talent' AND active = 1 AND deleted_at IS NULL;

        CREATE UNIQUE INDEX IF NOT EXISTS idx_actor_one_trait_or_quirk
            ON actor_artifact_snapshots(actor_id, snapshot_type, source_artifact_id)
            WHERE snapshot_type IN ('trait', 'quirk') AND active = 1 AND deleted_at IS NULL;

        CREATE INDEX IF NOT EXISTS idx_actor_snapshots_actor_type
            ON actor_artifact_snapshots(actor_id, snapshot_type, active);

        CREATE TABLE IF NOT EXISTS actor_snapshot_sources (
            id TEXT PRIMARY KEY,
            snapshot_id TEXT NOT NULL REFERENCES actor_artifact_snapshots(id) ON DELETE CASCADE,
            source_type TEXT NOT NULL CHECK (source_type IN (
                'ethnicity', 'profession_rank', 'item', 'quirk', 'level'
            )),
            source_instance_id TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            deleted_at TEXT,
            UNIQUE (snapshot_id, source_type, source_instance_id)
        );

        CREATE TABLE IF NOT EXISTS actor_snapshot_modifiers (
            id TEXT PRIMARY KEY,
            snapshot_id TEXT NOT NULL REFERENCES actor_artifact_snapshots(id) ON DELETE CASCADE,
            target_type TEXT NOT NULL CHECK (target_type IN (
                'attribute', 'ability', 'health', 'defense',
                'walking_speed', 'running_speed', 'swimming_speed'
            )),
            target_id TEXT,
            operation TEXT NOT NULL CHECK (operation IN ('add', 'replace')),
            value REAL NOT NULL,
            description_markdown TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            deleted_at TEXT
        );

        CREATE INDEX IF NOT EXISTS idx_actor_snapshot_modifiers_snapshot
            ON actor_snapshot_modifiers(snapshot_id)
            WHERE deleted_at IS NULL;

        CREATE TABLE IF NOT EXISTS actor_snapshot_effects (
            id TEXT PRIMARY KEY,
            snapshot_id TEXT NOT NULL REFERENCES actor_artifact_snapshots(id) ON DELETE CASCADE,
            effect_type TEXT NOT NULL CHECK (effect_type IN (
                'advantage', 'disadvantage', 'grant_trait', 'grant_quirk'
            )),
            target_type TEXT CHECK (target_type IN ('attribute', 'ability')),
            target_id TEXT,
            granted_artifact_id TEXT REFERENCES catalog_artifacts(id) ON DELETE RESTRICT,
            description_markdown TEXT NOT NULL DEFAULT '',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            deleted_at TEXT
        );

        CREATE TABLE IF NOT EXISTS actor_items (
            id TEXT PRIMARY KEY,
            actor_id TEXT NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
            source_artifact_id TEXT NOT NULL REFERENCES catalog_artifacts(id) ON DELETE RESTRICT,
            source_catalog_updated_at TEXT NOT NULL,
            name TEXT NOT NULL,
            description_markdown TEXT NOT NULL,
            tags_json TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(tags_json)),
            item_type TEXT NOT NULL,
            stackable INTEGER NOT NULL CHECK (stackable IN (0, 1)),
            max_stack INTEGER NOT NULL CHECK (max_stack >= 1),
            quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1 AND quantity <= max_stack),
            provided_slot_count INTEGER NOT NULL DEFAULT 0 CHECK (provided_slot_count >= 0),
            container_item_id TEXT REFERENCES actor_items(id) ON DELETE RESTRICT,
            container_slot_index INTEGER CHECK (container_slot_index IS NULL OR container_slot_index >= 0),
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            deleted_at TEXT,
            CHECK ((container_item_id IS NULL) = (container_slot_index IS NULL))
        );

        CREATE UNIQUE INDEX IF NOT EXISTS idx_actor_item_container_slot
            ON actor_items(container_item_id, container_slot_index)
            WHERE container_item_id IS NOT NULL AND deleted_at IS NULL;

        CREATE INDEX IF NOT EXISTS idx_actor_items_actor
            ON actor_items(actor_id)
            WHERE deleted_at IS NULL;

        CREATE TABLE IF NOT EXISTS actor_item_modifiers (
            id TEXT PRIMARY KEY,
            actor_item_id TEXT NOT NULL REFERENCES actor_items(id) ON DELETE CASCADE,
            target_type TEXT NOT NULL CHECK (target_type IN (
                'attribute', 'ability', 'health', 'defense',
                'walking_speed', 'running_speed', 'swimming_speed'
            )),
            target_id TEXT,
            operation TEXT NOT NULL CHECK (operation IN ('add', 'replace')),
            value REAL NOT NULL,
            description_markdown TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            deleted_at TEXT
        );

        CREATE TABLE IF NOT EXISTS actor_item_effects (
            id TEXT PRIMARY KEY,
            actor_item_id TEXT NOT NULL REFERENCES actor_items(id) ON DELETE CASCADE,
            effect_type TEXT NOT NULL CHECK (effect_type IN (
                'advantage', 'disadvantage', 'grant_trait', 'grant_quirk'
            )),
            target_type TEXT CHECK (target_type IN ('attribute', 'ability')),
            target_id TEXT,
            granted_artifact_id TEXT REFERENCES catalog_artifacts(id) ON DELETE RESTRICT,
            description_markdown TEXT NOT NULL DEFAULT '',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            deleted_at TEXT,
            CHECK (
                (effect_type IN ('advantage', 'disadvantage')
                    AND target_type IS NOT NULL
                    AND target_id IS NOT NULL
                    AND granted_artifact_id IS NULL)
                OR
                (effect_type IN ('grant_trait', 'grant_quirk')
                    AND granted_artifact_id IS NOT NULL
                    AND target_type IS NULL
                    AND target_id IS NULL)
            )
        );

        CREATE TABLE IF NOT EXISTS actor_item_slot_rules (
            id TEXT PRIMARY KEY,
            actor_item_id TEXT NOT NULL REFERENCES actor_items(id) ON DELETE CASCADE,
            slot TEXT NOT NULL CHECK (slot IN (
                'head', 'neck', 'torso', 'arms', 'main_hand', 'off_hand',
                'hands', 'legs', 'feet', 'belt', 'pack'
            )),
            rule_type TEXT NOT NULL CHECK (rule_type IN ('compatible', 'required')),
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            deleted_at TEXT,
            UNIQUE (actor_item_id, slot, rule_type)
        );

        CREATE TABLE IF NOT EXISTS actor_equipment_placements (
            id TEXT PRIMARY KEY,
            actor_id TEXT NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
            actor_item_id TEXT NOT NULL REFERENCES actor_items(id) ON DELETE CASCADE,
            slot TEXT NOT NULL CHECK (slot IN (
                'head', 'neck', 'torso', 'arms', 'main_hand', 'off_hand',
                'hands', 'legs', 'feet', 'belt', 'pack'
            )),
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            deleted_at TEXT,
            UNIQUE (actor_id, slot),
            UNIQUE (actor_item_id, slot)
        );

        CREATE TABLE IF NOT EXISTS actor_item_transfers (
            id TEXT PRIMARY KEY,
            actor_item_id TEXT NOT NULL REFERENCES actor_items(id) ON DELETE CASCADE,
            from_actor_id TEXT REFERENCES actors(id) ON DELETE SET NULL,
            to_actor_id TEXT REFERENCES actors(id) ON DELETE SET NULL,
            quantity INTEGER NOT NULL CHECK (quantity > 0),
            transferred_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            deleted_at TEXT,
            CHECK (from_actor_id IS NOT NULL OR to_actor_id IS NOT NULL)
        );

        CREATE INDEX IF NOT EXISTS idx_actor_item_transfers_item
            ON actor_item_transfers(actor_item_id, transferred_at);

        CREATE TABLE IF NOT EXISTS applied_effects (
            id TEXT PRIMARY KEY,
            actor_id TEXT NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
            source_type TEXT NOT NULL,
            source_instance_id TEXT NOT NULL,
            applied_by_actor_id TEXT REFERENCES actors(id) ON DELETE SET NULL,
            applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            duration_unit TEXT NOT NULL CHECK (duration_unit IN (
                'turn', 'round', 'second', 'minute', 'hour', 'day', 'event'
            )),
            duration REAL CHECK (duration IS NULL OR duration > 0),
            expires_at TEXT,
            remaining_ticks INTEGER CHECK (remaining_ticks IS NULL OR remaining_ticks >= 0),
            active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            deleted_at TEXT
        );

        CREATE UNIQUE INDEX IF NOT EXISTS idx_applied_effect_refresh_identity
            ON applied_effects(
                actor_id,
                source_type,
                source_instance_id,
                ifnull(applied_by_actor_id, '')
            )
            WHERE active = 1 AND deleted_at IS NULL;

        CREATE INDEX IF NOT EXISTS idx_applied_effects_expiration
            ON applied_effects(active, expires_at)
            WHERE active = 1 AND deleted_at IS NULL;

        CREATE TABLE IF NOT EXISTS applied_effect_modifiers (
            id TEXT PRIMARY KEY,
            applied_effect_id TEXT NOT NULL REFERENCES applied_effects(id) ON DELETE CASCADE,
            target_type TEXT NOT NULL CHECK (target_type IN (
                'attribute', 'ability', 'health', 'defense',
                'walking_speed', 'running_speed', 'swimming_speed'
            )),
            target_id TEXT,
            operation TEXT NOT NULL CHECK (operation IN ('add', 'replace')),
            value REAL NOT NULL,
            tick_damage INTEGER CHECK (tick_damage IS NULL OR tick_damage >= 0),
            description_markdown TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            deleted_at TEXT
        );

        CREATE TABLE IF NOT EXISTS actor_images (
            id TEXT PRIMARY KEY,
            actor_id TEXT NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
            kind TEXT NOT NULL CHECK (kind IN ('portrait', 'token')),
            source TEXT NOT NULL CHECK (source IN ('upload', 'generated')),
            original_storage_key TEXT NOT NULL,
            variants_json TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(variants_json)),
            mime_type TEXT NOT NULL CHECK (
                (kind = 'portrait' AND mime_type IN ('image/png', 'image/jpeg', 'image/webp'))
                OR
                (kind = 'token' AND mime_type IN ('image/png', 'image/webp'))
            ),
            width INTEGER NOT NULL CHECK (width > 0),
            height INTEGER NOT NULL CHECK (height > 0),
            file_size INTEGER NOT NULL CHECK (file_size > 0 AND file_size <= 5242880),
            checksum TEXT NOT NULL,
            alt_text TEXT NOT NULL,
            generation_id TEXT REFERENCES actor_generation_records(id) ON DELETE SET NULL,
            replaced_at TEXT,
            active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            deleted_at TEXT
        );

        CREATE UNIQUE INDEX IF NOT EXISTS idx_actor_one_active_image_kind
            ON actor_images(actor_id, kind)
            WHERE active = 1 AND deleted_at IS NULL;

        CREATE INDEX IF NOT EXISTS idx_actor_images_checksum
            ON actor_images(checksum);

        CREATE TABLE IF NOT EXISTS actor_generation_records (
            id TEXT PRIMARY KEY,
            actor_id TEXT REFERENCES actors(id) ON DELETE CASCADE,
            owner_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            campaign_id TEXT REFERENCES campaigns(id) ON DELETE SET NULL,
            section TEXT NOT NULL CHECK (section IN (
                'whole_actor', 'names', 'bio', 'ethnicity', 'professions',
                'talent', 'attributes', 'equipment', 'portrait', 'token'
            )),
            provider TEXT NOT NULL,
            model TEXT NOT NULL,
            prompt TEXT NOT NULL,
            world_context_json TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(world_context_json)),
            campaign_context_json TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(campaign_context_json)),
            output_json TEXT NOT NULL CHECK (json_valid(output_json)),
            status TEXT NOT NULL CHECK (status IN ('generated', 'accepted', 'rejected')),
            requested_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            decided_at TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
            deleted_at TEXT
        );

        CREATE INDEX IF NOT EXISTS idx_actor_generation_records_owner
            ON actor_generation_records(owner_user_id, requested_at);

        CREATE INDEX IF NOT EXISTS idx_actor_generation_records_actor
            ON actor_generation_records(actor_id, section, requested_at);

        UPDATE SCHEMA_VERSION SET currentVersion = 5;
    `)
}
