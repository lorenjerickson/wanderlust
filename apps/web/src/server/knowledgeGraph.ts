'use server'

import {
    connectRelatedEntities,
    findKnowledgeGraphPath,
    findRelatedEntities,
    type KnowledgeGraphEntityRef,
} from '@/lib/knowledgeGraph'

export async function relateKnowledgeGraphEntities(
    first: KnowledgeGraphEntityRef,
    second: KnowledgeGraphEntityRef,
    relationship: string,
    options?: {
        confidence?: number
        source?: 'user' | 'agent'
    }
) {
    const result = await connectRelatedEntities(
        first,
        second,
        relationship,
        options
    )

    return result.edge
}

export async function getRelatedKnowledgeGraphEntities(
    entity: KnowledgeGraphEntityRef,
    depth = 1
) {
    return findRelatedEntities(entity, depth)
}

export async function getKnowledgeGraphPath(
    from: KnowledgeGraphEntityRef,
    to: KnowledgeGraphEntityRef,
    maxHops = 10
) {
    return findKnowledgeGraphPath(from, to, maxHops)
}
