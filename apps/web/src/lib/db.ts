import sqlite3 from 'sqlite3'
import { Database, open } from 'sqlite'
import path from 'path'

import { runMigrations } from './migrations/migrations'

let instance: Database | null = null
let instancePromise: Promise<Database> | null = null

async function openDb() {
  const dbPath = path.join(process.cwd(), 'local-data.sqlite')
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  })

  await db.exec('PRAGMA foreign_keys = ON;')
  await runMigrations(db)

  instance = db
  return db
}

export async function getDb() {
  if (instance) return instance

  if (!instancePromise) {
    instancePromise = openDb().catch((error) => {
      instancePromise = null
      throw error
    })
  }

  return instancePromise
}
