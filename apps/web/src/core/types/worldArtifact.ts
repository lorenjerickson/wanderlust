export const WORLD_ARTIFACT_TYPES = [
    'World',
    'Campaign',
    'Scenario',
    'Encounter',
    'Creature',
    'Item',
] as const

export type WorldArtifactType = (typeof WORLD_ARTIFACT_TYPES)[number]
