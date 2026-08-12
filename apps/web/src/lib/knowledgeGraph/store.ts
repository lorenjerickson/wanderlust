import { createStoreWithSchema, type Store } from '@nicia-ai/typegraph'
import { createLibsqlBackend } from '@nicia-ai/typegraph/adapters/drizzle/sqlite/libsql'

import { getLibsqlClient } from '@/lib/drizzle'

import { knowledgeGraph } from './schema'

export type KnowledgeGraphStore = Store<typeof knowledgeGraph>

let store: KnowledgeGraphStore | null = null
let storePromise: Promise<KnowledgeGraphStore> | null = null

async function openKnowledgeGraphStore() {
    const client = await getLibsqlClient()
    const { backend } = await createLibsqlBackend(client)
    const [nextStore] = await createStoreWithSchema(knowledgeGraph, backend)

    store = nextStore
    return nextStore
}

export async function getKnowledgeGraphStore() {
    if (store) return store

    if (!storePromise) {
        storePromise = openKnowledgeGraphStore().catch((error) => {
            storePromise = null
            throw error
        })
    }

    return storePromise
}
