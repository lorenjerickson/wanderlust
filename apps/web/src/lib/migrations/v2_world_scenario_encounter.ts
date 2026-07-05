import { Database } from 'sqlite'

export const migrationId = 'v2_world_scenario_encounter'
export const schemaVersion = 2

export async function up(db: Database) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS worlds (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      map_image_url TEXT
    );

    ALTER TABLE campaigns ADD COLUMN world_id TEXT REFERENCES worlds(id) ON DELETE SET NULL;
    ALTER TABLE campaigns ADD COLUMN short_description_rich_text TEXT NOT NULL DEFAULT '';
    ALTER TABLE campaigns ADD COLUMN long_description_rich_text TEXT NOT NULL DEFAULT '';
    ALTER TABLE campaigns ADD COLUMN map_image_url TEXT;

    UPDATE campaigns
    SET short_description_rich_text = description
    WHERE short_description_rich_text = ''
      AND description IS NOT NULL
      AND description != '';

    CREATE TABLE IF NOT EXISTS scenarios (
      id TEXT PRIMARY KEY,
      campaign_id TEXT NOT NULL,
      short_description_rich_text TEXT NOT NULL DEFAULT '',
      map_image_url TEXT,
      long_description_rich_text TEXT NOT NULL DEFAULT '',
      FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS encounters (
      id TEXT PRIMARY KEY,
      scenario_id TEXT NOT NULL,
      short_description_rich_text TEXT NOT NULL DEFAULT '',
      long_description_rich_text TEXT NOT NULL DEFAULT '',
      location TEXT,
      map_image_url TEXT,
      FOREIGN KEY (scenario_id) REFERENCES scenarios(id) ON DELETE CASCADE
    );

    UPDATE SCHEMA_VERSION SET currentVersion = 2;
  `)
}
