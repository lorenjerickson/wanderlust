'use server'

import { readFile } from 'fs/promises'
import path from 'path'

import OpenAI from 'openai'

type PromptName =
    | 'world'
    | 'campaign'
    | 'scenario'
    | 'encounter'
    | 'creature'
    | 'item'
    | 'asset'
    | 'world-artifact'

export type GenerationContext = {
    brief: string
    world?: string
    campaign?: string
    scenario?: string
    encounter?: string
    tone?: string
    genre?: string
    system?: string
    constraints?: string[]
}

export type WorldDraft = {
    name: string
    description: string
    regions: string[]
    factions: string[]
    mysteries: string[]
    adventureHooks: string[]
}

export type CampaignDraft = {
    title: string
    description: string
    shortDescriptionRichText: string
    longDescriptionRichText: string
    centralConflict: string
    playerHooks: string[]
    importantLocations: string[]
    factions: string[]
}

export type ScenarioDraft = {
    shortDescriptionRichText: string
    longDescriptionRichText: string
    objectives: string[]
    stakes: string
    scenes: string[]
    clues: string[]
    complications: string[]
    outcomes: string[]
}

export type EncounterDraft = {
    location: string
    shortDescriptionRichText: string
    longDescriptionRichText: string
    dramaticQuestion: string
    terrain: string[]
    participants: string[]
    approaches: string[]
    complications: string[]
    rewards: string[]
}

export type AssetPromptDraft = {
    title: string
    assetType: string
    prompt: string
    negativePrompt: string
    usageNotes: string[]
}

export type WorldArtifactDraft = {
    title: string
    artifactType: string
    descriptionMarkdown: string
    mapPrompt: string
    coherenceNotes: string[]
}

export type GeneratedArtAsset = AssetPromptDraft & {
    imageBase64: string
    mimeType: string
    model: string
    size: string
}

type GenerateTextDraftArgs = GenerationContext & {
    model?: string
}

export type GenerateAssetPromptArgs = GenerationContext & {
    assetType?: string
    model?: string
}

export type GenerateArtArgs = GenerateAssetPromptArgs & {
    imageModel?: string
    size?: '1024x1024' | '1024x1536' | '1536x1024' | 'auto'
    quality?: 'low' | 'medium' | 'high' | 'auto'
    background?: 'transparent' | 'opaque' | 'auto'
    outputFormat?: 'png' | 'jpeg' | 'webp'
}

export type GenerateWorldArtifactDraftArgs = GenerationContext & {
    artifactType: string
    parentArtifacts?: WorldArtifactParentContext[]
    existingTitle?: string
    existingDescriptionMarkdown?: string
    model?: string
}

export type WorldArtifactParentContext = {
    artifactType: string
    title: string
    descriptionMarkdown: string
}

type JsonSchema = {
    name: string
    schema: {
        [key: string]: unknown
    }
}

const TEXT_MODEL = process.env.OPENAI_TEXT_MODEL ?? 'gpt-5.5'
const IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL ?? 'gpt-image-2'
const PARENT_ARTIFACT_CONTEXT_CHARACTER_LIMIT = 6000

let openaiClient: OpenAI | null = null

function getOpenAIClient() {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY is required to use AI generation.')
    }

    openaiClient ??= new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })

    return openaiClient
}

async function readPrompt(name: PromptName) {
    const promptPath = path.join(process.cwd(), 'src', 'prompts', `${name}.md`)
    const prompt = await readFile(promptPath, 'utf8')

    if (!prompt.trim()) {
        throw new Error(`Prompt file is empty: ${promptPath}`)
    }

    return prompt
}

function buildContextInput(args: GenerationContext) {
    return JSON.stringify(
        {
            brief: args.brief,
            world: args.world,
            campaign: args.campaign,
            scenario: args.scenario,
            encounter: args.encounter,
            tone: args.tone,
            genre: args.genre,
            system: args.system,
            constraints: args.constraints ?? [],
        },
        null,
        2
    )
}

function getWorldArtifactPromptName(artifactType: string): PromptName | null {
    const normalizedType = artifactType.toLowerCase()

    if (
        normalizedType === 'world' ||
        normalizedType === 'campaign' ||
        normalizedType === 'scenario' ||
        normalizedType === 'encounter' ||
        normalizedType === 'creature' ||
        normalizedType === 'item'
    ) {
        return normalizedType as PromptName
    }

    return null
}

function formatParentArtifactContext(
    parentArtifacts: WorldArtifactParentContext[] = []
) {
    if (parentArtifacts.length === 0) {
        return null
    }

    return [
        'Selected parent artifact context:',
        ...parentArtifacts.map((parentArtifact) =>
            [
                `## ${parentArtifact.artifactType}: ${parentArtifact.title}`,
                limitParentArtifactContext(parentArtifact.descriptionMarkdown),
            ]
                .filter(Boolean)
                .join('\n\n')
        ),
    ].join('\n\n')
}

function limitParentArtifactContext(markdown: string) {
    const normalizedMarkdown = markdown.trim()

    if (normalizedMarkdown.length <= PARENT_ARTIFACT_CONTEXT_CHARACTER_LIMIT) {
        return normalizedMarkdown
    }

    return `${normalizedMarkdown.slice(
        0,
        PARENT_ARTIFACT_CONTEXT_CHARACTER_LIMIT
    )}\n\n[Parent artifact context truncated. If additional continuity details are required, ask the user for a concise summary of this artifact before regenerating.]`
}

function parseJsonResponse<T>(text: string): T {
    try {
        return JSON.parse(text) as T
    } catch {
        throw new Error('AI response was not valid JSON.')
    }
}

async function generateStructuredDraft<T>({
    promptName,
    schema,
    args,
    instructions,
}: {
    promptName: PromptName
    schema: JsonSchema
    args: GenerateTextDraftArgs
    instructions?: string
}) {
    const client = getOpenAIClient()
    const promptInstructions = instructions ?? (await readPrompt(promptName))
    const response = await client.responses.create({
        model: args.model ?? TEXT_MODEL,
        instructions: promptInstructions,
        input: buildContextInput(args),
        text: {
            format: {
                type: 'json_schema',
                name: schema.name,
                schema: schema.schema,
                strict: true,
            },
            verbosity: 'medium',
        },
    })

    return parseJsonResponse<T>(response.output_text)
}

function stringArraySchema(description: string) {
    return {
        type: 'array',
        description,
        items: { type: 'string' },
    }
}

const worldSchema: JsonSchema = {
    name: 'wanderlust_world_draft',
    schema: {
        type: 'object',
        additionalProperties: false,
        required: [
            'name',
            'description',
            'regions',
            'factions',
            'mysteries',
            'adventureHooks',
        ],
        properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            regions: stringArraySchema('Distinct regions or landmarks.'),
            factions: stringArraySchema('Factions with goals and tensions.'),
            mysteries: stringArraySchema('Unanswered world mysteries.'),
            adventureHooks: stringArraySchema('Campaign-starting hooks.'),
        },
    },
}

const campaignSchema: JsonSchema = {
    name: 'wanderlust_campaign_draft',
    schema: {
        type: 'object',
        additionalProperties: false,
        required: [
            'title',
            'description',
            'shortDescriptionRichText',
            'longDescriptionRichText',
            'centralConflict',
            'playerHooks',
            'importantLocations',
            'factions',
        ],
        properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            shortDescriptionRichText: { type: 'string' },
            longDescriptionRichText: { type: 'string' },
            centralConflict: { type: 'string' },
            playerHooks: stringArraySchema('Player-facing campaign hooks.'),
            importantLocations: stringArraySchema('Locations likely to recur.'),
            factions: stringArraySchema('Campaign factions and agendas.'),
        },
    },
}

const scenarioSchema: JsonSchema = {
    name: 'wanderlust_scenario_draft',
    schema: {
        type: 'object',
        additionalProperties: false,
        required: [
            'shortDescriptionRichText',
            'longDescriptionRichText',
            'objectives',
            'stakes',
            'scenes',
            'clues',
            'complications',
            'outcomes',
        ],
        properties: {
            shortDescriptionRichText: { type: 'string' },
            longDescriptionRichText: { type: 'string' },
            objectives: stringArraySchema('Concrete scenario objectives.'),
            stakes: { type: 'string' },
            scenes: stringArraySchema('Runnable scenes or beats.'),
            clues: stringArraySchema('Discoverable clues and information.'),
            complications: stringArraySchema('Complications that shift play.'),
            outcomes: stringArraySchema('Likely outcomes or consequences.'),
        },
    },
}

const encounterSchema: JsonSchema = {
    name: 'wanderlust_encounter_draft',
    schema: {
        type: 'object',
        additionalProperties: false,
        required: [
            'location',
            'shortDescriptionRichText',
            'longDescriptionRichText',
            'dramaticQuestion',
            'terrain',
            'participants',
            'approaches',
            'complications',
            'rewards',
        ],
        properties: {
            location: { type: 'string' },
            shortDescriptionRichText: { type: 'string' },
            longDescriptionRichText: { type: 'string' },
            dramaticQuestion: { type: 'string' },
            terrain: stringArraySchema('Interactive terrain features.'),
            participants: stringArraySchema('NPCs, creatures, or hazards.'),
            approaches: stringArraySchema(
                'Non-prescriptive player approaches.'
            ),
            complications: stringArraySchema('Twists and changing pressures.'),
            rewards: stringArraySchema('Rewards, discoveries, or leverage.'),
        },
    },
}

const assetPromptSchema: JsonSchema = {
    name: 'wanderlust_asset_prompt',
    schema: {
        type: 'object',
        additionalProperties: false,
        required: [
            'title',
            'assetType',
            'prompt',
            'negativePrompt',
            'usageNotes',
        ],
        properties: {
            title: { type: 'string' },
            assetType: { type: 'string' },
            prompt: { type: 'string' },
            negativePrompt: { type: 'string' },
            usageNotes: stringArraySchema(
                'How to use the asset in the app or at the table.'
            ),
        },
    },
}

const worldArtifactSchema: JsonSchema = {
    name: 'wanderlust_world_artifact_draft',
    schema: {
        type: 'object',
        additionalProperties: false,
        required: [
            'title',
            'artifactType',
            'descriptionMarkdown',
            'mapPrompt',
            'coherenceNotes',
        ],
        properties: {
            title: { type: 'string' },
            artifactType: { type: 'string' },
            descriptionMarkdown: { type: 'string' },
            mapPrompt: { type: 'string' },
            coherenceNotes: stringArraySchema(
                'Continuity notes for future campaigns and scenes.'
            ),
        },
    },
}

export async function generateWorldDraft(args: GenerateTextDraftArgs) {
    return generateStructuredDraft<WorldDraft>({
        promptName: 'world',
        schema: worldSchema,
        args,
    })
}

export async function generateCampaignDraft(args: GenerateTextDraftArgs) {
    return generateStructuredDraft<CampaignDraft>({
        promptName: 'campaign',
        schema: campaignSchema,
        args,
    })
}

export async function generateScenarioDraft(args: GenerateTextDraftArgs) {
    return generateStructuredDraft<ScenarioDraft>({
        promptName: 'scenario',
        schema: scenarioSchema,
        args,
    })
}

export async function generateEncounterDraft(args: GenerateTextDraftArgs) {
    return generateStructuredDraft<EncounterDraft>({
        promptName: 'encounter',
        schema: encounterSchema,
        args,
    })
}

export async function generateAssetPrompt({
    assetType = 'general asset',
    ...args
}: GenerateAssetPromptArgs) {
    return generateStructuredDraft<AssetPromptDraft>({
        promptName: 'asset',
        schema: assetPromptSchema,
        args: {
            ...args,
            brief: `${args.brief}\n\nAsset type: ${assetType}`,
        },
    })
}

export async function generateWorldArtifactDraft({
    artifactType,
    parentArtifacts,
    existingTitle,
    existingDescriptionMarkdown,
    ...args
}: GenerateWorldArtifactDraftArgs) {
    const assetPrompt = await readPrompt('asset')
    const artifactPrompt = await readPrompt('world-artifact')
    const typePromptName = getWorldArtifactPromptName(artifactType)
    const typePrompt = typePromptName ? await readPrompt(typePromptName) : null
    const parentContext = formatParentArtifactContext(parentArtifacts)

    return generateStructuredDraft<WorldArtifactDraft>({
        promptName: 'world-artifact',
        schema: worldArtifactSchema,
        instructions: [assetPrompt, artifactPrompt, typePrompt]
            .filter(Boolean)
            .join('\n\n'),
        args: {
            ...args,
            brief: [
                args.brief,
                `Artifact type: ${artifactType}`,
                parentContext,
                existingTitle ? `Existing title: ${existingTitle}` : null,
                existingDescriptionMarkdown
                    ? `Existing Markdown:\n${existingDescriptionMarkdown}`
                    : null,
            ]
                .filter(Boolean)
                .join('\n\n'),
        },
    })
}

export async function generateTokenArt(args: GenerateArtArgs) {
    return generateAssetArt({
        ...args,
        assetType: args.assetType ?? 'token art',
    })
}

export async function generatePortraitArt(args: GenerateArtArgs) {
    return generateAssetArt({
        ...args,
        assetType: args.assetType ?? 'portrait art',
    })
}

export async function generateAssetArt({
    imageModel = IMAGE_MODEL,
    size = '1024x1024',
    quality = 'auto',
    background = 'auto',
    outputFormat = 'png',
    ...args
}: GenerateArtArgs): Promise<GeneratedArtAsset> {
    const promptDraft = await generateAssetPrompt(args)
    const client = getOpenAIClient()
    const response = await client.images.generate({
        model: imageModel,
        prompt: promptDraft.prompt,
        n: 1,
        size,
        quality,
        background,
        output_format: outputFormat,
    })
    const image = response.data?.[0]

    if (!image?.b64_json) {
        throw new Error('Image generation did not return base64 image data.')
    }

    return {
        ...promptDraft,
        imageBase64: image.b64_json,
        mimeType: `image/${outputFormat}`,
        model: imageModel,
        size,
    }
}
