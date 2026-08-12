import { and, inArray, isNull } from 'drizzle-orm'

import {
    actors,
    campaignParticipations,
    campaigns,
    encounters,
    scenarios,
    worldArtifacts,
    worlds,
} from '@/lib/db/schema'
import { getDrizzleDb } from '@/lib/drizzle'

import type {
    KnowledgeGraphEntityKind,
    KnowledgeGraphEntityRef,
} from './schema'
import { getKnowledgeGraphStore, type KnowledgeGraphStore } from './store'

export type KnowledgeGraphSnapshot = {
    worlds: (typeof worlds.$inferSelect)[]
    campaigns: (typeof campaigns.$inferSelect)[]
    scenarios: (typeof scenarios.$inferSelect)[]
    encounters: (typeof encounters.$inferSelect)[]
    worldArtifacts: (typeof worldArtifacts.$inferSelect)[]
    actors: (typeof actors.$inferSelect)[]
    campaignParticipations: Pick<
        typeof campaignParticipations.$inferSelect,
        'actorId' | 'campaignId'
    >[]
}

type StructuralEdge = {
    from: KnowledgeGraphEntityRef
    to: KnowledgeGraphEntityRef
}

type NodeSyncCollection = {
    find(): Promise<{ id: string }[]>
    delete(id: never): Promise<void>
}

type StructuralEdgeCollection = {
    find(): Promise<
        {
            id: unknown
            fromKind: string
            fromId: string
            toKind: string
            toId: string
        }[]
    >
    delete(id: never): Promise<void>
    getOrCreateByEndpoints(
        from: KnowledgeGraphEntityRef,
        to: KnowledgeGraphEntityRef,
        props: Record<string, never>
    ): Promise<unknown>
}

type SemanticDocument = {
    ref: KnowledgeGraphEntityRef
    label: string
    content: string
}

function summarize(value: string, fallback: string) {
    const plainText = value
        .replace(/<[^>]*>/g, ' ')
        .replace(/[#*_`>\[\]()]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

    return plainText.slice(0, 80) || fallback
}

async function reconcileNodes(
    collection: NodeSyncCollection,
    currentIds: ReadonlySet<string>
) {
    const existing = await collection.find()

    for (const node of existing) {
        if (!currentIds.has(node.id)) {
            await collection.delete(node.id as never)
        }
    }
}

async function reconcileStructuralEdges(
    collection: StructuralEdgeCollection,
    desired: StructuralEdge[]
) {
    const desiredKeys = new Set(
        desired.map(
            ({ from, to }) => `${from.kind}:${from.id}->${to.kind}:${to.id}`
        )
    )
    const existing = await collection.find()

    for (const edge of existing) {
        const key = `${edge.fromKind}:${edge.fromId}->${edge.toKind}:${edge.toId}`
        if (!desiredKeys.has(key)) {
            await collection.delete(edge.id as never)
        }
    }

    for (const { from, to } of desired) {
        await collection.getOrCreateByEndpoints(from, to, {})
    }
}

function normalizeSemanticText(value: string) {
    return value
        .replace(/<[^>]*>/g, ' ')
        .replace(/[#*_`>\[\]()]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toLocaleLowerCase()
}

function semanticPairKey(
    first: KnowledgeGraphEntityRef,
    second: KnowledgeGraphEntityRef
) {
    return [`${first.kind}:${first.id}`, `${second.kind}:${second.id}`]
        .sort()
        .join('<->')
}

async function reconcileMentionEdges(
    store: KnowledgeGraphStore,
    documents: SemanticDocument[]
) {
    const desired = new Map<
        string,
        { from: KnowledgeGraphEntityRef; to: KnowledgeGraphEntityRef }
    >()

    for (const source of documents) {
        const content = normalizeSemanticText(source.content)
        if (!content) continue

        for (const target of documents) {
            if (
                source.ref.id === target.ref.id &&
                source.ref.kind === target.ref.kind
            ) {
                continue
            }

            const label = normalizeSemanticText(target.label)
            if (label.length < 4 || !content.includes(label)) continue

            const [from, to] = [source.ref, target.ref].sort((left, right) =>
                `${left.kind}:${left.id}`.localeCompare(
                    `${right.kind}:${right.id}`
                )
            )
            desired.set(semanticPairKey(from, to), { from, to })
        }
    }

    const existing = await store.edges.relatedTo.find()
    for (const edge of existing) {
        if (edge.source !== 'system' || edge.relationship !== 'mentions')
            continue

        const key = semanticPairKey(
            { id: edge.fromId, kind: edge.fromKind },
            { id: edge.toId, kind: edge.toKind }
        )
        if (!desired.has(key)) await store.edges.relatedTo.delete(edge.id)
    }

    for (const { from, to } of desired.values()) {
        await store.edges.relatedTo.getOrCreateByEndpoints(
            from,
            to,
            { relationship: 'mentions', confidence: 1, source: 'system' },
            { matchOn: ['relationship', 'source'], ifExists: 'update' }
        )
    }
}

export async function readKnowledgeGraphSnapshot(): Promise<KnowledgeGraphSnapshot> {
    const db = await getDrizzleDb()
    const [
        worldRows,
        campaignRows,
        scenarioRows,
        encounterRows,
        artifactRows,
        actorRows,
        participationRows,
    ] = await Promise.all([
        db.select().from(worlds),
        db.select().from(campaigns),
        db.select().from(scenarios),
        db.select().from(encounters),
        db.select().from(worldArtifacts),
        db
            .select()
            .from(actors)
            .where(
                and(
                    inArray(actors.status, ['draft', 'active']),
                    isNull(actors.deletedAt)
                )
            ),
        db
            .select({
                actorId: campaignParticipations.actorId,
                campaignId: campaignParticipations.campaignId,
            })
            .from(campaignParticipations)
            .where(
                and(
                    isNull(campaignParticipations.deletedAt),
                    isNull(campaignParticipations.leftAt)
                )
            ),
    ])

    return {
        worlds: worldRows,
        campaigns: campaignRows,
        scenarios: scenarioRows,
        encounters: encounterRows,
        worldArtifacts: artifactRows,
        actors: actorRows,
        campaignParticipations: participationRows,
    }
}

export async function projectKnowledgeGraphSnapshot(
    store: KnowledgeGraphStore,
    snapshot: KnowledgeGraphSnapshot
) {
    const worldNodes = new Map(
        await Promise.all(
            snapshot.worlds.map(async (world) => {
                const node = await store.nodes.World.upsertById(world.id, {
                    name: world.name,
                    description: world.description,
                })
                return [world.id, node] as const
            })
        )
    )
    const campaignNodes = new Map(
        await Promise.all(
            snapshot.campaigns.map(async (campaign) => {
                const node = await store.nodes.Campaign.upsertById(
                    campaign.id,
                    {
                        title: campaign.title,
                        description:
                            campaign.longDescriptionRichText ||
                            campaign.description,
                        active: Boolean(campaign.active),
                    }
                )
                return [campaign.id, node] as const
            })
        )
    )
    const scenarioNodes = new Map(
        await Promise.all(
            snapshot.scenarios.map(async (scenario) => {
                const node = await store.nodes.Scenario.upsertById(
                    scenario.id,
                    {
                        title: summarize(
                            scenario.shortDescriptionRichText,
                            'Untitled scenario'
                        ),
                        description:
                            scenario.longDescriptionRichText ||
                            scenario.shortDescriptionRichText,
                    }
                )
                return [scenario.id, node] as const
            })
        )
    )
    const encounterNodes = new Map(
        await Promise.all(
            snapshot.encounters.map(async (encounter) => {
                const node = await store.nodes.Encounter.upsertById(
                    encounter.id,
                    {
                        title: summarize(
                            encounter.shortDescriptionRichText,
                            encounter.location || 'Untitled encounter'
                        ),
                        description:
                            encounter.longDescriptionRichText ||
                            encounter.shortDescriptionRichText,
                        location: encounter.location ?? undefined,
                    }
                )
                return [encounter.id, node] as const
            })
        )
    )
    const artifactNodes = new Map(
        await Promise.all(
            snapshot.worldArtifacts.map(async (artifact) => {
                const node = await store.nodes.WorldArtifact.upsertById(
                    artifact.id,
                    {
                        artifactType: artifact.artifactType,
                        title: artifact.title,
                        description: artifact.descriptionMarkdown,
                    }
                )
                return [artifact.id, node] as const
            })
        )
    )
    const actorNodes = new Map(
        await Promise.all(
            snapshot.actors.map(async (actor) => {
                const node = await store.nodes.Actor.upsertById(actor.id, {
                    name: actor.officialName,
                    description: actor.bioMarkdown,
                    status: actor.status,
                })
                return [actor.id, node] as const
            })
        )
    )

    const contains: StructuralEdge[] = []
    for (const campaign of snapshot.campaigns) {
        const from = campaign.worldId
            ? worldNodes.get(campaign.worldId)
            : undefined
        const to = campaignNodes.get(campaign.id)
        if (from && to) contains.push({ from, to })
    }
    for (const artifact of snapshot.worldArtifacts) {
        const from = artifact.worldId
            ? worldNodes.get(artifact.worldId)
            : undefined
        const to = artifactNodes.get(artifact.id)
        if (from && to) contains.push({ from, to })
    }
    for (const scenario of snapshot.scenarios) {
        const from = campaignNodes.get(scenario.campaignId)
        const to = scenarioNodes.get(scenario.id)
        if (from && to) contains.push({ from, to })
    }
    for (const encounter of snapshot.encounters) {
        const from = scenarioNodes.get(encounter.scenarioId)
        const to = encounterNodes.get(encounter.id)
        if (from && to) contains.push({ from, to })
    }

    await reconcileStructuralEdges(
        store.edges.contains as unknown as StructuralEdgeCollection,
        contains
    )

    const participations: StructuralEdge[] = []
    for (const participation of snapshot.campaignParticipations) {
        const from = actorNodes.get(participation.actorId)
        const to = campaignNodes.get(participation.campaignId)
        if (from && to) participations.push({ from, to })
    }
    await reconcileStructuralEdges(
        store.edges.participatesIn as unknown as StructuralEdgeCollection,
        participations
    )

    await reconcileMentionEdges(store, [
        ...snapshot.worlds.map((world) => ({
            ref: { id: world.id, kind: 'World' as const },
            label: world.name,
            content: world.description,
        })),
        ...snapshot.campaigns.map((campaign) => ({
            ref: { id: campaign.id, kind: 'Campaign' as const },
            label: campaign.title,
            content: `${campaign.description} ${campaign.shortDescriptionRichText} ${campaign.longDescriptionRichText}`,
        })),
        ...snapshot.scenarios.map((scenario) => ({
            ref: { id: scenario.id, kind: 'Scenario' as const },
            label: summarize(
                scenario.shortDescriptionRichText,
                'Untitled scenario'
            ),
            content: `${scenario.shortDescriptionRichText} ${scenario.longDescriptionRichText}`,
        })),
        ...snapshot.encounters.map((encounter) => ({
            ref: { id: encounter.id, kind: 'Encounter' as const },
            label: summarize(
                encounter.shortDescriptionRichText,
                encounter.location || 'Untitled encounter'
            ),
            content: `${encounter.shortDescriptionRichText} ${encounter.longDescriptionRichText} ${encounter.location ?? ''}`,
        })),
        ...snapshot.worldArtifacts.map((artifact) => ({
            ref: { id: artifact.id, kind: 'WorldArtifact' as const },
            label: artifact.title,
            content: artifact.descriptionMarkdown,
        })),
        ...snapshot.actors.map((actor) => ({
            ref: { id: actor.id, kind: 'Actor' as const },
            label: actor.officialName,
            content: actor.bioMarkdown,
        })),
    ])

    await reconcileNodes(
        store.nodes.World as unknown as NodeSyncCollection,
        new Set(snapshot.worlds.map(({ id }) => id))
    )
    await reconcileNodes(
        store.nodes.Campaign as unknown as NodeSyncCollection,
        new Set(snapshot.campaigns.map(({ id }) => id))
    )
    await reconcileNodes(
        store.nodes.Scenario as unknown as NodeSyncCollection,
        new Set(snapshot.scenarios.map(({ id }) => id))
    )
    await reconcileNodes(
        store.nodes.Encounter as unknown as NodeSyncCollection,
        new Set(snapshot.encounters.map(({ id }) => id))
    )
    await reconcileNodes(
        store.nodes.WorldArtifact as unknown as NodeSyncCollection,
        new Set(snapshot.worldArtifacts.map(({ id }) => id))
    )
    await reconcileNodes(
        store.nodes.Actor as unknown as NodeSyncCollection,
        new Set(snapshot.actors.map(({ id }) => id))
    )
}

let syncTail: Promise<void> = Promise.resolve()

export function synchronizeKnowledgeGraph() {
    const nextSync = syncTail
        .catch(() => undefined)
        .then(async () => {
            const [store, snapshot] = await Promise.all([
                getKnowledgeGraphStore(),
                readKnowledgeGraphSnapshot(),
            ])
            await projectKnowledgeGraphSnapshot(store, snapshot)
        })

    syncTail = nextSync
    return nextSync
}

async function getNode(ref: KnowledgeGraphEntityRef) {
    const store = await getKnowledgeGraphStore()

    switch (ref.kind) {
        case 'World':
            return store.nodes.World.getById(ref.id as never)
        case 'Campaign':
            return store.nodes.Campaign.getById(ref.id as never)
        case 'Scenario':
            return store.nodes.Scenario.getById(ref.id as never)
        case 'Encounter':
            return store.nodes.Encounter.getById(ref.id as never)
        case 'WorldArtifact':
            return store.nodes.WorldArtifact.getById(ref.id as never)
        case 'Actor':
            return store.nodes.Actor.getById(ref.id as never)
    }
}

export async function connectRelatedEntities(
    first: KnowledgeGraphEntityRef,
    second: KnowledgeGraphEntityRef,
    relationship: string,
    options: {
        confidence?: number
        source?: 'system' | 'user' | 'agent'
    } = {}
) {
    await synchronizeKnowledgeGraph()
    const store = await getKnowledgeGraphStore()
    const [fromRef, toRef] = [
        `${first.kind}:${first.id}`,
        `${second.kind}:${second.id}`,
    ].sort()
    const from = await getNode(
        fromRef === `${first.kind}:${first.id}` ? first : second
    )
    const to = await getNode(
        toRef === `${second.kind}:${second.id}` ? second : first
    )

    if (!from || !to) {
        throw new Error('Both entities must exist before they can be connected')
    }

    return store.edges.relatedTo.getOrCreateByEndpoints(
        from,
        to,
        {
            relationship,
            confidence: options.confidence ?? 1,
            source: options.source ?? 'user',
        },
        { matchOn: ['relationship', 'source'], ifExists: 'update' }
    )
}

const traversableEdges = [
    'contains',
    'partOf',
    'participatesIn',
    'hasParticipant',
    'relatedTo',
] as const

export async function findRelatedEntities(
    entity: KnowledgeGraphEntityRef,
    depth = 1
) {
    await synchronizeKnowledgeGraph()
    const store = await getKnowledgeGraphStore()

    return store.algorithms.neighbors(entity, {
        edges: traversableEdges,
        depth,
        direction: 'both',
    }) as Promise<
        readonly (KnowledgeGraphEntityRef & {
            depth: number
        })[]
    >
}

export async function findKnowledgeGraphPath(
    from: KnowledgeGraphEntityRef,
    to: KnowledgeGraphEntityRef,
    maxHops = 10
) {
    await synchronizeKnowledgeGraph()
    const store = await getKnowledgeGraphStore()

    return store.algorithms.shortestPath(from, to, {
        edges: traversableEdges,
        maxHops,
        direction: 'both',
    }) as Promise<
        | {
              nodes: readonly KnowledgeGraphEntityRef[]
              depth: number
          }
        | undefined
    >
}

export function isKnowledgeGraphEntityKind(
    value: string
): value is KnowledgeGraphEntityKind {
    return [
        'World',
        'Campaign',
        'Scenario',
        'Encounter',
        'WorldArtifact',
        'Actor',
    ].includes(value)
}
