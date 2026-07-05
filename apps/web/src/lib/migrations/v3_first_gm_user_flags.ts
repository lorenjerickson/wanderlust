import { Database } from 'sqlite'

export const migrationId = 'v3_first_gm_user_flags'
export const schemaVersion = 3

export async function up(db: Database) {
    await db.exec(`
    ALTER TABLE users ADD COLUMN external_auth_subject TEXT;
    ALTER TABLE users ADD COLUMN is_gm INTEGER NOT NULL DEFAULT 0 CHECK (is_gm IN (0, 1));

    CREATE UNIQUE INDEX IF NOT EXISTS idx_users_external_auth_subject
      ON users(external_auth_subject)
      WHERE external_auth_subject IS NOT NULL;

    UPDATE SCHEMA_VERSION SET currentVersion = 3;
  `)
}
