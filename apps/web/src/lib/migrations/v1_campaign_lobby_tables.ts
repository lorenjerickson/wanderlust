import { Database } from 'sqlite'

export const migrationId = 'v1_campaign_lobby_tables'
export const schemaVersion = 1

export async function up(db: Database) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1))
    );

    CREATE TABLE IF NOT EXISTS user_player_characters (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      race TEXT,
      character_class TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS campaign_players (
      id TEXT PRIMARY KEY,
      user_player_character_id TEXT NOT NULL,
      campaign_id TEXT NOT NULL,
      FOREIGN KEY (user_player_character_id)
        REFERENCES user_player_characters(id)
        ON DELETE CASCADE,
      FOREIGN KEY (campaign_id)
        REFERENCES campaigns(id)
        ON DELETE CASCADE,
      UNIQUE (campaign_id, user_player_character_id)
    );

    UPDATE SCHEMA_VERSION SET currentVersion = 1;
  `)
}
