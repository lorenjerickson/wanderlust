import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { randomUUID } from 'node:crypto'
import { unlink } from 'node:fs/promises'

import { createClient, type Client } from '@libsql/client'
import { drizzle, type LibSQLDatabase } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'
import { eq } from 'drizzle-orm'

import * as schema from './index'

describe('Database Schema Constraints & Validation', () => {
    let client: Client
    let db: LibSQLDatabase<typeof schema>
    let dbPath: string

    beforeAll(async () => {
        dbPath = join(tmpdir(), `wanderlust-test-${randomUUID()}.sqlite`)
        client = createClient({ url: `file:${dbPath}` })
        db = drizzle(client, { schema })

        // Apply migrations
        await migrate(db, {
            migrationsFolder: resolve(__dirname, '../../../../drizzle'),
        })

        // Enable foreign keys explicitly on the connection
        await client.execute('PRAGMA foreign_keys = ON;')
    })

    afterAll(async () => {
        client.close()
        await unlink(dbPath).catch(() => undefined)
    })

    // Helper to clear table data between tests to keep them isolated
    beforeEach(async () => {
        await client.execute('DELETE FROM actor_equipment_placements;')
        await client.execute('DELETE FROM actor_items;')
        await client.execute('DELETE FROM actor_artifact_snapshots;')
        await client.execute('DELETE FROM applied_effects;')
        await client.execute('DELETE FROM actors;')
        await client.execute('DELETE FROM users;')
    })

    describe('Actor Name Uniqueness (Case-Insensitive)', () => {
        it('should block inserting two active actors with the same short name (case-insensitive)', async () => {
            // Create owner user
            const userId = randomUUID()
            await db.insert(schema.users).values({
                id: userId,
                username: 'gm_test',
                emailAddress: 'gm@test.com',
                fullName: 'Game Master',
                phoneNumber: '123456789',
                zipCode: '12345',
            })

            // Insert first actor
            await db.insert(schema.actors).values({
                id: randomUUID(),
                ownerUserId: userId,
                officialName: 'Aragorn Son of Arathorn',
                shortName: 'Aragorn',
                bioMarkdown: 'Ranger of the North',
                strength: 18,
                dexterity: 14,
                constitution: 16,
                intelligence: 12,
                wisdom: 15,
                charisma: 16,
                sanity: 10,
                baseHealth: 100,
            })

            // Try to insert second actor with same short name (different casing)
            await expect(
                db.insert(schema.actors).values({
                    id: randomUUID(),
                    ownerUserId: userId,
                    officialName: 'Aragorn King',
                    shortName: 'aragorn', // lowercased
                    bioMarkdown: 'The King of Gondor',
                    strength: 18,
                    dexterity: 14,
                    constitution: 16,
                    intelligence: 12,
                    wisdom: 15,
                    charisma: 16,
                    sanity: 10,
                    baseHealth: 100,
                })
            ).rejects.toThrow()
        })

        it('should block inserting two active actors with the same official name (case-insensitive)', async () => {
            const userId = randomUUID()
            await db.insert(schema.users).values({
                id: userId,
                username: 'gm_test2',
                emailAddress: 'gm2@test.com',
                fullName: 'Game Master 2',
                phoneNumber: '123456789',
                zipCode: '12345',
            })

            await db.insert(schema.actors).values({
                id: randomUUID(),
                ownerUserId: userId,
                officialName: 'Legolas Greenleaf',
                shortName: 'Legolas',
                bioMarkdown: 'Elf Prince',
                strength: 12,
                dexterity: 20,
                constitution: 13,
                intelligence: 14,
                wisdom: 14,
                charisma: 15,
                sanity: 10,
                baseHealth: 80,
            })

            await expect(
                db.insert(schema.actors).values({
                    id: randomUUID(),
                    ownerUserId: userId,
                    officialName: 'legolas greenleaf', // lowercased
                    shortName: 'Legolas2',
                    bioMarkdown: 'Another elf',
                    strength: 12,
                    dexterity: 20,
                    constitution: 13,
                    intelligence: 14,
                    wisdom: 14,
                    charisma: 15,
                    sanity: 10,
                    baseHealth: 80,
                })
            ).rejects.toThrow()
        })
    })

    describe('Foreign Key Cascading Behavior', () => {
        it('should delete associated actors when their owner user is deleted', async () => {
            const userId = randomUUID()
            const actorId = randomUUID()

            await db.insert(schema.users).values({
                id: userId,
                username: 'owner_user',
                emailAddress: 'owner@test.com',
                fullName: 'Owner',
                phoneNumber: '123456789',
                zipCode: '12345',
            })

            await db.insert(schema.actors).values({
                id: actorId,
                ownerUserId: userId,
                officialName: 'Gimli Son of Gloin',
                shortName: 'Gimli',
                bioMarkdown: 'Dwarf Warrior',
                strength: 18,
                dexterity: 10,
                constitution: 18,
                intelligence: 10,
                wisdom: 10,
                charisma: 10,
                sanity: 10,
                baseHealth: 110,
            })

            // Verify actor is inserted
            const inserted = await db.query.actors.findFirst({
                where: eq(schema.actors.id, actorId),
            })
            expect(inserted).toBeDefined()

            // Delete the user
            await db.delete(schema.users).where(eq(schema.users.id, userId))

            // Verify actor was cascaded deleted
            const remaining = await db.query.actors.findFirst({
                where: eq(schema.actors.id, actorId),
            })
            expect(remaining).toBeUndefined()
        })
    })

    describe('Actor Artifact Snapshot Slot Uniqueness', () => {
        it('should allow only one active talent per actor via idx_actor_one_talent index', async () => {
            const userId = randomUUID()
            const actorId = randomUUID()

            await db.insert(schema.users).values({
                id: userId,
                username: 'test_user',
                emailAddress: 'test@test.com',
                fullName: 'Test User',
                phoneNumber: '123456789',
                zipCode: '12345',
            })

            await db.insert(schema.actors).values({
                id: actorId,
                ownerUserId: userId,
                officialName: 'Gandalf the Grey',
                shortName: 'Gandalf',
                bioMarkdown: 'Wizard',
                strength: 14,
                dexterity: 12,
                constitution: 14,
                intelligence: 18,
                wisdom: 18,
                charisma: 16,
                sanity: 15,
                baseHealth: 90,
            })

            // Catalog Artifacts (representing Talents)
            const talent1Id = randomUUID()
            const talent2Id = randomUUID()
            await db.insert(schema.catalogArtifacts).values([
                {
                    id: talent1Id,
                    artifactType: 'talent',
                    name: 'Spellcasting',
                    descriptionMarkdown: 'Can cast spells',
                    createdByRole: 'admin',
                    createdAt: '2026-07-11T00:00:00Z',
                },
                {
                    id: talent2Id,
                    artifactType: 'talent',
                    name: 'Alchemy',
                    descriptionMarkdown: 'Can brew potions',
                    createdByRole: 'admin',
                },
            ])

            // Insert first talent snapshot
            await db.insert(schema.actorArtifactSnapshots).values({
                id: randomUUID(),
                actorId,
                snapshotType: 'talent',
                sourceArtifactId: talent1Id,
                sourceCatalogUpdatedAt: '2026-07-11T00:00:00Z',
                name: 'Spellcasting',
                descriptionMarkdown: 'Can cast spells',
            })

            // Try to insert second talent snapshot - should fail unique index on actorId
            await expect(
                db.insert(schema.actorArtifactSnapshots).values({
                    id: randomUUID(),
                    actorId,
                    snapshotType: 'talent',
                    sourceArtifactId: talent2Id,
                    sourceCatalogUpdatedAt: '2026-07-11T00:00:00Z',
                    name: 'Alchemy',
                    descriptionMarkdown: 'Can brew potions',
                })
            ).rejects.toThrow()
        })
    })

    describe('Actor Item Container Slot Uniqueness', () => {
        it('should prevent placing two items in the exact same container slot index', async () => {
            const userId = randomUUID()
            const actorId = randomUUID()

            await db.insert(schema.users).values({
                id: userId,
                username: 'bag_user',
                emailAddress: 'bag@test.com',
                fullName: 'Bag User',
                phoneNumber: '123456789',
                zipCode: '12345',
            })

            await db.insert(schema.actors).values({
                id: actorId,
                ownerUserId: userId,
                officialName: 'Frodo Baggins',
                shortName: 'Frodo',
                bioMarkdown: 'Ring-bearer',
                strength: 10,
                dexterity: 16,
                constitution: 14,
                intelligence: 12,
                wisdom: 14,
                charisma: 15,
                sanity: 18,
                baseHealth: 60,
            })

            // Catalog Artifacts (representing item definitions)
            const bagId = randomUUID()
            const itemId = randomUUID()
            await db.insert(schema.catalogArtifacts).values([
                {
                    id: bagId,
                    artifactType: 'item',
                    name: 'Backpack',
                    descriptionMarkdown: 'Holds stuff',
                    createdByRole: 'admin',
                },
                {
                    id: itemId,
                    artifactType: 'item',
                    name: 'Elven Bread',
                    descriptionMarkdown: 'Lembas',
                    createdByRole: 'admin',
                },
            ])

            // Create Actor Item Backpack
            const actorBagId = randomUUID()
            await db.insert(schema.actorItems).values({
                id: actorBagId,
                actorId,
                sourceArtifactId: bagId,
                sourceCatalogUpdatedAt: '2026-07-11T00:00:00Z',
                name: 'Backpack',
                descriptionMarkdown: 'Holds stuff',
                itemType: 'container',
                stackable: 0,
                maxStack: 1,
                providedSlotCount: 10,
            })

            // Place item 1 in bag slot 0
            const item1Id = randomUUID()
            await db.insert(schema.actorItems).values({
                id: item1Id,
                actorId,
                sourceArtifactId: itemId,
                sourceCatalogUpdatedAt: '2026-07-11T00:00:00Z',
                name: 'Elven Bread',
                descriptionMarkdown: 'Lembas',
                itemType: 'consumable',
                stackable: 1,
                maxStack: 10,
                containerItemId: actorBagId,
                containerSlotIndex: 0,
            })

            // Try to place another item in the same bag slot 0
            const item2Id = randomUUID()
            await expect(
                db.insert(schema.actorItems).values({
                    id: item2Id,
                    actorId,
                    sourceArtifactId: itemId,
                    sourceCatalogUpdatedAt: '2026-07-11T00:00:00Z',
                    name: 'Elven Bread 2',
                    descriptionMarkdown: 'Lembas',
                    itemType: 'consumable',
                    stackable: 1,
                    maxStack: 10,
                    containerItemId: actorBagId,
                    containerSlotIndex: 0, // same slot index
                })
            ).rejects.toThrow()
        })
    })
})
