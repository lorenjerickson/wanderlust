// @vitest-environment node

import { createClient } from '@libsql/client'
import { createStoreWithSchema } from '@nicia-ai/typegraph'
import { createLibsqlBackend } from '@nicia-ai/typegraph/adapters/drizzle/sqlite/libsql'
import { afterEach, describe, expect, it } from 'vitest'

import { knowledgeGraph } from './schema'
import {
    projectKnowledgeGraphSnapshot,
    type KnowledgeGraphSnapshot,
} from './sync'

const clients: ReturnType<typeof createClient>[] = []

async function createTestStore() {
    const client = createClient({ url: ':memory:' })
    clients.push(client)
    const { backend } = await createLibsqlBackend(client)
    const [store] = await createStoreWithSchema(knowledgeGraph, backend)
    return store
}

function snapshot(): KnowledgeGraphSnapshot {
    return {
        worlds: [
            {
                id: 'world-1',
                ownerUserId: null,
                name: 'The Turn of the Century',
                description: 'A world of occult investigation.',
                mapImageUrl: null,
            },
        ],
        campaigns: [
            {
                id: 'campaign-1',
                title: 'The First Case',
                description: 'Investigators search for Professor Ward.',
                active: 1,
                worldId: 'world-1',
                shortDescriptionRichText: 'Investigators assemble.',
                longDescriptionRichText: '',
                mapImageUrl: null,
            },
        ],
        scenarios: [
            {
                id: 'scenario-1',
                campaignId: 'campaign-1',
                shortDescriptionRichText: 'The missing professor',
                mapImageUrl: null,
                longDescriptionRichText: 'Follow the trail into the library.',
            },
        ],
        encounters: [
            {
                id: 'encounter-1',
                scenarioId: 'scenario-1',
                shortDescriptionRichText: 'A locked archive',
                longDescriptionRichText: 'Something is moving behind the door.',
                location: 'University library',
                mapImageUrl: null,
            },
        ],
        worldArtifacts: [
            {
                id: 'artifact-1',
                worldId: 'world-1',
                artifactType: 'Person',
                title: 'Professor Ward',
                descriptionMarkdown: 'A scholar who vanished.',
                mapImageUrl: null,
                createdAt: '2026-01-01T00:00:00.000Z',
                updatedAt: '2026-01-01T00:00:00.000Z',
            },
        ],
        actors: [],
        campaignParticipations: [],
    }
}

afterEach(() => {
    for (const client of clients.splice(0)) client.close()
})

describe('knowledge graph projection', () => {
    it('builds traversable links and removes stale relational edges', async () => {
        const store = await createTestStore()
        const first = snapshot()

        await projectKnowledgeGraphSnapshot(store, first)

        const neighbors = await store.algorithms.neighbors(
            { id: 'world-1', kind: 'World' },
            { edges: ['contains'], depth: 3 }
        )
        expect(neighbors.map(({ id }) => id)).toEqual(
            expect.arrayContaining([
                'campaign-1',
                'scenario-1',
                'encounter-1',
                'artifact-1',
            ])
        )

        const semanticNeighbors = await store.algorithms.neighbors(
            { id: 'campaign-1', kind: 'Campaign' },
            { edges: ['relatedTo'], depth: 1, direction: 'both' }
        )
        expect(semanticNeighbors.map(({ id }) => id)).toContain('artifact-1')

        await projectKnowledgeGraphSnapshot(store, {
            ...first,
            worldArtifacts: [{ ...first.worldArtifacts[0], worldId: null }],
        })

        const updatedNeighbors = await store.algorithms.neighbors(
            { id: 'world-1', kind: 'World' },
            { edges: ['contains'], depth: 1 }
        )
        expect(updatedNeighbors.map(({ id }) => id)).not.toContain('artifact-1')
    })
})
