'use client'

import {
    IconArrowLeft,
    IconBulb,
    IconChevronDown,
    IconFileText,
    IconPlus,
    IconSearch,
    IconSparkles,
} from '@tabler/icons-react'
import { useEffect, useMemo, useState, useTransition } from 'react'

import {
    WORLD_ARTIFACT_TYPES,
    type WorldArtifact,
    type WorldArtifactEditorServices,
    type WorldArtifactType,
    type WorldRecord,
} from '@wanderlust/common'
import {
    WorldArtifactEditor,
    type WorldArtifactEditorState,
} from '@wanderlust/common/components'
import { generateWorldArtifactDraft } from '@/server/ai'
import {
    createWorldArtifact,
    findWorldArtifactById,
    findWorldArtifacts,
    updateWorldArtifact,
} from '@/server/worldArtifact'
import { uploadWorldArtifactImage } from '@/server/worldArtifactImage'

import styles from './WorldEditor.module.scss'

type WorldEditorProps = {
    world: WorldRecord
}

type AssistantSuggestion = {
    id: string
    title: string
    detail: string
    artifactId?: string
}

const worldArtifactEditorServices: WorldArtifactEditorServices = {
    createWorldArtifact,
    findWorldArtifactById,
    findWorldArtifacts,
    generateWorldArtifactDraft,
    updateWorldArtifact,
    uploadWorldArtifactImage,
}

const TYPE_DESCRIPTION: Record<WorldArtifactType, string> = {
    World: 'Setting foundations and global truths',
    Location: 'Regions, settlements, and nested places',
    Campaign: 'Long-running stories in this world',
    Scenario: 'Focused adventures and situations',
    Encounter: 'Playable conflicts and challenges',
    Creature: 'People, monsters, and factions',
    Item: 'Objects, treasure, and equipment',
}

function getLocationDepth(title: string) {
    return Math.max(0, title.split('/').length - 1)
}

function getLocationLabel(title: string) {
    return title.split('/').at(-1)?.trim() || title
}

function buildSuggestions(artifacts: WorldArtifact[]): AssistantSuggestion[] {
    const suggestions: AssistantSuggestion[] = []
    const artifactTypes = new Set(
        artifacts.map((artifact) => artifact.artifactType)
    )

    if (!artifactTypes.has('World')) {
        suggestions.push({
            id: 'world-foundation',
            title: 'Define the world foundation',
            detail: 'Add a World artifact that establishes the setting premise, tone, and rules that every other artifact should honor.',
        })
    }

    const sparseArtifact = artifacts.find(
        (artifact) => artifact.descriptionMarkdown.trim().length < 120
    )

    if (sparseArtifact) {
        suggestions.push({
            id: `expand-${sparseArtifact.id}`,
            artifactId: sparseArtifact.id,
            title: `Develop ${sparseArtifact.title}`,
            detail: `This ${sparseArtifact.artifactType.toLowerCase()} is still lightly described. Add motivations, sensory details, and connections to other world elements.`,
        })
    }

    if (!artifactTypes.has('Location')) {
        suggestions.push({
            id: 'first-location',
            title: 'Give the story somewhere to begin',
            detail: 'Create a Location artifact for a starting region or settlement. Use “Region / Place” titles to build a navigable hierarchy.',
        })
    }

    if (!artifactTypes.has('Creature')) {
        suggestions.push({
            id: 'first-creature',
            title: 'Add a living point of view',
            detail: 'Introduce a person, creature, or faction that reveals what daily life and conflict feel like in this world.',
        })
    }

    if (artifacts.length > 2 && !artifactTypes.has('Scenario')) {
        suggestions.push({
            id: 'connect-lore',
            title: 'Turn the lore into a situation',
            detail: 'Your world has enough material for a Scenario. Connect two existing artifacts with a problem that demands action.',
        })
    }

    return suggestions.slice(0, 6)
}

export function WorldEditor({ world }: WorldEditorProps) {
    const [query, setQuery] = useState('')
    const [artifacts, setArtifacts] = useState<WorldArtifact[]>([])
    const [editorState, setEditorState] = useState<WorldArtifactEditorState>({
        mode: 'idle',
    })
    const [refreshToken, setRefreshToken] = useState(0)
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        let isCurrent = true

        startTransition(async () => {
            const nextArtifacts = await findWorldArtifacts({
                worldId: world.id,
                query,
            })

            if (isCurrent) {
                setArtifacts(nextArtifacts)
            }
        })

        return () => {
            isCurrent = false
        }
    }, [query, refreshToken, world.id])

    const groupedArtifacts = useMemo(() => {
        return WORLD_ARTIFACT_TYPES.reduce<
            Record<WorldArtifactType, WorldArtifact[]>
        >(
            (groups, artifactType) => {
                groups[artifactType] = artifacts
                    .filter(
                        (artifact) => artifact.artifactType === artifactType
                    )
                    .sort((left, right) =>
                        left.title.localeCompare(right.title)
                    )
                return groups
            },
            {} as Record<WorldArtifactType, WorldArtifact[]>
        )
    }, [artifacts])

    const suggestions = useMemo(() => buildSuggestions(artifacts), [artifacts])

    const createArtifact = (artifactType: WorldArtifactType) => {
        setEditorState({ mode: 'create', artifactType })
    }

    const editArtifact = (artifactId: string) => {
        setEditorState({ mode: 'edit', artifactId })
    }

    const handleSaved = (artifactId: string) => {
        setEditorState({ mode: 'edit', artifactId })
        setRefreshToken((current) => current + 1)
    }

    return (
        <main className={styles.shell}>
            <header className={styles.topbar}>
                <div className={styles.identity}>
                    <a
                        className={styles.backLink}
                        href="/user"
                        aria-label="Back to user home"
                    >
                        <IconArrowLeft size={18} aria-hidden="true" />
                    </a>
                    <div className={styles.titleBlock}>
                        <span className={styles.eyebrow}>World editor</span>
                        <h1 className={styles.worldTitle}>{world.name}</h1>
                    </div>
                </div>
                <div className={styles.workspaceStatus}>
                    <span className={styles.statusDot} aria-hidden="true" />
                    {isPending ? 'Updating workspace…' : 'Workspace up to date'}
                </div>
            </header>

            <div className={styles.regions}>
                <aside className={styles.explorer} aria-label="World artifacts">
                    <div className={styles.panelHeader}>
                        <div>
                            <span className={styles.panelEyebrow}>
                                Explorer
                            </span>
                            <h2 className={styles.panelTitle}>
                                World artifacts
                            </h2>
                        </div>
                        <span className={styles.countBadge}>
                            {artifacts.length}
                        </span>
                    </div>

                    <label className={styles.searchField}>
                        <IconSearch size={16} aria-hidden="true" />
                        <span className="sr-only">Search world artifacts</span>
                        <input
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search artifacts"
                        />
                    </label>

                    <div className={styles.groupList} aria-busy={isPending}>
                        {WORLD_ARTIFACT_TYPES.map((artifactType) => {
                            const groupArtifacts =
                                groupedArtifacts[artifactType]

                            return (
                                <section
                                    className={styles.artifactGroup}
                                    key={artifactType}
                                >
                                    <div className={styles.groupHeading}>
                                        <div className={styles.groupLabel}>
                                            <IconChevronDown
                                                size={14}
                                                aria-hidden="true"
                                            />
                                            <span>{artifactType}</span>
                                            <span className={styles.groupCount}>
                                                {groupArtifacts.length}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            className={styles.addButton}
                                            onClick={() =>
                                                createArtifact(artifactType)
                                            }
                                            aria-label={`Add ${artifactType} artifact`}
                                            title={`Add ${artifactType}`}
                                        >
                                            <IconPlus
                                                size={16}
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                    <p className={styles.groupDescription}>
                                        {TYPE_DESCRIPTION[artifactType]}
                                    </p>
                                    {groupArtifacts.length > 0 ? (
                                        <div className={styles.artifactList}>
                                            {groupArtifacts.map((artifact) => {
                                                const isSelected =
                                                    editorState.mode ===
                                                        'edit' &&
                                                    editorState.artifactId ===
                                                        artifact.id
                                                const depth =
                                                    artifactType === 'Location'
                                                        ? getLocationDepth(
                                                              artifact.title
                                                          )
                                                        : 0

                                                return (
                                                    <button
                                                        type="button"
                                                        key={artifact.id}
                                                        className={[
                                                            styles.artifactItem,
                                                            isSelected
                                                                ? styles.artifactItemSelected
                                                                : '',
                                                        ].join(' ')}
                                                        style={{
                                                            paddingInlineStart: `${0.75 + depth * 0.9}rem`,
                                                        }}
                                                        onClick={() =>
                                                            editArtifact(
                                                                artifact.id
                                                            )
                                                        }
                                                    >
                                                        <IconFileText
                                                            size={14}
                                                            aria-hidden="true"
                                                        />
                                                        <span>
                                                            {artifactType ===
                                                            'Location'
                                                                ? getLocationLabel(
                                                                      artifact.title
                                                                  )
                                                                : artifact.title}
                                                        </span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    ) : null}
                                </section>
                            )
                        })}
                    </div>
                </aside>

                <section className={styles.editor} aria-label="Artifact editor">
                    <WorldArtifactEditor
                        state={editorState}
                        worldId={world.id}
                        onSaved={handleSaved}
                        services={worldArtifactEditorServices}
                    />
                </section>

                <aside className={styles.assistant} aria-label="AI suggestions">
                    <div className={styles.panelHeader}>
                        <div>
                            <span className={styles.panelEyebrow}>
                                AI assistant
                            </span>
                            <h2 className={styles.panelTitle}>Suggestions</h2>
                        </div>
                        <IconSparkles
                            className={styles.assistantIcon}
                            size={20}
                            aria-hidden="true"
                        />
                    </div>
                    <p className={styles.assistantIntro}>
                        Suggestions refresh automatically as your world grows.
                    </p>
                    <div className={styles.suggestionList} aria-live="polite">
                        {suggestions.length > 0 ? (
                            suggestions.map((suggestion) => (
                                <article
                                    className={styles.suggestionCard}
                                    key={suggestion.id}
                                >
                                    <IconBulb size={16} aria-hidden="true" />
                                    <div>
                                        <h3>{suggestion.title}</h3>
                                        <p>{suggestion.detail}</p>
                                        {suggestion.artifactId ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    editArtifact(
                                                        suggestion.artifactId!
                                                    )
                                                }
                                            >
                                                Open artifact
                                            </button>
                                        ) : null}
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className={styles.assistantEmpty}>
                                <IconSparkles size={24} aria-hidden="true" />
                                <p>
                                    Your world has strong coverage. Keep writing
                                    and new suggestions will appear here.
                                </p>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </main>
    )
}
