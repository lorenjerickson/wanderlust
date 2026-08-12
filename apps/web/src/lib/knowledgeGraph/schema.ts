import {
    defineEdge,
    defineGraph,
    defineNode,
    inverseOf,
} from '@nicia-ai/typegraph'
import { z } from 'zod'

export const WorldNode = defineNode('World', {
    schema: z.object({
        name: z.string().min(1),
        description: z.string(),
    }),
})

export const CampaignNode = defineNode('Campaign', {
    schema: z.object({
        title: z.string().min(1),
        description: z.string(),
        active: z.boolean(),
    }),
})

export const ScenarioNode = defineNode('Scenario', {
    schema: z.object({
        title: z.string(),
        description: z.string(),
    }),
})

export const EncounterNode = defineNode('Encounter', {
    schema: z.object({
        title: z.string(),
        description: z.string(),
        location: z.string().optional(),
    }),
})

export const WorldArtifactNode = defineNode('WorldArtifact', {
    schema: z.object({
        artifactType: z.string().min(1),
        title: z.string().min(1),
        description: z.string(),
    }),
})

export const ActorNode = defineNode('Actor', {
    schema: z.object({
        name: z.string().min(1),
        description: z.string(),
        status: z.string(),
    }),
})

const contentNodes = [
    WorldNode,
    CampaignNode,
    ScenarioNode,
    EncounterNode,
    WorldArtifactNode,
    ActorNode,
] as const

export const containsEdge = defineEdge('contains')
export const partOfEdge = defineEdge('partOf')
export const participatesInEdge = defineEdge('participatesIn')
export const hasParticipantEdge = defineEdge('hasParticipant')
export const relatedToEdge = defineEdge('relatedTo', {
    schema: z.object({
        relationship: z.string().min(1),
        confidence: z.number().min(0).max(1).default(1),
        source: z.enum(['system', 'user', 'agent']).default('system'),
    }),
})

export const knowledgeGraph = defineGraph({
    id: 'wanderlust_content',
    defaults: {
        onNodeDelete: 'cascade',
        temporalMode: 'current',
    },
    nodes: {
        World: { type: WorldNode },
        Campaign: { type: CampaignNode },
        Scenario: { type: ScenarioNode },
        Encounter: { type: EncounterNode },
        WorldArtifact: { type: WorldArtifactNode },
        Actor: { type: ActorNode },
    },
    edges: {
        contains: {
            type: containsEdge,
            from: [WorldNode, CampaignNode, ScenarioNode],
            to: [CampaignNode, ScenarioNode, EncounterNode, WorldArtifactNode],
        },
        partOf: {
            type: partOfEdge,
            from: [
                CampaignNode,
                ScenarioNode,
                EncounterNode,
                WorldArtifactNode,
            ],
            to: [WorldNode, CampaignNode, ScenarioNode],
        },
        participatesIn: {
            type: participatesInEdge,
            from: [ActorNode],
            to: [CampaignNode],
        },
        hasParticipant: {
            type: hasParticipantEdge,
            from: [CampaignNode],
            to: [ActorNode],
        },
        relatedTo: {
            type: relatedToEdge,
            from: contentNodes,
            to: contentNodes,
        },
    },
    ontology: [
        inverseOf(containsEdge, partOfEdge),
        inverseOf(participatesInEdge, hasParticipantEdge),
        inverseOf(relatedToEdge, relatedToEdge),
    ],
})

export type KnowledgeGraphEntityKind = keyof typeof knowledgeGraph.nodes

export type KnowledgeGraphEntityRef = {
    id: string
    kind: KnowledgeGraphEntityKind
}
