export const WORLD_ARTIFACT_TYPES = [
    'World',
    'Location',
    'Campaign',
    'Scenario',
    'Encounter',
    'Creature',
    'Item',
] as const

export type WorldArtifactType = (typeof WORLD_ARTIFACT_TYPES)[number]

export type WorldArtifact = {
    id: string
    worldId?: string
    artifactType: WorldArtifactType
    title: string
    descriptionMarkdown: string
    mapImageUrl?: string
    createdAt: string
    updatedAt: string
}

export type WorldRecord = {
    id: string
    ownerUserId?: string
    name: string
    description: string
    mapImageUrl?: string
}

export type CreateWorldArtifactArgs = {
    worldId?: string
    artifactType: WorldArtifactType
    title: string
    descriptionMarkdown?: string
    mapImageUrl?: string
}

export type UpdateWorldArtifactArgs = Partial<CreateWorldArtifactArgs> & {
    id: string
}

export type FindWorldArtifactsArgs = {
    worldId?: string
    query?: string
}

export type WorldArtifactParentContext = {
    artifactType: string
    title: string
    descriptionMarkdown: string
}

export type GenerateWorldArtifactDraftArgs = {
    brief: string
    artifactType: string
    parentArtifacts?: WorldArtifactParentContext[]
    existingTitle?: string
    existingDescriptionMarkdown?: string
    model?: string
}

export type WorldArtifactDraft = {
    title: string
    artifactType: string
    descriptionMarkdown: string
    mapPrompt: string
    coherenceNotes: string[]
}

export type UploadWorldArtifactImageArgs = {
    artifactType: WorldArtifactType
    artifactTitle: string
    file: File
}

export type WorldDataServices = {
    findWorldArtifacts: (
        args?: FindWorldArtifactsArgs
    ) => Promise<WorldArtifact[]>
    findAllWorlds: () => Promise<WorldRecord[]>
}

export type WorldArtifactEditorServices = {
    findWorldArtifacts: (
        args?: FindWorldArtifactsArgs
    ) => Promise<WorldArtifact[]>
    findWorldArtifactById: (id: string) => Promise<WorldArtifact | null>
    createWorldArtifact: (
        args: CreateWorldArtifactArgs
    ) => Promise<WorldArtifact>
    updateWorldArtifact: (
        args: UpdateWorldArtifactArgs
    ) => Promise<WorldArtifact | null>
    generateWorldArtifactDraft: (
        args: GenerateWorldArtifactDraftArgs
    ) => Promise<WorldArtifactDraft>
    uploadWorldArtifactImage: (
        args: UploadWorldArtifactImageArgs
    ) => Promise<string>
}

export type WorkspaceServices = WorldDataServices &
    WorldArtifactEditorServices
