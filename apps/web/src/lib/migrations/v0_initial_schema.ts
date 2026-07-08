import { Database } from 'sqlite'

export const migrationId = 'v0_initial_schema'
export const schemaVersion = 0

export async function up(db: Database) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS SCHEMA_VERSION (
      currentVersion NUMBER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS roles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password TEXT,
      emailAddress TEXT NOT NULL UNIQUE,
      fullName TEXT NOT NULL,
      phoneNumber TEXT NOT NULL,
      zipCode TEXT NOT NULL,
      avatar TEXT,
      createdOn TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedOn TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_roles (
      user_id TEXT NOT NULL,
      role_id TEXT NOT NULL,
      PRIMARY KEY (user_id, role_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS auth (
      username TEXT PRIMARY KEY,
      jwt TEXT NOT NULL,
      createdOn TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings_groups (
      key TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT,
      moduleId TEXT,
      settings TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS media (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      type TEXT NOT NULL,
      tags TEXT NOT NULL DEFAULT '[]',
      url TEXT NOT NULL,
      createdOn TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      createdBy TEXT,
      updatedOn TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedBy TEXT
    );

    DELETE FROM SCHEMA_VERSION;
    INSERT INTO SCHEMA_VERSION (currentVersion) VALUES (0);
  `)
}
