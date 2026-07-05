import { Database } from 'sqlite'

export const migrationId = 'v4_world_artifacts'
export const schemaVersion = 4

export async function up(db: Database) {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS world_artifacts (
            id TEXT PRIMARY KEY,
            world_id TEXT REFERENCES worlds(id) ON DELETE CASCADE,
            artifact_type TEXT NOT NULL,
            title TEXT NOT NULL,
            description_markdown TEXT NOT NULL DEFAULT '',
            map_image_url TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_world_artifacts_world_id
            ON world_artifacts(world_id);

        CREATE INDEX IF NOT EXISTS idx_world_artifacts_type_title
            ON world_artifacts(artifact_type, title);

        CREATE VIRTUAL TABLE IF NOT EXISTS world_artifacts_fts
            USING fts5(
                title,
                artifact_type,
                description_markdown,
                content='world_artifacts',
                content_rowid='rowid'
            );

        CREATE TRIGGER IF NOT EXISTS world_artifacts_ai
        AFTER INSERT ON world_artifacts
        BEGIN
            INSERT INTO world_artifacts_fts(
                rowid,
                title,
                artifact_type,
                description_markdown
            )
            VALUES (
                new.rowid,
                new.title,
                new.artifact_type,
                new.description_markdown
            );
        END;

        CREATE TRIGGER IF NOT EXISTS world_artifacts_ad
        AFTER DELETE ON world_artifacts
        BEGIN
            INSERT INTO world_artifacts_fts(
                world_artifacts_fts,
                rowid,
                title,
                artifact_type,
                description_markdown
            )
            VALUES (
                'delete',
                old.rowid,
                old.title,
                old.artifact_type,
                old.description_markdown
            );
        END;

        CREATE TRIGGER IF NOT EXISTS world_artifacts_au
        AFTER UPDATE ON world_artifacts
        BEGIN
            INSERT INTO world_artifacts_fts(
                world_artifacts_fts,
                rowid,
                title,
                artifact_type,
                description_markdown
            )
            VALUES (
                'delete',
                old.rowid,
                old.title,
                old.artifact_type,
                old.description_markdown
            );

            INSERT INTO world_artifacts_fts(
                rowid,
                title,
                artifact_type,
                description_markdown
            )
            VALUES (
                new.rowid,
                new.title,
                new.artifact_type,
                new.description_markdown
            );
        END;

        INSERT INTO world_artifacts_fts(
            rowid,
            title,
            artifact_type,
            description_markdown
        )
        SELECT
            rowid,
            title,
            artifact_type,
            description_markdown
        FROM world_artifacts
        WHERE rowid NOT IN (SELECT rowid FROM world_artifacts_fts);

        UPDATE SCHEMA_VERSION SET currentVersion = 4;
    `)
}
